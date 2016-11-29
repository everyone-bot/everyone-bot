import test from 'ava';
const SettingsRepository = require('./settingsRepository');

const stubConfig = {
    "telegramApiKey": "TELEGRAM_API_KEY",
    "botWorkers": 1,
    "firebaseProjectName": "FIREBASE_PROJECT_NAME",
    "firebaseDatabaseSecret": "FIREBASE_DATABASE_SECRET"
};

test.beforeEach(t => {
    t.context.config = stubConfig;
});

test('should return config values when environment variables don\'t exist', t => {
    const settings = new SettingsRepository(t.context.config);

    t.is(settings.telegramApiKey, stubConfig.telegramApiKey);
    t.is(settings.botWorkers, stubConfig.botWorkers);
    t.is(settings.firebaseProjectName, stubConfig.firebaseProjectName);
    t.is(settings.firebaseDatabaseSecret, stubConfig.firebaseDatabaseSecret);
});

test('should prefer environment variables', t => {
    const settings = new SettingsRepository(t.context.config);

    process.env.TELEGRAM_API_KEY = 'env-telegram-api-key';
    process.env.BOT_WORKERS = 0;
    process.env.FIREBASE_PROJECT_NAME = 'env-firebase-project-name';
    process.env.FIREBASE_DATABASE_SECRET = 'env-firebase-database-secret';

    t.is(settings.telegramApiKey, 'env-telegram-api-key');
    t.is(settings.botWorkers, 0);
    t.is(settings.firebaseProjectName, 'env-firebase-project-name');
    t.is(settings.firebaseDatabaseSecret, 'env-firebase-database-secret');
});