const arg = require('./arg');

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

    buildPath(resource) {
        if(!resource) {
            throw new Error('resource not specified');
        }

        return `https://${this._projectName}.firebaseio.com/${resource}?auth=${this._databaseSecret}`;
    }
}

module.exports = FirebaseSettings;