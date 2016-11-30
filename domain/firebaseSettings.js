const arg = require('../util/arg');

/**
 * Value object defining connection settings for Firebase.
 */
class FirebaseSettings {
    /**
     * @param  {String}
     * @param  {String}
     * @return {FirebaseSettings}
     */
    constructor(projectName, databaseSecret) {
        arg.checkIfNullOrEmpty(projectName, 'projectName');
        arg.checkIfNullOrEmpty(databaseSecret, 'databaseSecret');

        this._projectName = projectName;
        this._databaseSecret = databaseSecret;
    }

    /**
     * @return {String}
     */
    get projectName() {
        return this._projectName;
    }

    /**
     * @return {String}
     */
    get databaseSecret() {
        return this._databaseSecret;
    }

    /**
     * @param  {String}
     * @param  {String}
     * @return {String}
     */
    buildPath(resource, queryParams = '') {
        arg.checkIfNullOrEmpty(resource, 'resource');

        return `https://${this._projectName}.firebaseio.com/${resource}?auth=${this._databaseSecret}&${queryParams}`;
    }
}

module.exports = FirebaseSettings;