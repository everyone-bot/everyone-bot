import User from './user';

/**
 * Entity for describing a telegram group.
 */
export default class Group {
    id: number
    users: User[]

    /**
     * @param  {Number} id - Unique telegram identifier for a group.
     * @param  {Array} users - List of users present in the group.
     * @return {Group}
     */
    constructor(id: number, users: User[]) {
        if (!id) throw new SyntaxError('No ID supplied to group')
        if (!users) throw new SyntaxError('No users supplied to group')

        this.id = id;
        this.users = users;
    }
}