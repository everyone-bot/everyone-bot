import test from 'ava';

const SettingsRepository = require('./SettingsRepository');
const MentionBuilder = require('./mentionBuilder');
const TestUserBuilder = require('./testUserBuilder');

test.beforeEach(t => {
    process.env.MENTIONS_PER_MESSAGE = 5;

    const settings = new SettingsRepository({});
    t.context.builder = new MentionBuilder(settings);
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

test('can chunk the same amount of users as mentions per message', t => {
    
});

test('can chunk fewer users than mentions per message', t => {
    
});

test('can chunk users into two even groups', t => {
    
});

test('can chunk users into three un-even groups', t => {
    
});

test('should not throw when chunking a group of no users', t => {
    
});