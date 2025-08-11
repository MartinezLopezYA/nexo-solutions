import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('identification_types')
export class IdentificationType {

    @PrimaryGeneratedColumn('uuid')
    identificationTypeUuid: string;

    @Column({ nullable: false, unique: true, length: 100 })
    identificationTypeName: string;

    @Column({ nullable: false, unique: true, length: 10 })
    identificationTypeCode: string;

    @Column({ nullable: true, type: 'boolean', default: true })
    isActive: boolean;

    @Column({ nullable: true, type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ nullable: true, type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

}