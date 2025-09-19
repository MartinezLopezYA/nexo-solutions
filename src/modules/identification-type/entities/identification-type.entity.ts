import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('identification_types')
export class IdentificationType {

    @PrimaryGeneratedColumn('uuid')
    identificationtypeuuid: string;

    @Column({ nullable: false, unique: true, length: 100 })
    identificationtypename: string;

    @Column({ nullable: false, unique: true, length: 10 })
    identificationtypecode: string;

    @Column({ nullable: true, type: 'boolean', default: true })
    isActive: boolean;

    @Column({ nullable: true, type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ nullable: true, type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

}