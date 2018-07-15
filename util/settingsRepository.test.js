import test from 'ava'
const SettingsRepository = require('./settingsRepository')

const stubConfig = {
    telegramApiKey: 'TELEGRAM_API_KEY',
    botUsername: 'EVERYONE',
    firebaseProjectName: 'FIREBASE_PROJECT_NAME',
    firebaseDatabaseSecret: 'FIREBASE_DATABASE_SECRET',
    mentionsPerMessage: 5,
}

test.beforeEach(t => {
    t.context.config = stubConfig
})

test("should return config values when environment variables don't exist", t => {
    const settings = new SettingsRepository(t.context.config)

    t.is(settings.telegramApiKey, stubConfig.telegramApiKey)
    t.is(settings.botUsername, stubConfig.botUsername)
    t.is(settings.firebaseProjectName, stubConfig.firebaseProjectName)
    t.is(settings.firebaseDatabaseSecret, stubConfig.firebaseDatabaseSecret)
    t.is(settings.mentionsPerMessage, stubConfig.mentionsPerMessage)
})

test('should prefer environment variables', t => {
    const settings = new SettingsRepository(t.context.config)

    process.env.TELEGRAM_API_KEY = 'env-telegram-api-key'
    process.env.BOT_USERNAME = 'EVERYONE'
    process.env.FIREBASE_PROJECT_NAME = 'env-firebase-project-name'
    process.env.FIREBASE_DATABASE_SECRET = 'env-firebase-database-secret'
    process.env.MENTIONS_PER_MESSAGE = 1

    t.is(settings.telegramApiKey, 'env-telegram-api-key')
    t.is(settings.botUsername, 'EVERYONE')
    t.is(settings.firebaseProjectName, 'env-firebase-project-name')
    t.is(settings.firebaseDatabaseSecret, 'env-firebase-database-secret')
    t.is(settings.mentionsPerMessage, 1)
})
