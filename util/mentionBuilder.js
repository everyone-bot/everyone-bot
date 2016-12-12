const arg = require('./arg');

class MentionBuilder {
    constructor(settingsRepository) {
        this.settings = settingsRepository;
    }

    build(users) {
        return this.settings.mentionsPerMessage;
    }
}

module.exports = MentionBuilder;