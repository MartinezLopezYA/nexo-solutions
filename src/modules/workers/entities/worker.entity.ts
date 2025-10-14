import { Client } from "../../clients/entities/client.entity";
import { Role } from "../../roles/entities/role.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('workers')
export class Worker {

    @PrimaryGeneratedColumn('uuid')
    workeruuid: string;

    @Column({ nullable: false, length: 50 })
    workername: string;

    @Column({ nullable: false, length: 50 })
    workerlastname: string;

    @Column({ unique: true, nullable: false, length: 50 })
    workerusername: string;

    @Column({ nullable: false, length: 100, unique: true })
    workeremail: string;

    @Column({ nullable: false })
    workerpassword: string;

    @Column({ nullable: false, length: 15, unique: true })
    workerphone: string;

    @Column({ nullable: false, unique: true })
    workeridentificationnumber: number;

    @Column({ nullable: true, type: 'boolean', default: true })
    isActive: boolean;

    @Column({ nullable: true, type: 'boolean', default: false })
    isDeleted: boolean;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @ManyToMany(() => Role, (role) => role.workers, { cascade: true })
    @JoinTable({ name: 'worker_roles' })
    roles: Role[];

    @ManyToOne(() => Client)
    @JoinColumn({ name: 'clientuuid' })
    client: Client;

}