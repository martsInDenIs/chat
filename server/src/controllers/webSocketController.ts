import WebSocket from "ws";
import {User} from '../entities/user';
import {TokenInfo, QueryObj, SendedMessage, PrimaryAnswerObject} from '../interfaces';
import {textService} from '../services/textService';
import {userService} from '../services/userService';
import {messageService} from '../services/messageService';
import {Message} from '../entities/message';

const clients: Map<number, {validUser: User, ws: WebSocket}> = new Map();
const usersOnline: Set<string> = new Set();

export namespace webSocketController{
    export const onConnection = async (wss: WebSocket.Server, ws: WebSocket, url: string): Promise<void> => {
        try{
            const frontToken: string = url.split('token=')[1];

            if(!frontToken || frontToken.length <= 0){
                ws.close();
                return;
            }

            const validToken: TokenInfo | Boolean = textService.verifyToken(frontToken);

            if(validToken instanceof Boolean){
                ws.close();
                return; 
            }

            const validUser: User | undefined = await userService.getUserInfo(validToken.name);

            if(!validUser){
                ws.close();
                return;
            }

            if (clients.has(validUser.id) && usersOnline.has(validUser.name)) {
                const previousSocket: WebSocket | undefined = clients.get(validUser.id)?.ws;
                usersOnline.delete(validUser.name);
                previousSocket?.close();
            }

            clients.set(validUser.id, {
                validUser,
                ws
            });
            usersOnline.add(validUser.name);
            

            const allMessages: Message[] = await messageService.getAllMessages();
            const online: string[] = Array.from(usersOnline);
            
            let allUsers: User[] = [];
            console.log(validUser.isAdmin);
            if(validUser.isAdmin){
                allUsers = await userService.getAllUsers();
            }

            console.log(allUsers);
            ws.on('message',(data)=>onMessage(wss, data as string, validUser as User));
            ws.on('close',()=>onClose());
            ws.on('error',(err: Error): void=>{
                console.error(err);
            });

            const answerObject: QueryObj = {
                
                purpose: "get_primary_information",
                payload:{
                    allUsers,
                    name: validUser.name,
                    isMute: validUser.mute,
                    isAdmin: validUser.isAdmin,
                    messages: allMessages,
                    usersOnline: online
                }
            }

            ws.send(JSON.stringify(answerObject));
            console.log("NAHUYA");

        }catch(err){
            console.error(err);
            return;
        }
    };

    const onMessage = async (wss: WebSocket.Server, data: string, user: User): Promise<void> =>{
        const queryObject: QueryObj = JSON.parse(data);

        switch(queryObject.purpose){
            case "send_message":{
                if(user.mute || user.ban){
                    const userConnection: WebSocket | undefined = clients.get(user.id)?.ws;
                    return;
                }

                //Add check time of last message

                const userMessage: SendedMessage[] | void =  await messageService.sendMessage(user.id,queryObject.payload);
                
                const answerObj: QueryObj = {
                    purpose: "get_message",
                    payload: userMessage,
                }

                sendToAll(clients,answerObj);
                return;
                break;
            }
            case "ban":{ // ДОДЕЛАТЬ
                const adminConnection: WebSocket | undefined = clients.get(user.id)?.ws;

                if(!user.isAdmin){
                    adminConnection?.close();
                    return;
                }

                const banUserId: number = queryObject.payload;

                const bannedUser: User | undefined = await userService.banUser(banUserId);
                
                if(bannedUser && clients.has(banUserId)){
                    const userInfo: {validUser: User,ws: WebSocket} | undefined = clients.get(banUserId);
                    userInfo?.ws?.close();
                    usersOnline.delete(userInfo?.validUser?.name as string);
                    clients.delete(banUserId);
                }

                const allUsers: User[] = await userService.getAllUsers();

                const adminAnswerObj: QueryObj = {
                    purpose: "get_users",
                    payload: {
                        usersOnline,
                        allUsers
                    }
                }

                const answerObj: QueryObj ={
                    purpose: "get_users",
                    payload: usersOnline,
                }

                adminConnection?.send(JSON.stringify(adminAnswerObj));

                sendToAll(clients,answerObj);

                return;
                break;
            }
            case "mute":{
                const adminConnection: WebSocket | undefined = clients.get(user.id)?.ws;

                if(!user.isAdmin){
                    adminConnection?.close();
                    return;
                }

                const muteUserId: number = queryObject.payload;

                const mutedUser: User | undefined = await userService.muteUser(muteUserId);

                if(mutedUser && clients.has(muteUserId)){
                    const userInfo: {validUser: User,ws: WebSocket} | undefined = clients.get(muteUserId);
                    
                    const mutedUserAnswerObj: QueryObj ={
                        purpose: "mute",
                        payload: mutedUser.mute
                    }

                    userInfo?.ws.send(JSON.stringify(mutedUserAnswerObj));
                }

                const allUsers: User[] = await userService.getAllUsers();

                const adminAnswerObj: QueryObj = {
                    purpose: "get_users",
                    payload: {
                        usersOnline,
                        allUsers
                    }
                }

                const answerObj: QueryObj ={
                    purpose: "get_users",
                    payload: usersOnline,
                }

                adminConnection?.send(JSON.stringify(adminAnswerObj));

                sendToAll(clients,answerObj);

                return;
                break;
            }
            case "exit":{
                const userConnection: WebSocket | undefined = clients.get(user.id)?.ws;
                userConnection?.close();
                clients.delete(user.id);
                usersOnline.delete(user.name); 
            }
            default:
                break;
        }
    };

    const onClose = async (): Promise<void> =>{
        
    };

    const sendToAll = (clients: Map<number, {validUser: User, ws: WebSocket}>, queryObject: QueryObj): void => {
        if(queryObject.purpose === 'get_users') {
            clients.forEach(async (userInfo) => {
                if(userInfo.validUser.isAdmin){
                    return;
                }
                userInfo.ws?.send(JSON.stringify(queryObject));
            });
        }

        clients.forEach(async (userInfo)=>{
            userInfo.ws?.send(JSON.stringify(queryObject));
        });
    };


}

