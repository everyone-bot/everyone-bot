import SettingsRepository from '../settingsRepository'
import stubConfig from '../__stubs__/config.stub'
import { getUsers } from '../__stubs__/user.stub'

import MentionBuilder from '../mentionBuilder'

describe('MentionBuilder tests', () => {
    let settings: SettingsRepository

    beforeEach(() => {
        settings = new SettingsRepository(stubConfig)
    })

    it('should throw if users is an empty array', () => {
        const mentionBuilder = new MentionBuilder(settings)

        expect(() => {
            mentionBuilder.build([])
        }).toThrow()
    })

    it('should be able to chunk the same amount of users as mentions per message', () => {
        const users = getUsers(settings.mentionsPerMessage)
        const mentionBuilder = new MentionBuilder(settings)

        const messages = mentionBuilder.build(users)

        expect(messages.length).toEqual(1)
    })

    it('should be able to chunk when user count is fewer than mentions per message', () => {
        const users = getUsers(settings.mentionsPerMessage - 2)
        const mentionBuilder = new MentionBuilder(settings)

        const messages = mentionBuilder.build(users)

        expect(messages.length).toEqual(1)
    })

    it('should be able to chunk users into two even groups', () => {
        const users = getUsers(settings.mentionsPerMessage * 2)
        const mentionBuilder = new MentionBuilder(settings)

        const messages = mentionBuilder.build(users)

        expect(messages.length).toEqual(2)
    })

    it('should be able to chunk users into two un-even groups', () => {
        const users = getUsers((settings.mentionsPerMessage * 2) - 2)
        const mentionBuilder = new MentionBuilder(settings)

        const messages = mentionBuilder.build(users)

        expect(messages.length).toEqual(2)
    })

    it('should contain users in the returned messages', () => {
        const users = getUsers(settings.mentionsPerMessage + 3)
        const mentionBuilder = new MentionBuilder(settings)

        const messages = mentionBuilder.build(users)

        users.forEach(user => {
            const userMention = messages.find(message => 
                message.indexOf(`[${user.username}](tg://user?id=${user.id})`) !== -1
            )

            expect(userMention).toBeDefined()
        })
    })
})