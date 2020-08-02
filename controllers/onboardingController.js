const User = require('../domain/user')
const AuthorizationError = require('../domain/authorizationError')

module.exports = (groupRepository, settingsRepository) => ({
    start: ctx => {
        ctx.reply(
            'Hey! I can help notify everyone in the group when someone needs them. ' +
                'Everyone who wishes to receive mentions needs to /in to opt-in. All opted-in users can then ' +
                'be mentioned using /everyone',
        )
    },

    userLeaveGroup: ctx => {
        try {
            const { left_chat_member, chat } = ctx.message
            const user = new User(left_chat_member.id, left_chat_member.username || left_chat_member.first_name)
            const groupId = chat.id

            groupRepository
                    .optOut(user, groupId)
                    .catch(err => {
                        console.log(err)
                    })
        } catch (error) {
            if (error instanceof SyntaxError) {
                // User did not have a username, forget about it.
                return
            }

            console.log(error)
            return
        }
    },

    // TODO(AM): This really belongs in a worker at the end of a queue somewhere D:
    removeInactiveMembers: async (ctx) => {
        try {
            if(!settingsRepository.enableRemoveInactiveMembersCommand) {
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

            const group = await groupRepository.getGroup(groupId)

            let removedUserCount = 0
            let erroredRemovals = []

            for(let i = 0; i < group.users.length; i++) {
                const user = group.users[i]

                try {
                    const chatMember = await ctx.tg.getChatMember(groupId, user.id)
                    
                    if(chatMember.status === 'left' || chatMember.status === 'kicked') {
                        await groupRepository.optOut(user, groupId)
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
            return
        }
    }
})
