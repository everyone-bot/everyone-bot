import { groupResponse } from '../__stubs__/firebase.stub'
import { getUser } from '../__stubs__/user.stub'

describe('GroupRepository tests', () => {
    jest.mock('got')
    
    const got = jest.requireMock('got').default
    const FirebaseSettings = jest.requireActual('../../domain/firebaseSettings').default
    const GroupRepository = jest.requireActual('../groupRepository').default

    let settings, repo

    beforeEach(() => {
        settings = new FirebaseSettings('everyone-bot', 'seekret')
        repo = new GroupRepository(settings)

        got.mockReset()
        got.patch.mockReset()
    })

    afterAll(() => {
        jest.dontMock('got')
    })

    it('should be able to get a group and build it', async () => {
        const groupId = -999
        got.mockResolvedValue({ body: groupResponse })

        const group = await repo.getGroup(groupId)

        expect(group).toBeDefined()
        expect(group.id).toEqual(groupId)
        expect(group.users).toHaveLength(2)
    })

    it('should throw if no group id is provided', async () => {
        try {
            await repo.getGroup()
        } catch(error) {
            expect(error).toBeDefined()
            expect(error.message).toEqual('No group ID supplied to getGroup')
        }
    })

    it('should throw if there is an error getting the group from firebase', async () => {
        got.mockRejectedValue({ body: 'Firebase error' })
        
        try {
            await repo.getGroup(420)
        } catch(error) {
            expect(error).toBeDefined()
        }
    })

    it('should be able to opt a user in', async () => {
        const user = getUser()
        got.patch.mockResolvedValue({ body: 'ok' })

        await repo.optIn(user, 123)

        const path = settings.buildPath(`groups/123/members/${user.id}.json`)
        expect(got.patch).toHaveBeenCalledWith(path, {
            body: JSON.stringify({
                id: user.id,
                username: user.username,
                optIn: true
            })
        })
    })

    it('should throw if no user is supplied to optIn', async () => {
        try {
            await repo.optIn(undefined, 123)
        } catch(error) {
            expect(error.message).toBe('No user provided to optIn')
        }
    })

    it('should throw if no group is supplied to optIn', async () => {
        try {
            const user = getUser()
            await repo.optIn(user)
        } catch(error) {
            expect(error.message).toBe('No groupId provided to optIn')
        }
    })

    it('should throw if theres a firebase error while opting in', async () => {
        got.patch.mockRejectedValue({ body: 'Firebase error' })

        try {
            const user = getUser()
            await repo.optIn(user, 123)
        } catch(error) {
            expect(error).toBeDefined()
        }
    })

    it('should be able to opt a user out', async () => {
        const user = getUser()
        got.patch.mockResolvedValue({ body: 'ok' })

        await repo.optOut(user, 123)

        const path = settings.buildPath(`groups/123/members/${user.id}.json`)
        expect(got.patch).toHaveBeenCalledWith(path, {
            body: JSON.stringify({
                id: user.id,
                username: user.username,
                optIn: false
            })
        })
    })

    it('should throw if no user is supplied to optOut', async () => {
        try {
            await repo.optOut(undefined, 123)
        } catch(error) {
            expect(error.message).toBe('No user provided to optOut')
        }
    })

    it('should throw if no group is supplied to optOut', async () => {
        try {
            const user = getUser()
            await repo.optOut(user)
        } catch(error) {
            expect(error.message).toBe('No groupId provided to optOut')
        }
    })

    it('should throw if theres a firebase error while opting out', async () => {
        got.patch.mockRejectedValue({ body: 'Firebase error' })

        try {
            const user = getUser()
            await repo.optOut(user, 123)
        } catch(error) {
            expect(error).toBeDefined()
        }
    })
})