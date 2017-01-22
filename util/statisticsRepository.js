const got = require('got');
const arg = require('./arg');

/**
 * Responsible for tracking bot statistics.
 */
class StatisticsRepository {

    /**
     * Initializes a new instance of the StatisticsRepository.
     * @param  {FirebaseSettings}       firebaseSettings
     * @return {SettingsRepository}
     */
    constructor(firebaseSettings) {
        arg.checkIfExists(firebaseSettings, 'firebaseSettings');
        this.firebaseSettings = firebaseSettings;
    }

    /**
     * Increments the number of mentions.
     * @param  {number} amount The amount of mentions to increment by.
     * @return {void}
     */
    incrementMentions(amount) {
        arg.checkIfNumber(amount, 'amount');
        const path = this.firebaseSettings.buildPath('statistics/mentions.json');

        return got(path).then((response) => {
            let mentions = response.body;

            return got.put(path, mentions + amount).then((response) => {
                return response;
            });
        });
    }
}

module.exports = StatisticsRepository;