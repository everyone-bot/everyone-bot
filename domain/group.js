const arg = require('../util/arg');

/**
 * Entity for describing a telegram group.
 */
class Group {
    /**
     * @param  {Number} id - Unique telegram identifier for a group.
     * @param  {Array} users - List of users present in the group.
     * @return {Group}
     */
    constructor(id, users) {
        arg.checkIfNumber(id, 'id');
        arg.checkIfExists(users, 'users');

        this._id = id;
        this._users = users;
    }

    /**
     * @return {Number}
     */
    get id() {
        return this._id;
    }

    /**
     * @return {Array}
     */
    get users() {
        return this._users;
    }
}

module.exports = Group;