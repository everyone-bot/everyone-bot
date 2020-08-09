'use strict'

import Telegraf from 'telegraf'

import SettingsRepository from './util/settingsRepository'
import GroupRepository from './util/groupRepository'
import StatisticsRepository from './util/statisticsRepository'
import MentionBuilder from './util/mentionBuilder'
import FirebaseSettings from './domain/firebaseSettings'

import OnboardingController from './controllers/onboardingController'
import EveryoneController from './controllers/everyoneController'

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

const onboardingController = new OnboardingController(
    groupRepository,
    settings
)

const everyoneController = new EveryoneController(
    groupRepository,
    mentionBuilder,
    statisticsRepository,
)

bot.command('everyone', everyoneController.everyone)
bot.command('in', everyoneController.in)
bot.command('out', everyoneController.out)
bot.command('start', onboardingController.start)
bot.command('clean', onboardingController.removeInactiveMembers)

bot.on('left_chat_member', onboardingController.userLeaveGroup)

bot.startPolling()

console.log('EveryoneBot has started!')