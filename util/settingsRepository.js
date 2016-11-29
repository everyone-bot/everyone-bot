class SettingsRepository {
    constructor(config) {
        this._config = config;
    }

    get telegramApiKey() {
        return process.env.TELEGRAM_API_KEY || this._config.telegramApiKey;
    }

    get botWorkers() {
        return process.env.BOT_WORKERS ? Number.parseInt(process.env.BOT_WORKERS, 10) : this._config.botWorkers;
    }

    get firebaseProjectName() {
        return process.env.FIREBASE_PROJECT_NAME || this._config.firebaseProjectName;
    }

    get firebaseDatabaseSecret() {
        return process.env.FIREBASE_DATABASE_SECRET || this._config.firebaseDatabaseSecret;
    }
}

module.exports = SettingsRepository;