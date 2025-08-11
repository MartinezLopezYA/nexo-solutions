import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Department } from "./department.entity";

@Entity('cities')
export class City {

    @PrimaryGeneratedColumn('uuid')
    cityuuid: string;

    @Column({ nullable: false, length: 100 })
    cityname: string;

    @Column({ nullable: false })
    citycode: string;

    @Column({ nullable: true, type: 'boolean', default: true })
    isActive: boolean;

    @Column({ nullable: true, type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ nullable: true, type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @ManyToOne(() => Department, (department) => department.cities, { nullable: false })
    department: Department;
}