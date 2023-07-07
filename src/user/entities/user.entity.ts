import { Entity, Column, PrimaryGeneratedColumn, OneToOne,
    OneToMany } from 'typeorm'
import { Setting } from '../../setting/entities/setting.entity'
import { Transaction } from '../../transaction/entities/transaction.entity'


@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({type: 'text'})
    amember_id: string

    @Column({type: 'text'})
    basiq_id: string

    @OneToOne(() => Setting, setting => setting.user)
    setting: Setting;

    @OneToMany(() => Transaction, transaction => transaction.user)
    transactions: Transaction[];

}
