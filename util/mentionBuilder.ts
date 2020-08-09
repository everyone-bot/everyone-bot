import SettingsRepository from './settingsRepository'
import User from '../domain/user';

export default class MentionBuilder {
    settings: SettingsRepository

    constructor(settingsRepository: SettingsRepository) {
        this.settings = settingsRepository
    }

    build(users: User[]): string[] {
        if(!users || !users.length) {
            throw new SyntaxError('No users supplied');
        }

        const userChunks = this._chunkUsers(users, this.settings.mentionsPerMessage);

        return userChunks.map((chunk: User[]) => {
            return chunk.reduce((accumulator: string, user: User) => {
                return `[${user.username}](tg://user?id=${user.id}) ${accumulator}`;
            }, '');
        });
    }

    _chunkUsers(users: User[], size: number): User[][] {
        const chunks: User[][] = [];

        for (var i = 0; i < users.length; i += size) {
            chunks.push(users.slice(i, i + size));
        }

        return chunks;
    }
}
