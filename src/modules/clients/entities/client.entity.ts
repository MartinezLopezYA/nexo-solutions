import { TypeClientEnum } from '../../../common/enums/client.enum';
import { IdentificationType } from '../../identification-type/entities/identification-type.entity';
import { City } from '../../location/entities/city.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Worker } from '../../workers/entities/worker.entity';

@Entity('clients')
export class Client {
    @PrimaryGeneratedColumn('uuid')
    clientuuid: string;

    @Column({ nullable: false, type: 'enum', enum: TypeClientEnum })
    clienttype: TypeClientEnum;

    @ManyToOne(() => IdentificationType)
    @JoinColumn({ name: 'identificationtypeuuid' })
    clientidentificationtype: IdentificationType;

    @Column({ nullable: false, unique: true })
    clientidentificationnumber: number;

    @Column({ nullable: false, unique: false })
    clientverificationnumber: number;

    @Column({ nullable: false, length: 80, unique: true })
    clientname: string;

    @Column({ nullable: true, length: 20, unique: true })
    clientcode: string;

    @Column({ nullable: false, length: 80, unique: true })
    clientemail: string;

    @Column({ nullable: false, length: 10, unique: true })
    clientphone: string;

    @ManyToOne(() => City)
    @JoinColumn({ name: 'cityuuid' })
    city: City;

    @Column({ nullable: false, length: 80, unique: true })
    clientaddress: string;

    @Column({ nullable: false, default: 3 })
    clientmaxworkers: number;

    @Column({ nullable: false, default: 0 })
    clientactualworkers: number;

    @Column({ nullable: true, type: 'boolean', default: true })
    isActive: boolean;

    @Column({ nullable: true, type: 'boolean', default: false })
    isDeleted: boolean;

    @OneToMany(() => Worker, (worker) => worker.client)
    workers: Worker[];

    @Column({ nullable: false, default: new Date() })
    createdAt: Date;

    @Column({ nullable: false, default: new Date() })
    updatedAt: Date;

}

