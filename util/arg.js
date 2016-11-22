module.exports = {
    checkIfExists(val, valName) {
        if(typeof val === 'undefined') {
            throw new Error(`${valName} does not exist`);
        }
    },

    checkIfNullOrEmpty(val, valName) {
        this.checkIfExists(val, valName);

        if(val === null || !val.length) {
            throw new Error(`${valName} was null or empty`);
        }
    },

    checkIfNumber(val, valName) {
        this.checkIfExists(val, valName);

        if(typeof val !== 'number') {
            throw new Error(`${valName} was not a number`);
        }
    }
}