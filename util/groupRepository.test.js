import test from 'ava';
import nock from 'nock';

const FirebaseSettings = require('../domain/firebaseSettings');
const User = require('../domain/user');
const GroupRepository = require('./groupRepository');

const optInMock = nock('https://example.firebaseio.com')
    .patch('/groups/1234/members/1.json?auth=database-key')
    .reply(200);

const optOutMock = nock('https://example.firebaseio.com')
    .patch('/groups/2345/members/1.json?auth=database-key')
    .reply(200);

const getGroupMock = nock('https://example.firebaseio.com')
    .get('/groups/1234.json?auth=database-key')
    .reply(200, {
        "members": {
            "1": {
                "id": 1,
                "username": "aquibm",
                "optIn": true
            },
            "2": {
                "id": 2,
                "username": "not-aquibm",
                "optIn": false
            }
        }
    });

const fakeUser = new User(1, 'aquibm');
const firebaseSettings = new FirebaseSettings('example', 'database-key');

test.beforeEach(async t => {
    t.context.repo = new GroupRepository(firebaseSettings);
});

// Opt in
test('optIn should throw if user is undefined', async t => {
    t.throws(() => {
        t.context.repo.optIn(undefined, 1234);
    });

    t.is(optInMock.isDone(), false);
});

test('optIn should throw if groupId is undefined', async t => {
    t.throws(() => {
        t.context.repo.optIn(fakeUser);
    });

    t.is(optInMock.isDone(), false);
});

test('optIn should throw if groupId is not a number', async t => {
    t.throws(() => {
        t.context.repo.optIn(fakeUser, '1234');
    });

    t.is(optInMock.isDone(), false);
});

test('optIn should opt users in', async t => {
    await t.context.repo.optIn(fakeUser, 1234);
    t.is(optInMock.isDone(), true);
});

// Opt out
test('optOut should throw if user is undefined', async t => {
    t.throws(() => {
        t.context.repo.optOut(undefined, 2345);
    });

    t.is(optOutMock.isDone(), false);
});

test('optOut should throw if groupId is undefined', async t => {
    t.throws(() => {
        t.context.repo.optOut(fakeUser, undefined);
    });

    t.is(optOutMock.isDone(), false);
});

test('optOut should throw if groupId is not a number', async t => {
    t.throws(() => {
        t.context.repo.optOut(fakeUser, '2345');
    });

    t.is(optOutMock.isDone(), false);
});

test('optOut should opt users out', async t => {
    await t.context.repo.optOut(fakeUser, 2345);
    t.is(optOutMock.isDone(), true);
});

// Get group
test('getGroup should throw if groupId is undefined', async t => {
    t.throws(() => {
        t.context.repo.getGroup();
    });
});

test('getGroup should throw if groupId is not a number', async t => {
    t.throws(() => {
        t.context.repo.getGroup('1234');
    });
});

test('getGroup should get and process groups', async t => {
    const group = await t.context.repo.getGroup(1234);
    t.is(getGroupMock.isDone(), true);
    t.is(group.users.length, 1);
});