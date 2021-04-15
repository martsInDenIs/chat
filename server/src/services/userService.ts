import {getConnection, getRepository, Repository} from 'typeorm';
import {User} from '../entities/user';

export namespace userService{
    export const getUserInfo = async (name: string): Promise<User | undefined> =>{
        const userRepository: Repository<User> = getConnection().getRepository(User);

        const findedUser: User | undefined = await userRepository.findOne({
            name
        });

        return findedUser;
    };
}

