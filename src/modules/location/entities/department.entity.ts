import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Country } from "./country.entity";
import { City } from "./city.entity";

@Entity('departments')
export class Department {

    @PrimaryGeneratedColumn('uuid')
    departmentuuid: string;

    @Column({ nullable: false, length: 100 })
    departmentname: string;

    @Column({ nullable: false, length: 3 })
    departmentcode: string;

    @Column({ nullable: true, type: 'boolean', default: true })
    isActive: boolean;

    @Column({ nullable: true, type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ nullable: true, type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @ManyToOne(() => Country, (country) => country.departments, { nullable: false })
    country: Country;

    @OneToMany(() => City, (city) => city.department, { nullable: true })
    cities: City[];

}
