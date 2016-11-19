'use strict';

const tg = require('telegram-node-bot');
const config = require('./config.json');

const bot = new tg.Telegram(config.telegramApiKey, {
    workers: config.botWorkers
});

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

    handle($) {
        const parsedText = this.parseMessage($.message.text);
        $.sendMessage(`Hey @aquibm ${parsedText}`);
    }

    get routes() {
        return {
            'everyoneCommand': 'handle'
        }
    }
}

bot.router
    .when(new tg.TextCommand('/everyone', 'everyoneCommand'), new EveryoneController());