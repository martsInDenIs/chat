import {Entity, Column, PrimaryGeneratedColumn, ManyToOne} from 'typeorm';
import {User} from './user';
import {MessageInfo} from '../interfaces';

@Entity()
export class Message{
    constructor(obj: MessageInfo){
        Object.assign(this,obj);
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'text'
    })
    message: string;

    @Column({
        type: 'datetime'
    })
    date: Date;

    @ManyToOne(type => User, user => user.messages)
    user: User;
}
