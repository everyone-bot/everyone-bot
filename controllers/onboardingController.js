const User = require('../domain/user')

module.exports = groupRepository => ({
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
            const user = new User(left_chat_member.id, left_chat_member.username)
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
    }
})
