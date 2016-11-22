'use strict';

const tg = require('telegram-node-bot');
const arg = require('./util/arg');

class EveryoneController extends tg.TelegramBaseController {
    constructor(groupRepository) {
        super();

        arg.checkIfExists(groupRepository, 'groupRepository');
        this.groupRepository = groupRepository;
    }

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

        this.groupRepository.getMembers($._chatId).then(members => {
            $.sendMessage(`@${members[0].username} - ${parsedText}`);
        }).catch(error => {
            // TOOD(AM): Consider options here: What went wrong?
            console.log(error);
        });
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