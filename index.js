'use strict';

const tg = require('telegram-node-bot');
const GroupRepository = require('./util/groupRepository');
const FirebaseSettings = require('./util/firebaseSettings');
const EveryoneController = require('./everyoneController.js');

const config = require('./config.json');

const firebaseSettings = new FirebaseSettings(config.firebaseProjectName, config.firebaseDatabaseSecret);
const groupRepository = new GroupRepository(firebaseSettings);

const bot = new tg.Telegram(config.telegramApiKey, {
    workers: config.botWorkers
});

bot.router
    .when(new tg.TextCommand('/everyone', 'everyone'), new EveryoneController(groupRepository))
    .when(new tg.TextCommand('/in', 'in'), new EveryoneController(groupRepository))
    .when(new tg.TextCommand('/out', 'out'), new EveryoneController(groupRepository));