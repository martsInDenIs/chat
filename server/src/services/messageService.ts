import {textService} from './textService';
import {getConnection, getRepository, Repository} from 'typeorm';
import {Message} from '../entities/message';
import {User} from '../entities/user';
import {MessageInfo} from '../interfaces';

export namespace messageService{
    export const sendMessage = async (userId: number, text: string): Promise<void> => {
        const messageRepository = getConnection().getRepository(Message);
        const userRepository = getConnection().getRepository(User);

        const user: User | undefined = await userRepository.findOne(userId);
        if(user instanceof User){
            const messageInfo: MessageInfo = {
                user,
                message: text,
                date: new Date()
            }
        
            const message: Message = new Message(messageInfo);
            await messageRepository.save(message);

            console.log("Message has been saved");
        }

        return;
    };

    export const getAllMessages = async (): Promise<Message[]> => {
        const messageRepository: Repository<Message> = getConnection().getRepository(Message);

        const allMessages: Message[] = await messageRepository.find({
            take: 20,
            order:{
                date: "DESC",
            }
        })

        return allMessages.reverse();
    };

    export const getAllUsers = async (): Promise<User[]> => {
        const userRepository: Repository<User> = getConnection().getRepository(User);

        const allUsers: User[] = await userRepository.find();

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
