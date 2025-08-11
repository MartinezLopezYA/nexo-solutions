import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Department } from "./department.entity";

@Entity('countries')
export class Country {

    @PrimaryGeneratedColumn('uuid')
    countryuuid: string;

    @Column({ nullable: false, length: 100 })
    countryname: string;

    @Column({ nullable: false, length: 3 })
    countryisocode: string;

    @Column({ nullable: false, length: 4 })
    countrynumericcode: string;

    @Column({ nullable: true, type: 'boolean', default: true })
    isActive: boolean;

    @Column({ nullable: true, type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ nullable: true, type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @OneToMany(() => Department, (department) => department.country, { nullable: true })
    departments: Department[];
}