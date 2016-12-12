module.exports = {
    /**
     * @param  {Any} val - Thing to check
     * @param  {String} valName - Name of the thing to check
     * @return {Void}
     * @throws {Error} If val does not exist
     */
    checkIfExists(val, valName) {
        if(typeof val === 'undefined') {
            throw new SyntaxError(`${valName} does not exist`);
        }
    },

    /**
     * @param  {Any} val - Thing to check
     * @param  {String} valName - Name of the thing to check
     * @return {Void}
     * @throws {Error} If val does not exist or is null or empty
     */
    checkIfNullOrEmpty(val, valName) {
        this.checkIfExists(val, valName);

        if(val === null || !val.length) {
            throw new SyntaxError(`${valName} was null or empty`);
        }
    },

    /**
     * @param  {Any} val - Thing to check
     * @param  {String} valName - Name of the thing to check
     * @return {Void}
     * @throws {Error} If val does not exist or is not a number
     */
    checkIfNumber(val, valName) {
        this.checkIfExists(val, valName);

        if(typeof val !== 'number') {
            throw new SyntaxError(`${valName} was not a number`);
        }
    },

    /**
     * @param  {Any} val - The parameter being tested.
     * @param  {String} valName - The name of the paramter being tested.
     * @throws {SyntaxError} If val is not an array.
     */
    checkIfArray(val, valName) {
        this.checkIfExists(val, valName);

        if(val.constructor !== Array) {
            throw new SyntaxError(`${valName} was not an array`);
        }
    }
}