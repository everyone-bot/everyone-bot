import test from 'ava';

const SettingsRepository = require('./SettingsRepository');
const MentionBuilder = require('./mentionBuilder');

test.beforeEach(t => {
    process.env.MENTIONS_PER_MESSAGE = 5;

    const settings = new SettingsRepository({});
    t.context.builder = new MentionBuilder(settings);
});

test('can chunk', t => {
    t.is(t.context.builder.build(), 5);
});