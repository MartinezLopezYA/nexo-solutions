import { IdentificationType } from '../../identification-type/entities/identification-type.entity';
import { City } from '../../location/entities/city.entity';
import { Role } from '../../roles/entities/role.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  // Basic information
  @PrimaryGeneratedColumn('uuid')
  useruuid: string;

  @Column({ nullable: false, length: 50 })
  firstname: string;

  @Column({ nullable: false, length: 50 })
  lastname: string;

  @Column({ unique: false, nullable: false, length: 50 })
  username: string;

  @Column({ nullable: false, length: 100 })
  useremail: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false, length: 15 })
  userphone: string;

  @ManyToOne(() => IdentificationType)
  @JoinColumn({ name: 'identificationtypeuuid' })
  useridentificationtype: IdentificationType;

  @Column({ nullable: false})
  useridentificationnumber: number;

  // Additional information
  @Column({ nullable: true, length: 2 })
  usergender: string;

  @Column({ nullable: true, length: 100 })
  userprofession: string;

  @ManyToOne(() => City)
  @JoinColumn({ name: 'cityuuid' })
  city: City;

  @Column({ nullable: true, length: 100 })
  useraddress: string;

  @Column({ nullable: true, type: 'date' })
  dateOfBirth: Date;

  @Column({ nullable: true, type: 'boolean', default: true })
  isActive: boolean;

  @Column({ nullable: true, type: 'boolean', default: false })
  isDeleted: boolean;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  // Database relationships

  @ManyToMany(() => Role, (role) => role.users, { cascade: true })
  @JoinTable({ name: 'user_roles' })
  roles: Role[];

}
