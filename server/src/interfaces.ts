import {User} from './entities/user';
import {Message} from './entities/message';

export interface LoginInfo{
    name: string;
    password: string;
}

export interface UserInfo{
    name: string;
    password: string;
    color: string;
    mute: boolean;
    ban: boolean;
    isAdmin: boolean;
}

export interface TokenInfo{
    name: string;
    isAdmin: boolean;
    mute: boolean;
}

export interface QueryObj{
    purpose: string;
    payload?: any;

}

export interface MessageInfo{
    message: string;
    date: Date;
    user: User;
}

export interface SendedMessage{
    username: string;
    message: string;
    color: string;
    userId: number;
}

export interface PrimaryAnswerObject{
    purpose: string,
    messages: Message[],
    isMute: Boolean,
    usersOnlin: string[],
    allUsers: User[],
    name: string,
}

