import test from 'ava';
import nock from 'nock';

const FirebaseSettings = require('../domain/firebaseSettings');
const StatisticsRepository = require('./statisticsRepository');

let numberOfMentions = 321;
const getMentionsMock = nock('https://example.firebaseio.com')
    .get('/statistics/mentions.json?auth=database-key')
    .reply(200, numberOfMentions);

const setMentionsMock = nock('https://example.firebaseio.com')
    .put('/statistics/mentions.json?auth=database-key', function(newMentions) {
        numberOfMentions = newMentions
    }).reply(200, numberOfMentions);

test.beforeEach(async t => {
    const firebaseSettings = new FirebaseSettings('example', 'database-key');
    t.context.repo = new StatisticsRepository(firebaseSettings);
});

test('should throw if amount is undefined', t => {
    t.throws(() => {
        t.context.repo.incrementMentions();
    });
});

test('should throw if amount is not a number', t => {
    t.throws(() => {
        t.context.repo.incrementMentions('not a number');
    });
});

test('should be able to increment mentions', async t => {
    const incrementBy = 50;

    const newMentions = await t.context.repo.incrementMentions(incrementBy);

    t.is(newMentions, numberOfMentions + incrementBy);
});