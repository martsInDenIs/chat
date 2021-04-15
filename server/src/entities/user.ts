import {Entity, Column, PrimaryGeneratedColumn, OneToOne, OneToMany} from "typeorm";
import {UserInfo} from '../interfaces';
import {Message} from "./message";

@Entity()
export class User{
    constructor(obj: UserInfo){
        Object.assign(this, obj);
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 20,
        unique: true,
    })
    name: string;

    @Column({
        length: 100
    })
    password: string;

    @Column({
        length: 7
    })
    color: string;

    @Column()
    mute: boolean;

    @Column()
    ban: boolean;

    @Column()
    isAdmin: boolean;

    @OneToMany(type=>Message, message => message.user,{
        cascade: true,
    })
    messages: Message[];
    
};