import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'


@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({type: 'text'})
    amember_id: string

    @Column({type: 'text'})
    basiq_id: string

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
