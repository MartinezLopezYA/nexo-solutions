import { ProfessionCategory } from "../../professions-category/entities/profession-category.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('professions')
export class Profession {
    @PrimaryGeneratedColumn('uuid')
    professionuuid: string;

    @Column({nullable: true, unique: true, length: 10})
    professionabbreviation: string;

    @Column({ nullable: false, length: 50, unique: true })
    professionname: string;

    @Column({ nullable: true, length: 100 })
    professiondescription: string;

    @Column({ nullable: true, length: 10, unique: true })
    professioncode: string;

    @Column({ nullable: false, type: 'boolean', default: true })
    isActive: boolean;

    @Column({ nullable: false, type: 'boolean', default: false })
    isDeleted: boolean;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @ManyToOne(() => ProfessionCategory, (professionsCategory) => professionsCategory.professions)
    professioncategory: ProfessionCategory;
}