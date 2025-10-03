import { Profession } from "../../professions/entities/profession.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('professions-category')
export class ProfessionCategory {
    @PrimaryGeneratedColumn('uuid')
    professioncategoryuuid: string;

    @Column({ nullable: false, length: 50, unique: true })
    professioncategoryname: string;

    @Column({nullable: true, unique: true, length: 10})
    professioncategoryabbreviation: string;

    @Column({ nullable: true, length: 10, unique: true })
    professioncategorycode: string;

    @Column({ nullable: false, type: 'boolean', default: true })
    isActive: boolean;

    @Column({ nullable: false, type: 'boolean', default: false })
    isDeleted: boolean;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @OneToMany(() => Profession, (profession) => profession.professioncategory, {nullable: true})
    professions: Profession[];
}