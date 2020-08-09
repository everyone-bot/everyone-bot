import got from 'got'
import FirebaseSettings from '../domain/firebaseSettings'

/**
 * Responsible for tracking bot statistics.
 */
export default class StatisticsRepository {
    mentionsPath: string

    /**
     * Initializes a new instance of the StatisticsRepository.
     * @param  {FirebaseSettings}       firebaseSettings
     * @return {StatisticsRepository}
     */
    constructor(firebaseSettings: FirebaseSettings) {
        this.mentionsPath = firebaseSettings.buildPath('statistics/mentions.json');
    }

    /**
     * Increments the number of mentions.
     * @param  {number} amount The amount of mentions to increment by.
     * @return {number}
     */
    async incrementMentions(amount: number): Promise<void> {
        try {
            const currentMentions = await this.getCurrentMentions()

            await got.put(this.mentionsPath, {
                body: `${currentMentions + amount}`
            })
        } catch(error) {
            console.log(error)
        }
    }

    async getCurrentMentions(): Promise<number> {
        try {
            const response = await got(this.mentionsPath)
            const currentMentions = this.parseMentionCount(response.body)

            return currentMentions
        } catch(error) {
            throw error
        }
    }

    parseMentionCount(count: string): number {
        const parsed = Number(count)
        return isNaN(parsed) ? 0 : parsed
    }
}
