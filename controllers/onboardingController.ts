import { TelegrafContext } from 'telegraf/typings/context'

import User from '../domain/user'
import AuthorizationError from '../domain/authorizationError'
import GroupRepository from '../util/groupRepository'
import SettingsRepository from '../util/settingsRepository'

export default class OnboardingController {
    groupRepository: GroupRepository
    settingsRepository: SettingsRepository

    constructor(groupRepository: GroupRepository, settingsRepository: SettingsRepository) {
        this.groupRepository = groupRepository
        this.settingsRepository = settingsRepository
    }

    start = (ctx: TelegrafContext) => {
        ctx.reply(
            'Hey! I can help notify everyone in the group when someone needs them. ' +
                'Everyone who wishes to receive mentions needs to /in to opt-in. All opted-in users can then ' +
                'be mentioned using /everyone',
        )
    }

    userLeaveGroup = async (ctx: TelegrafContext) => {
        try {
            if (!ctx.message) throw new Error('No `message` found on context')

            const { left_chat_member, chat } = ctx.message

            if (!left_chat_member) throw new Error('No `left_chat_member` found on ctx.message')

            const user = new User(left_chat_member.id, left_chat_member.username || left_chat_member.first_name)
            const groupId = chat.id

            await this.groupRepository.optOut(user, groupId)
        } catch(error) {
            if (error instanceof SyntaxError) {
                // User did not have a username, forget about it.
                return
            }

            console.log(error)
        }
    }

    // TODO(AM): This really belongs in a worker at the end of a queue somewhere D:
    removeInactiveMembers = async (ctx: TelegrafContext) => {
        try {
            if (!ctx.from) throw new Error('No `from` found on context')
            if (!ctx.chat) throw new Error('No `chat` found on context')

            if(!this.settingsRepository.enableRemoveInactiveMembersCommand) {
                ctx.reply('Sorry, this command has been temporarily disabled. For more information head over to https://github.com/everyone-bot/everyone-bot')
                return
            }

            const userId = ctx.from.id
            const groupId = ctx.chat.id

            const sender = await ctx.tg.getChatMember(groupId, userId)

            if(sender.status !== 'creator' && sender.status !== 'administrator') {
                throw new AuthorizationError('You must be an administrator to use this command!')
            }

            ctx.reply('Attention: This is very beta functionality which might be disabled / removed at any point. It may take some time to process large groups, please be patient')

            const group = await this.groupRepository.getGroup(groupId)

            let removedUserCount: number = 0
            let erroredRemovals: User[] = []

            for(let i = 0; i < group.users.length; i++) {
                const user = group.users[i]

                try {
                    const chatMember = await ctx.tg.getChatMember(groupId, user.id)
                    
                    if(chatMember.status === 'left' || chatMember.status === 'kicked') {
                        await this.groupRepository.optOut(user, groupId)
                        removedUserCount++
                    }

                } catch(error) {
                    erroredRemovals.push(user)
                    console.log(error)
                }
            }

            if(removedUserCount === 0) {
                ctx.reply('Clean up complete - all opted-in users are active.')
            } else {
                ctx.reply(`Clean up complete - successfully removed ${removedUserCount} users from the database`)
            }

            if(erroredRemovals.length > 0) {
                const erroredUsernames = erroredRemovals
                    .map(user => user.username)
                    .join(', ')

                ctx.reply(`Failed to remove the following users: ${erroredUsernames}`)
            }
        } catch(error) {
            if(error instanceof AuthorizationError) {
                ctx.reply(error.message)
                return
            }

            console.log(error)
        }
    }
}
