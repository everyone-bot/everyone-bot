module.exports = {
    start: ctx => {
        ctx.reply(
            'Hey! I can help notify everyone in the group when someone needs them. ' +
                'Everyone who wishes to receive mentions needs to /in to opt-in. All opted-in users can then ' +
                'be mentioned using /everyone',
        )

        console.log(ctx.from)
    },
}
