/**
 * Responsible for providing application settings through either environment variables or a config file.
 */
class SettingsRepository {
    /**
     * @param  {Object} config - Contents of a configuration file to use when environemnt variables are not available.
     * @return {SettingsRepository}
     */
    constructor(config) {
        this._config = config
    }

    /**
     * @return {String}
     */
    get telegramApiKey() {
        return process.env.TELEGRAM_API_KEY || this._config.telegramApiKey
    }

    /**
     * @return {String}
     */
    get botUsername() {
        return process.env.BOT_USERNAME || this._config.botUsername
    }

    /**
     * @return {String}
     */
    get firebaseProjectName() {
        return (
            process.env.FIREBASE_PROJECT_NAME ||
            this._config.firebaseProjectName
        )
    }

    /**
     * @return {String}
     */
    get firebaseDatabaseSecret() {
        return (
            process.env.FIREBASE_DATABASE_SECRET ||
            this._config.firebaseDatabaseSecret
        )
    }

    /**
     * @return {string}
     */
    get mentionsPerMessage() {
        return process.env.MENTIONS_PER_MESSAGE
            ? Number.parseInt(process.env.MENTIONS_PER_MESSAGE, 10)
            : this._config.mentionsPerMessage
    }
}

module.exports = SettingsRepository
