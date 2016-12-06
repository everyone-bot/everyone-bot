const arg = require('../util/arg');

/**
 * Value object defining connection settings for Firebase.
 */
class FirebaseSettings {
    /**
     * @param  {String} projectName - Firebase project name.
     * @param  {String} databaseSecret - Secret used to access the firebase realtime database.
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
     * @param  {String} resoruce - Path in the firebase object being retrieved.
     * @param  {String} queryParams - Optional firebase query params for filtering, sorting, etc.
     * @return {String}
     */
    buildPath(resource) {
        arg.checkIfNullOrEmpty(resource, 'resource');
        return `https://${this._projectName}.firebaseio.com/${resource}?auth=${this._databaseSecret}`;
    }
}

module.exports = FirebaseSettings;