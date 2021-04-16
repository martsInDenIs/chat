import {textService} from './textService';
import {createQueryBuilder, getConnection, getRepository, Repository} from 'typeorm';
import {Message} from '../entities/message';
import {User} from '../entities/user';
import {MessageInfo, SendedMessage} from '../interfaces';

export namespace messageService{
    export const sendMessage = async (userId: number, text: string): Promise<SendedMessage[] | void> => {
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

            const sendingMessage: SendedMessage = {
                userId,
                username: user.name,
                message: text,
                color: user.color
            } 

            return [sendingMessage];
        }

        return;
    };

    export const getAllMessages = async (): Promise<any> => {
        const allMessages = await getConnection().getRepository(Message)
            .createQueryBuilder('message')
            .select('message.message', 'message')
            .addSelect('user.name', 'name')
            .addSelect('user.color', 'color')
            .innerJoin('message.user', 'user', "message.user = user.id")
            .limit(20)
            .getRawMany();

        console.log(allMessages);

        return allMessages.reverse();
    };

    

}
