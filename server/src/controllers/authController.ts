import {LoginInfo, UserInfo} from '../interfaces';
import {authService} from '../services/authService';
import {User} from '../entities/user';
import {Response} from 'express';
import {textService} from '../services/textService';

export const authUserController = async (payload: LoginInfo, response: Response): Promise<void> =>{
    try{
        const hashPassword = textService.encodeText(payload.password);

        const findedUser: User | Boolean | void = await authService.findUserInDB(payload.name, hashPassword);

        if(findedUser instanceof User){
            const token: string = textService.signToken(findedUser.name,findedUser.isAdmin,findedUser.mute);
            response.send(token);
            console.log('user was found');
            
            return;
        }

        if(findedUser instanceof Boolean){
            response.send(findedUser);
            return;
        }

        const createdUser: User = await authService.createUser(payload.name,hashPassword);
        const token: string = textService.signToken(createdUser.name,createdUser.isAdmin,createdUser.mute);
        response.send(token);
        return;
    }catch(err){
        console.error(err);
    }
};