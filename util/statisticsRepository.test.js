import test from 'ava';
import nock from 'nock';

const FirebaseSettings = require('../domain/firebaseSettings');
const StatisticsRepository = require('./statisticsRepository');

test.beforeEach(async t => {
    const firebaseSettings = new FirebaseSettings('example', 'database-key');
    t.context.repo = new StatisticsRepository(firebaseSettings);
    t.context.numberOfMentions = 321;

    nock('https://example.firebaseio.com')
        .get('/statistics/mentions.json?auth=database-key')
        .reply(200, t.context.numberOfMentions);

    nock('https://example.firebaseio.com/')
        .put('/statistics/mentions.json?auth=database-key')
        .reply(200, function(uri, body) {
            return body;
        });

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
    const initialMentions = t.context.numberOfMentions;
    
    const newMentions = await t.context.repo.incrementMentions(incrementBy);

    t.is(newMentions, initialMentions + incrementBy);
});