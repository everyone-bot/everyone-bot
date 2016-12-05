import test from 'ava';
import nock from 'nock';

const FirebaseSettings = require('../domain/firebaseSettings');
const User = require('../domain/user');
const GroupRepository = require('./groupRepository');

const optInMock = nock('https://example.firebaseio.com')
    .patch('/groups/1234/members/1.json?auth=database-key')
    .reply(200);

const fakeUser = new User(1, 'aquibm');
const firebaseSettings = new FirebaseSettings('example', 'database-key');

test.beforeEach(async t => {
    t.context.repo = new GroupRepository(firebaseSettings);
});

test('optIn should throw if user is undefined', async t => {
    t.throws(() => {
        t.context.repo.optIn(undefined, 1234);
    });
});

test('optIn should throw if groupId is undefined', async t => {
    t.throws(() => {
        t.context.repo.optIn(fakeUser);
    });
});

test('optIn should throw if groupId is not a number', async t => {
    t.throws(() => {
        t.context.repo.optIn(fakeUser, '1234');
    });
});

test('optin', async t => {
    t.plan(1);

    // TODO(AM): This expects a & at the end of the query params. Fix.
    await t.context.repo.optIn(fakeUser, 1234);
    t.is(optInMock.isDone(), true);
});