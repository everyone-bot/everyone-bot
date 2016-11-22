const arg = require('../util/arg');

class User {
    constructor(id, username, firstName, lastName) {
        arg.checkIfNumber(id, 'id');
        arg.checkIfNullOrEmpty(username, 'username');
        arg.checkIfNullOrEmpty(firstName, 'firstName');
        arg.checkIfNullOrEmpty(lastName, 'lastName');

        this._id = id;
        this._username = username;
        this._firstName = firstName;
        this._lastName = lastName;
    }

    get id() {
        return this._id;
    }

    get username() {
        return this._username;
    }

    get firstName() {
        return this._firstName;
    }

    get lastName() {
        return this._lastName;
    }
}

module.exports = User;