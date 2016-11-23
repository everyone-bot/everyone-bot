const got = require('got');
const arg = require('./arg');

class GroupRepository {
    constructor(firebaseSettings) {
        arg.checkIfExists(firebaseSettings, 'firebaseSettings');

        this.firebaseSettings = firebaseSettings;
    }

    getMembers(groupId) {
        arg.checkIfNumber(groupId);

        const path = this.firebaseSettings.buildPath(`groups/${groupId}/members.json`);

        return got(path).then(response => {
            let members = JSON.parse(response.body);

            const referralString = Object.keys(members).reduce((acc, key) => {
                return `@${members[key].username} ${acc}`;
            }, '');

            console.log(referralString);

            return referralString;
        }).catch(error => {
            // TODO(AM): Should write this to a log.
            console.log(error.response.body);
        });
    }

    optIn(groupId, user) {
        arg.checkIfNumber(groupId, 'groupId');
        arg.checkIfExists(user, 'user');

        this.userExistsInGroup(groupId, user.id).then(exists => {
            if(!exists) {
                const path = this.firebaseSettings.buildPath(`groups/${groupId}/members/${user.id}.json`);
                const userData = {
                    id: user.id,
                    username: user.username,
                    firstName: user.firstName,
                    lastName: user.lastName
                };

                got.patch(path, {
                    body: JSON.stringify(userData)
                });
            }
        }).catch(error => {
            console.log(error);
        });
    }

    userExistsInGroup(groupId, userId) {
        arg.checkIfNumber(groupId, 'groupId');
        arg.checkIfNumber(userId, 'userId');

        const path = this.firebaseSettings.buildPath(`groups/${groupId}/members.json`,
            `orderBy="id"&startAt=${userId}&endAt=${userId}`);

        return got(path).then(response => {
            let user = JSON.parse(response.body);
            return typeof user.id !== 'undefined';
        }).catch(error => {
            console.log(error.response.body);
        });
    }
}

module.exports = GroupRepository;