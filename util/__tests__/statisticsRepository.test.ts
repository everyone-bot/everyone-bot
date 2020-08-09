describe('StatisticsRepository tests', () => {
    jest.mock('got')

    const StatisticsRepository = jest.requireActual('../statisticsRepository').default
    const FirebaseSettings = jest.requireActual('../../domain/firebaseSettings').default
    const got = jest.requireMock('got').default

    let settings, repo, log

    beforeEach(() => {
        settings = new FirebaseSettings('everyone-bot', 'seekret')
        repo = new StatisticsRepository(settings)
        log = jest.spyOn(console, 'log')

        got.mockReset()
        got.put.mockReset()
    })

    afterAll(() => {
        jest.dontMock('got')
    })

    it('should be able to increment mentions', async () => {
        got.mockResolvedValue({ body: '20'})

        await repo.incrementMentions(20)

        expect(got).toHaveBeenCalledTimes(1)
        expect(got.put).toHaveBeenCalledWith(settings.buildPath('statistics/mentions.json'), {
            body: '40'
        })
    })

    it('should log and swallow errors if there is an issue with fetching current mention count', async () => {
        got.mockRejectedValue({ body: 'Firebase error' })

        expect(async () => {
            await repo.incrementMentions(10)
            expect(log).toHaveBeenCalled()
        }).not.toThrow()
    })

    it('should log and swallow errors if theres an issue with updating the mention count', async () => {
        got.mockResolvedValue({ body: '20' })
        got.put.mockRejectedValue({ body: 'Firebase error' })

        expect(async () => {
            await repo.incrementMentions(10)
            expect(log).toHaveBeenCalled()
        }).not.toThrow()
    })
})