const tg = require('telegram-node-bot');

class OnboardingController extends tg.TelegramBaseController {
    start($) {
        $.sendMessage('Hey! I can help notify everyone in the group when someone needs them. ' +
            'Everyone who wishes to receive mentions needs to /in to opt-in. All opted-in users can then ' +
            'be mentioned using /everyone');
    }

    get routes() {
        return {
            'start': 'start'
        };
    }
}

module.exports = OnboardingController;