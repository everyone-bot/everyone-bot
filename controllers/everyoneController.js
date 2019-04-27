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
                    const replyPromises = []

                    mentions.forEach(mention => {
                        replyPromises.push(ctx.reply(mention))
                    })

                    // Track statistics
                    statisticsRepository.incrementMentions(group.users.length)

                    return Promise.all(replyPromises)
                })
                .then((replyDataArray) => {
                    const userMessage = getUserMessage(ctx.message)

                    if(!userMessage) {
                        return replyDataArray
                    }

                    return ctx.reply('@' + ctx.from.username + ':' + userMessage).then(() => {
                        return replyDataArray
                    })
                })
                .then((replyDataArray) => {
                    return new Promise(resolve => {
                        setTimeout(() => {
                            resolve(replyDataArray)
                        }, 2000)
                    })
                })
                .then(replyDataArray => {
                    const messageIdsToDelete = replyDataArray.map(data => data.message_id)
                    
                    messageIdsToDelete.forEach(messageId => {
                        ctx.telegram.deleteMessage(ctx.chat.id, messageId)
                    })
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
