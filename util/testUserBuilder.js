const faker = require('faker');
const User = require('../domain/user');

class TestUserBuilder {
    constructor() {
        this.userId = faker.random.number(100000, 1000000);
        this.username = faker.internet.userName();
    }

    build() {
        return new User(this.userId, this.username);
    }

    buildMany(amount) {
        const users = Array.apply(null, new Array(amount));

        return users.map(() => {
            const id = faker.random.number(100000, 1000000);
            const username = faker.internet.userName();

            return new User(id, username);
        });
    }
}

module.exports = TestUserBuilder;