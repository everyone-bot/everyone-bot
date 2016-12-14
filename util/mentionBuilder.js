const arg = require('./arg');

class MentionBuilder {
    constructor(settingsRepository) {
        this.settings = settingsRepository;
    }

    build(users) {
        arg.checkIfArray(users, 'users');

        if(!users.length) {
            throw new SyntaxError('No users supplied');
        }

        const userChunks = this._chunkUsers(users, this.settings.mentionsPerMessage);

        return userChunks.map(chunk => {
            return chunk.reduce((accumulator, user) => {
                return `@${user.username} ${accumulator}`;
            }, '');
        });
    }

    _chunkUsers(users, size) {
        const chunks = [];

        for (var i = 0; i < users.length; i += size) {
            chunks.push(users.slice(i, i + size));
        }

        return chunks;
    }
}

module.exports = MentionBuilder;