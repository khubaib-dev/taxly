import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'

@Entity()
export class Criterion {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column({ type: 'longtext' })
    occupation: string

    @Column({ type: 'longtext' })
    user_type: string

    @Column({ type: 'longtext' })
    values: string
}
