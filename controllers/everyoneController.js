const User = require('../domain/user')

module.exports = (groupRepository, mentionBuilder, statisticsRepository) => ({
    everyone: ctx => {
        groupRepository
            .getGroup(ctx.chat.id)
            .then(group => {
                if (!group.users.length) {
                    ctx.reply('No users opted in!')
                    return
                }

                const mentions = mentionBuilder.build(group.users)

                mentions.forEach(mention => {
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
})
