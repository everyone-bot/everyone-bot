'use strict';

const tg = require('telegram-node-bot');

class EveryoneController extends tg.TelegramBaseController {
    parseMessage(message) {
        const parsed = message
            .replace(/\/everyone\s?(@EveryoneTheBot)?\s?/gmi, '')
            .trim();

        if(!parsed.length) {
            throw new Error('No message found');
        }

        return parsed;
    }

    everyone($) {
        const parsedText = this.parseMessage($.message.text);
        $.sendMessage(`Hey @aquibm ${parsedText}`);
    }

    in($) {
        $.sendMessage('You\'re in!');
    }

    out($) {
        $.sendMessage('Boo');
    }

    get routes() {
        return {
            'everyone': 'everyone',
            'in': 'in',
            'out': 'out'
        }
    }
}

module.exports = EveryoneController;