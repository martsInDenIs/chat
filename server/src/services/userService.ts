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

    export const getAllUsers = async (): Promise<User[]> => {
        const userRepository: Repository<User> = getConnection().getRepository(User);

        const allUsers: User[] = await userRepository
                            .createQueryBuilder("user")
                            .select(["user.id","user.name","user.mute","user.ban"])
                            .where("isAdmin <> true")
                            .getMany();

        return allUsers;
    };

    export const banUser = async (banUserId: number): Promise<User | undefined> => {
        const userRepository: Repository<User> = getConnection().getRepository(User);
        
        const banUser: User | undefined = await userRepository.findOne(banUserId);
        if(banUser instanceof User){
            banUser.ban = !banUser.ban;
            await userRepository.save(banUser);
        }

        return banUser;
    };

    export const muteUser = async (muteUserId: number): Promise<User | undefined> =>{
        const userRepository: Repository<User> = getConnection().getRepository(User);

        const muteUser: User | undefined = await userRepository.findOne(muteUserId);
        if(muteUser instanceof User){
            muteUser.mute = !muteUser.mute;
            await userRepository.save(muteUser);
        }

        return muteUser;
    };
}

