import { TelegrafContext } from 'telegraf/typings/context'
import { IncomingMessage } from 'telegraf/typings/telegram-types'

import User from '../domain/user'
import GroupRepository from '../util/groupRepository'
import MentionBuilder from '../util/mentionBuilder'
import StatisticsRepository from '../util/statisticsRepository'

export default class EveryoneController {
    groupRepository: GroupRepository
    mentionBuilder: MentionBuilder
    statisticsRepository: StatisticsRepository

    /**
     * Initializes a new instance of EveryoneController
     */
    constructor(
        groupRepository: GroupRepository,
        mentionBuilder: MentionBuilder,
        statisticsRepository: StatisticsRepository
    ) {
        this.groupRepository = groupRepository
        this.mentionBuilder = mentionBuilder
        this.statisticsRepository = statisticsRepository
    }

    getUserMessage = (message: IncomingMessage): string => {
        const { text, entities } = message
        if (!text || !entities) return ''

        const commandEntity = entities.find(
            entity => entity.type === 'bot_command',
        )

        return text.slice(commandEntity?.length || 0)
    }

    everyone = async (ctx: TelegrafContext) => {
        try {
            if (!ctx.chat) throw new SyntaxError('No `chat` field found on context')
            if (!ctx.message) throw new SyntaxError('No `message` field found on context')

            const groupId = ctx.chat.id
            const group = await this.groupRepository.getGroup(groupId)

            if (!group.users.length) {
                ctx.reply('No users opted in!')
                return
            }

            const mentions = this.mentionBuilder.build(group.users)
            const userMessage = this.getUserMessage(ctx.message)

            mentions.forEach((mention, idx) => {
                if (idx === mentions.length - 1) {
                    ctx.reply(`${mention} ${userMessage}`, {
                        parse_mode: 'MarkdownV2'
                    })
                    return
                }

                ctx.reply(mention, {
                    parse_mode: 'MarkdownV2'
                })
            })

            this.statisticsRepository.incrementMentions(group.users.length)
        } catch(error) {
            console.log(error)
        }
    }

    in = async (ctx: TelegrafContext) => {
        try {
            if (!ctx.from) throw new Error('No `from` field found on context')
            if (!ctx.chat) throw new Error('No `chat` field found on context')

            const user = new User(ctx.from.id, ctx.from.username || ctx.from.first_name)
            const groupId = ctx.chat.id

            await this.groupRepository.optIn(user, groupId)
            ctx.reply(`Thanks for opting in ${user.username}`)

        } catch(error) {
            if (error instanceof SyntaxError) {
                ctx.reply(`Sorry, you don't seem to have a username or a first name :(`)
                return
            }

            console.log(error)
        }
    }

    out = async (ctx: TelegrafContext) => {
        try {
            if (!ctx.from) throw new Error('No `from` field found on context')
            if (!ctx.chat) throw new Error('No `chat` field found on context')

            const user = new User(ctx.from.id, ctx.from.username || ctx.from.first_name)
            const groupId = ctx.chat.id

            await this.groupRepository.optOut(user, groupId)
            ctx.reply(`You've been opted out ${user.username}`)

        } catch(error) {
            if (error instanceof SyntaxError) {
                ctx.reply(`Sorry, you don't seem to have a username or a first name :(`)
                return
            }

            console.log(error)
        }
    }
}
