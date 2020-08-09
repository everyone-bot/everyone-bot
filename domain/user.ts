import { stringify } from "querystring";

/**
 * Entity to represent a telegram user.
 */
export default class User {
    id: number
    username: string
    
    /**
     * @param  {Number} id - Numeric ID of the user.
     * @param  {String} username - Telegram username, without the @
     * @return {User}
     */
    constructor(id: number, username: string) {
        if (!id) throw new SyntaxError('No ID provided for user')
        if (!username) throw new SyntaxError('No username provided for user')

        this.id = id
        this.username = username
    }
}
