'use strict';

const tg = require('telegram-node-bot');
const config = require('./config.json');

const EveryoneController = require('./everyoneController.js');

const bot = new tg.Telegram(config.telegramApiKey, {
    workers: config.botWorkers
});

bot.router
    .when(new tg.TextCommand('/everyone', 'everyone'), new EveryoneController())
    .when(new tg.TextCommand('/in', 'in'), new EveryoneController())
    .when(new tg.TextCommand('/out', 'out'), new EveryoneController());