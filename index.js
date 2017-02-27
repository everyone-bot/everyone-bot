'use strict';

const tg = require('telegram-node-bot');
const SettingsRepository = require('./util/settingsRepository');
const GroupRepository = require('./util/groupRepository');
const StatisticsRepository = require('./util/statisticsRepository');
const MentionBuilder = require('./util/mentionBuilder');
const FirebaseSettings = require('./domain/firebaseSettings');
const EveryoneController = require('./controllers/everyoneController.js');
const OnboardingController = require('./controllers/onboardingController.js');

const config = !process.env.PRODUCTION && require('./config.json');
const settings = new SettingsRepository(config);

const mentionBuilder = new MentionBuilder(settings);
const firebaseSettings = new FirebaseSettings(settings.firebaseProjectName, settings.firebaseDatabaseSecret);
const groupRepository = new GroupRepository(firebaseSettings);
const statisticsRepository = new StatisticsRepository(firebaseSettings);

const bot = new tg.Telegram(settings.telegramApiKey, {
    workers: settings.botWorkers,
    webAdmin: {
        port: process.env.PORT || 7777
    }
});

bot.router
    .when(new tg.TextCommand('/everyone', 'everyone'), new EveryoneController(groupRepository, mentionBuilder, statisticsRepository))
    .when(new tg.TextCommand('/anyone', 'anyone'), new EveryoneController(groupRepository, mentionBuilder, statisticsRepository))
    .when(new tg.TextCommand('/in', 'in'), new EveryoneController(groupRepository, mentionBuilder, statisticsRepository))
    .when(new tg.TextCommand('/out', 'out'), new EveryoneController(groupRepository, mentionBuilder, statisticsRepository))
    .when(new tg.TextCommand('/start', 'start'), new OnboardingController());
