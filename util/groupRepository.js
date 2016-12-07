const got = require('got');
const arg = require('./arg');
const User = require('../domain/user');
const Group = require('../domain/group');

/**
 * Responsible for integrating with Firebase to save and load group inforamtion.
 */
class GroupRepository {
    /**
     * @param  {FirebaseSettings} firebaseSettings
     * @return {GroupRepository}
     */
    constructor(firebaseSettings) {
        arg.checkIfExists(firebaseSettings, 'firebaseSettings');
        this.firebaseSettings = firebaseSettings;
    }

    /**
     * @param  {Number} groupId - Unique telegram identifier for a group.
     * @return {Promise<Group>}
     */
    getGroup(groupId) {
        arg.checkIfNumber(groupId, 'groupId');

        const path = this.firebaseSettings.buildPath(`groups/${groupId}.json`);

        return got(path).then(response => {
            const group = JSON.parse(response.body);

            if(!group || !group.members) {
                return new Group(groupId, []);
            }

            const users = Object.keys(group.members).map(userId => {
                const user = group.members[userId];

                if(!user.optIn) {
                    return;
                }

                return new User(user.id, user.username);
            }).filter(user => {
                return !!user;
            });

            return new Group(groupId, users);
        }).catch(err => {
            console.log(err);
        });
    }

    /**
     * Associates a user with a group and opt's them in to receiving messages.
     * @param  {User} user - A telegram user.
     * @param  {Number} groupId - A unique telegram group ID
     * @return {Promise<Void>}
     */
    optIn(user, groupId) {
        arg.checkIfExists(user, 'user');
        arg.checkIfNumber(groupId, 'groupId');

        const path = this.firebaseSettings.buildPath(`groups/${groupId}/members/${user.id}.json`);
        const payload = JSON.stringify({
            id: user.id,
            username: user.username,
            optIn: true
        });
        
        return got.patch(path, {
            body: payload
        }).catch(err => {
            console.log(err);
        });
    }

    /**
     * Associates a user with a group and opt's them out of receiving messages.
     * @param  {User} user - A telegram user.
     * @param  {Number} groupId - A unique telegram group ID
     * @return {Promise<Void>}
     */
    optOut(user, groupId) {
        arg.checkIfExists(user, 'user');
        arg.checkIfNumber(groupId, 'groupId');

        const path = this.firebaseSettings.buildPath(`groups/${groupId}/members/${user.id}.json`);
        const payload = JSON.stringify({
            id: user.id,
            username: user.username,
            optIn: false
        });

        return got.patch(path, {
            body: payload
        }).catch(err => {
            console.log(err);
        });
    }
}

module.exports = GroupRepository;