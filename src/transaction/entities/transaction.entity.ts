import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Transaction {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    type: string
    
    @Column()
    amount: number
    
    @Column()
    flag: string

    @ManyToOne(() => User, user => user.transactions)
    user: User;

    @Column()
    userId: number;
}
