import {User} from './entities/user';

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

export interface QueryInfo{
    purpose: string;
    payload: any;

}

export interface MessageInfo{
    message: string;
    date: Date;
    user: User;
}