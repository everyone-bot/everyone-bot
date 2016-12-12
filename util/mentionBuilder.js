const arg = require('./arg');

class MentionBuilder {
    constructor(settingsRepository) {
        this.settings = settingsRepository;
    }

    build(users) {
        arg.checkIfArray(users, 'users');
    }
}

module.exports = MentionBuilder;