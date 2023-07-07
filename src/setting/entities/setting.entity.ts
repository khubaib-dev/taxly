import { Entity, Column, PrimaryGeneratedColumn, OneToOne, 
    JoinColumn } from 'typeorm'
import {User} from '../../user/entities/user.entity'

@Entity()
export class Setting {

    @PrimaryGeneratedColumn()
    id: number

    @OneToOne(() => User, user => user.setting)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column({nullable: true})
    tax_reminder: boolean

    @Column({nullable: true})
    notification_type: boolean

    @Column({nullable: true})
    work_status: number

    @Column({nullable: true})
    travel_type: number

    @Column({nullable: true})
    work_type: boolean

    @Column({nullable: true})
    business_meal: number
}
