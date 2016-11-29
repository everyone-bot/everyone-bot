'use strict';

const tg = require('telegram-node-bot');
const SettingsRepository = require('./util/settingsRepository');
const GroupRepository = require('./util/groupRepository');
const FirebaseSettings = require('./domain/firebaseSettings');
const EveryoneController = require('./controllers/everyoneController.js');

const config = !process.env.PRODUCTION && require('./config.json');
const settings = new SettingsRepository(config);

const firebaseSettings = new FirebaseSettings(settings.firebaseProjectName, settings.firebaseDatabaseSecret);
const groupRepository = new GroupRepository(firebaseSettings);

const bot = new tg.Telegram(settings.telegramApiKey, {
    workers: settings.botWorkers
});

bot.router
    .when(new tg.TextCommand('/everyone', 'everyone'), new EveryoneController(groupRepository))
    .when(new tg.TextCommand('/in', 'in'), new EveryoneController(groupRepository))
    .when(new tg.TextCommand('/out', 'out'), new EveryoneController(groupRepository));