import {getConnection, Connection, Repository} from 'typeorm';
import {User} from '../entities/user';
import {UserInfo} from '../interfaces';

export namespace authService{
    export const findUserInDB = async (name: string, password: string): Promise< User | Boolean | void > => {
        const userRepository: Repository<User> =  getConnection().getRepository(User);

        const user: User | undefined = await userRepository.findOne({
            name
        });

        if(!user) return;

        if(user.password !== password){
            return false;
        }

        return user;
    };

    export const createUser = async (name: string, password: string): Promise<User> =>{
        const userRepository: Repository<User> = getConnection().getRepository(User);

        const userCount: Number = await userRepository.count();
        const isAdmin: boolean = userCount > 0 ? false : true;
        const color: string = '#000';

        const userConfig: UserInfo = {
            name,
            password,
            isAdmin,
            color,
            mute: false,
            ban: false
        }

        const createUser = new User(userConfig);

        const user: User = await userRepository.save(createUser);
        console.log("New user has created");

        return user;
    };
}