import WebSocket from "ws";
import {User} from '../entities/user';
import {TokenInfo, QueryInfo} from '../interfaces';
import {textService} from '../services/textService';
import {userService} from '../services/userService';
import {messageService} from '../services/messageService';

const clients: Map<number, {validUser: User, ws: WebSocket}> = new Map();

export namespace webSocketController{
    export const onConnection = async (ws: WebSocket, url: string): Promise<void> => {
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

            if(validUser instanceof User){
                if(clients.has(validUser.id)){
                    const previousSocket: WebSocket | undefined = clients.get(validUser.id)?.ws;
                    previousSocket?.close();
                }

                clients.set(validUser?.id,{
                    validUser,
                    ws
                });
            }

            ws.on('message',(data)=>onMessage(data as string, validUser as User));
            ws.on('close',()=>onClose());
            ws.on('error',(err: Error): void=>{
                console.error(err);
            });

        }catch(err){
            console.error(err);
            return;
        }
    };

    const onMessage = async (data: string, user: User): Promise<void> =>{
        const queryObject: QueryInfo = JSON.parse(data);

        switch(queryObject.purpose){
            case "send_message":{
                await messageService.sendMessage(user.id,queryObject.payload);
                return;
                break;
            }
            case "":
                break;
            default:
                break;
        }
    };

    const onClose = async (): Promise<void> =>{

    };
}