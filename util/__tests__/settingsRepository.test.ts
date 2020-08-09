import SettingsRepository from '../settingsRepository'
import stubConfig from '../__stubs__/config.stub'

describe('Settings repository tests', () => {
    it('should return config values when environment variables don\'t exist', () => {
        const settings = new SettingsRepository(stubConfig)

        expect(settings.telegramApiKey).toEqual(stubConfig.telegramApiKey)
        expect(settings.botUsername).toEqual(stubConfig.botUsername)
        expect(settings.firebaseProjectName).toEqual(stubConfig.firebaseProjectName)
        expect(settings.firebaseDatabaseSecret).toEqual(stubConfig.firebaseDatabaseSecret)
        expect(settings.mentionsPerMessage).toEqual(stubConfig.mentionsPerMessage)
        expect(settings.enableRemoveInactiveMembersCommand).toEqual(stubConfig.enableRemoveInactiveMembersCommand)
    })

    it('should convert and prefer env vars when they do exist', () => {
        const settings = new SettingsRepository(stubConfig)

        process.env.TELEGRAM_API_KEY = 'env-telegram-api-key'
        process.env.BOT_USERNAME = 'ENV_EVERYONE'
        process.env.FIREBASE_PROJECT_NAME = 'env-firebase-project-name'
        process.env.FIREBASE_DATABASE_SECRET = 'env-firebase-database-secret'
        process.env.MENTIONS_PER_MESSAGE = '1'
        process.env.ENABLE_REMOVE_INACTIVE_MEMBERS_COMMAND = 'true'

        expect(settings.telegramApiKey).toEqual(process.env.TELEGRAM_API_KEY)
        expect(settings.botUsername).toEqual(process.env.BOT_USERNAME)
        expect(settings.firebaseProjectName).toEqual(process.env.FIREBASE_PROJECT_NAME)
        expect(settings.firebaseDatabaseSecret).toEqual(process.env.FIREBASE_DATABASE_SECRET)
        expect(settings.mentionsPerMessage).toEqual(1)
        expect(settings.enableRemoveInactiveMembersCommand).toBeTruthy()
    })
})
