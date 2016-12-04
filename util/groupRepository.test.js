import test from 'ava';
import nock from 'nock';

const FirebaseSettings = require('../domain/firebaseSettings');
const GroupRepository = require('./groupRepository');

test.beforeEach(t => {
    let firebaseSettings = new FirebaseSettings('example', 'database-key');
    t.context.repo = new GroupRepository(firebaseSettings);
});

test('should be able to opt users in', t => {
    
});

nock('https://example.firebaseio.com').patch('/group/1234/members/1.json').reply(200);