'use strict';

const tg = require('telegram-node-bot');
const arg = require('../util/arg');
const User = require('../domain/user');

class EveryoneController extends tg.TelegramBaseController {
    constructor(groupRepository, mentionBuilder, statisticsRepository) {
        super();

        arg.checkIfExists(groupRepository, 'groupRepository');
        arg.checkIfExists(mentionBuilder, 'mentionBuilder');
        arg.checkIfExists(statisticsRepository, 'statisticsRepository');

        this.groupRepository = groupRepository;
        this.mentionBuilder = mentionBuilder;
        this.statisticsRepository = statisticsRepository;
    }

    everyone($) {
        this.groupRepository.getGroup($._chatId).then(group => {
            if(!group.users.length) {
                $.sendMessage('No users opted in!');
                return;
            }

            const mentions = this.mentionBuilder.build(group.users);

            mentions.forEach(mention => {
                $.sendMessage(mention);
            });
            
            // Track statistics
            this.statisticsRepository.incrementMentions(group.users.length);

        }).catch(err => {
            console.log(err);
        });
    }

    in($) {
        try {
            const sender = $._message.from;
            const user = new User(sender.id, sender.username);
            const groupId = $._chatId;
            
            this.groupRepository.optIn(user, groupId).then(() => {
                $.sendMessage(`Thanks for opting in @${user.username}`);
            }).catch(err => {
                console.log(err);
            });
        } catch(error) {
            if(error instanceof SyntaxError) {
                $.sendMessage('Sorry, you\'ll need to set up a username before you can opt in');
            }

            console.log(error);
            return;
        }
    }

    out($) {
        try {
            const sender = $._message.from;
            const user = new User(sender.id, sender.username);
            const groupId = $._chatId;

            this.groupRepository.optOut(user, groupId).then(() => {
                $.sendMessage(`You've been opted out @${user.username}`)
            }).catch(err => {
                console.log(err);
            });
        } catch(error) {
            if(error instanceof SyntaxError) {
                $.sendMessage('Sorry, you\'ll need to set up a username before you can opt in');
            }

            console.log(error);
            return;
        }
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