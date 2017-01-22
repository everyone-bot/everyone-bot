import test from 'ava';

const SettingsRepository = require('./settingsRepository');
const MentionBuilder = require('./mentionBuilder');
const TestUserBuilder = require('./testUserBuilder');

test.beforeEach(t => {
    process.env.MENTIONS_PER_MESSAGE = '5';

    const settings = new SettingsRepository({});

    t.context.builder = new MentionBuilder(settings);
    t.context.chunkSize = settings.mentionsPerMessage;
});

test('should throw if users is undefined', t => {
    t.throws(() => {
        t.context.builder.build();
    });
});

test('should throw if users is not an array', t => {
    t.throws(() => {
        t.context.builder.build('clearly not a user');
    });
});

test('should throw if an empty users array is supplied', t => {
    t.throws(() => {
        t.context.builder.build([]);
    });
});

test('can chunk the same amount of users as mentions per message', t => {
    const users = new TestUserBuilder().buildMany(t.context.chunkSize);

    const messages = t.context.builder.build(users);

    t.is(messages.length, 1);
});

test('can chunk fewer users than mentions per message', t => {
    const users = new TestUserBuilder().buildMany(t.context.chunkSize - 2);

    const messages = t.context.builder.build(users);

    t.is(messages.length, 1);
});

test('can chunk users into two even groups', t => {
    const users = new TestUserBuilder().buildMany(t.context.chunkSize * 2);

    const messages = t.context.builder.build(users);

    t.is(messages.length, 2);
});

test('can chunk users into two un-even groups', t => {
    const users = new TestUserBuilder().buildMany((t.context.chunkSize * 2) - 2);

    const messages = t.context.builder.build(users);

    t.is(messages.length, 2);
});

test('can chunk users into three un-even groups', t => {
    const users = new TestUserBuilder().buildMany((t.context.chunkSize * 2) + 2);

    const messages = t.context.builder.build(users);

    t.is(messages.length, 3);
});

test('should not mutate users', t => {
    const users = new TestUserBuilder().buildMany(t.context.chunkSize);

    const messages = t.context.builder.build(users);

    t.is(messages.length, 1);
    t.is(users.length, t.context.chunkSize);
});

test('should return sendable messages', t => {
    const users = new TestUserBuilder().buildMany(t.context.chunkSize);

    const messages = t.context.builder.build(users);

    messages.forEach(message => {
        t.is(typeof message, 'string');
    });
});

test('should contain users in the returned messages', t => {
    const users = new TestUserBuilder().buildMany(t.context.chunkSize + 4);

    const messages = t.context.builder.build(users);

    users.forEach(user => {
        const mention = messages.find(message => {
            return message.indexOf(user.username) !== -1;
        });

        t.not(mention, undefined);
    });
});