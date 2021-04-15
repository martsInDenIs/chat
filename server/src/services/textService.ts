import * as crypto from 'crypto';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import {SECRET_KEY} from "../config";
import {TokenInfo} from '../interfaces';

dotenv.config();
export namespace textService{
    export const encodeText = (text: string): string =>{
        return crypto.createHash('sha256').update(text).digest('hex');
    };

    export const signToken = (name: string, isAdmin: boolean, mute: boolean): string =>{
        const tokenObject: TokenInfo = {
            name,
            isAdmin,
            mute
        }

        return jwt.sign(tokenObject,SECRET_KEY,{
            expiresIn: 60 * 60,
        });
    }

    export const verifyToken = (token: string): TokenInfo | Boolean =>{
        try{
            return jwt.verify(token,SECRET_KEY) as TokenInfo;
        }catch(err){
            return false;
        }
    }
}