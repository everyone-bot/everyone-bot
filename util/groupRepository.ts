import got from 'got'

import User from '../domain/user'
import Group from '../domain/group'
import FirebaseSettings from '../domain/firebaseSettings'

/**
 * Responsible for integrating with Firebase to save and load group inforamtion.
 */
export default class GroupRepository {
    firebaseSettings: FirebaseSettings

    /**
     * @param  {FirebaseSettings} firebaseSettings
     * @return {GroupRepository}
     */
    constructor(firebaseSettings: FirebaseSettings) {
        this.firebaseSettings = firebaseSettings
    }

    /**
     * @param  {Number} groupId - Unique telegram identifier for a group.
     * @return {Promise<Group>}
     */
    async getGroup(groupId: number): Promise<Group> {
        if (!groupId) throw new SyntaxError('No group ID supplied to getGroup')

        const path = this.firebaseSettings.buildPath(`groups/${groupId}.json`);

        const response = await got(path)
        const group = JSON.parse(response.body)

        if(!group || !group.members) {
            return new Group(groupId, []);
        }

        const users: User[] = []

        Object.keys(group.members).forEach(userId => {
            const user = group.members[userId]

            if(!user.optIn) {
                return
            }

            users.push(new User(user.id, user.username))
        })

        return new Group(groupId, users)
    }

    /**
     * Associates a user with a group and opt's them in to receiving messages.
     *
     * @param  {User} user - A telegram user.
     * @param  {Number} groupId - A unique telegram group ID
     * @return {Promise<Void>}
     */
    async optIn(user: User, groupId: number): Promise<void> {
        if (!user) throw new SyntaxError('No user provided to optIn')
        if (!groupId) throw new SyntaxError('No groupId provided to optIn')

        const path = this.firebaseSettings.buildPath(`groups/${groupId}/members/${user.id}.json`)

        const payload = JSON.stringify({
            id: user.id,
            username: user.username,
            optIn: true
        });

        await got.patch(path, {
            body: payload
        })
    }

    /**
     * Associates a user with a group and opt's them out of receiving messages.
     * 
     * @param  {User} user - A telegram user.
     * @param  {Number} groupId - A unique telegram group ID
     * @return {Promise<Void>}
     */
    async optOut(user: User, groupId: number): Promise<void> {
        if (!user) throw new SyntaxError('No user provided to optOut')
        if (!groupId) throw new SyntaxError('No groupId provided to optOut')

        const path = this.firebaseSettings.buildPath(`groups/${groupId}/members/${user.id}.json`)

        const payload = JSON.stringify({
            id: user.id,
            username: user.username,
            optIn: false
        });

        await got.patch(path, {
            body: payload
        })
    }
}
