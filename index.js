'use strict'

const Telegraf = require('telegraf')
const SettingsRepository = require('./util/settingsRepository')
const GroupRepository = require('./util/groupRepository')
const StatisticsRepository = require('./util/statisticsRepository')
const MentionBuilder = require('./util/mentionBuilder')
const FirebaseSettings = require('./domain/firebaseSettings')

const config = !process.env.PRODUCTION && require('./config.json')
const settings = new SettingsRepository(config)

const mentionBuilder = new MentionBuilder(settings)
const firebaseSettings = new FirebaseSettings(
    settings.firebaseProjectName,
    settings.firebaseDatabaseSecret,
)
const groupRepository = new GroupRepository(firebaseSettings)
const statisticsRepository = new StatisticsRepository(firebaseSettings)

const bot = new Telegraf(settings.telegramApiKey, {
    username: settings.botUsername,
})

const onboardingController = require('./controllers/onboardingController')
const everyoneController = require('./controllers/everyoneController')(
    groupRepository,
    mentionBuilder,
    statisticsRepository,
)

bot.command('everyone', everyoneController.everyone)
bot.command('in', everyoneController.in)
bot.command('out', everyoneController.out)
bot.command('start', onboardingController.start)

bot.startPolling()
