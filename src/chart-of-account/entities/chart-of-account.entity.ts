import { Entity, Column, PrimaryGeneratedColumn, OneToOne,
    OneToMany, JoinColumn } from 'typeorm'

@Entity()
export class ChartOfAccount {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    category: string 
}
