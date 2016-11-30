const arg = require('../util/arg');

/**
 * Entity to represent a telegram user.
 */
class User {
    /**
     * @param  {Number} id - Numeric ID of the user.
     * @param  {String} username - Telegram username, without the @
     * @return {User}
     */
    constructor(id, username) {
        arg.checkIfNumber(id, 'id');
        arg.checkIfNullOrEmpty(username, 'username');

        this._id = id;
        this._username = username;
    }

    /**
     * @return {Number}
     */
    get id() {
        return this._id;
    }

    /**
     * @return {String}
     */
    get username() {
        return this._username;
    }
}

module.exports = User;