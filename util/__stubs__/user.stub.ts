import { random, internet } from 'faker'
import User from '../../domain/user'

export const getUser = (): User => {
    return new User(random.number(100000, 1000000), internet.userName())
}

export const getUsers = (numberOfUsers: number = 1): User[] => {
    const users = Array.apply(null, new Array(numberOfUsers));

    return users.map(() => getUser());
}