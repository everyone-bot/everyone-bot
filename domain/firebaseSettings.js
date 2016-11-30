const arg = require('../util/arg');

class FirebaseSettings {
    constructor(projectName, databaseSecret) {
        arg.checkIfNullOrEmpty(projectName, 'projectName');
        arg.checkIfNullOrEmpty(databaseSecret, 'databaseSecret');

        this._projectName = projectName;
        this._databaseSecret = databaseSecret;
    }

    get projectName() {
        return this._projectName;
    }


    get databaseSecret() {
        return this._databaseSecret;
    }

    buildPath(resource, queryParams = '') {
        arg.checkIfNullOrEmpty(resource, 'resource');

        return `https://${this._projectName}.firebaseio.com/${resource}?auth=${this._databaseSecret}&${queryParams}`;
    }
}

module.exports = FirebaseSettings;