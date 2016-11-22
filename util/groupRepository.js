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
            return members;
        }).catch(error => {
            // TODO(AM): Should write this to a log.
            console.log(error.response.body);
        });
    }
}

module.exports = GroupRepository;