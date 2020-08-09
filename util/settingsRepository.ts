export type Config = {
    telegramApiKey: string,
    botUsername: string,
    firebaseProjectName: string,
    firebaseDatabaseSecret: string,
    mentionsPerMessage: number,
    enableRemoveInactiveMembersCommand: boolean
}

/**
 * Responsible for providing application settings through either environment variables or a config file.
 */
export default class SettingsRepository {
    _config: Config

    /**
     * @param  {Config} config - Contents of a configuration file to use when environment variables are not available.
     * @return {SettingsRepository}
     */
    constructor(config: Config) {
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

    /**
     * @return {bool}
     */
    get enableRemoveInactiveMembersCommand() {
        return process.env.ENABLE_REMOVE_INACTIVE_MEMBERS_COMMAND
            ? Boolean(process.env.ENABLE_REMOVE_INACTIVE_MEMBERS_COMMAND)
            : this._config.enableRemoveInactiveMembersCommand
    }   
}
