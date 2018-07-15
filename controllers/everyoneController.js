const User = require('../domain/user')

module.exports = (groupRepository, mentionBuilder, statisticsRepository) => {
    const getUserMessage = message => {
        const { text, entities } = message
        const commandEntity = entities.find(
            entity => entity.type === 'bot_command',
        )

        return text.slice(commandEntity.length)
    }

    return {
        everyone: ctx => {
            groupRepository
                .getGroup(ctx.chat.id)
                .then(group => {
                    if (!group.users.length) {
                        ctx.reply('No users opted in!')
                        return
                    }

                    const mentions = mentionBuilder.build(group.users)
                    const userMessage = getUserMessage(ctx.message)

                    mentions.forEach((mention, idx) => {
                        if (idx === mentions.length - 1) {
                            ctx.reply(mention + ' ' + userMessage)
                            return
                        }

                        ctx.reply(mention)
                    })

                    // Track statistics
                    statisticsRepository.incrementMentions(group.users.length)
                })
                .catch(err => {
                    console.log(err)
                })
        },

        in: ctx => {
            try {
                const user = new User(ctx.from.id, ctx.from.username)
                const groupId = ctx.chat.id

                groupRepository
                    .optIn(user, groupId)
                    .then(() => {
                        ctx.reply(`Thanks for opting in @${user.username}`)
                    })
                    .catch(err => {
                        console.log(err)
                    })
            } catch (error) {
                if (error instanceof SyntaxError) {
                    ctx.reply(
                        "Sorry, you'll need to set up a username before you can opt in",
                    )
                }

                console.log(error)
                return
            }
        },

        out: ctx => {
            try {
                const user = new User(ctx.from.id, ctx.from.username)
                const groupId = ctx.chat.id

                groupRepository
                    .optOut(user, groupId)
                    .then(() => {
                        ctx.reply(`You've been opted out @${user.username}`)
                    })
                    .catch(err => {
                        console.log(err)
                    })
            } catch (error) {
                if (error instanceof SyntaxError) {
                    ctx.reply(
                        "Sorry, you'll need to set up a username before you can opt in",
                    )
                }

                console.log(error)
                return
            }
        },
    }
}
