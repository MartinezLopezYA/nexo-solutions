import { Role } from '../../roles/entities/role.entity';
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  // Basic information
  @PrimaryGeneratedColumn('uuid')
  useruuid: string;

  @Column({ nullable: false, length: 50 })
  firstname: string;

  @Column({ nullable: false, length: 50 })
  lastname: string;

  @Column({ unique: true, nullable: false, length: 50 })
  username: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false, length: 100 })
  useremail: string;

  @Column({ nullable: true, length: 3 })
  usercountrycode: string;

  @Column({ nullable: true, length: 15 })
  userphone: string;

  // Additional information
  @Column({ nullable: true, length: 2 })
  usergender: string;

  @Column({ nullable: true, length: 100 })
  userprofession: string;

  @Column({ nullable: true, length: 100 })
  useraddress: string;

  @Column({ nullable: true, type: 'date' })
  dateOfBirth: Date;

  @Column({ nullable: true, length: 100 })
  city: string;

  @Column({ nullable: true, length: 50 })
  state: string;

  @Column({ nullable: true, length: 50 })
  country: string;

  @Column({ nullable: true, type: 'boolean', default: false })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  // Database relationships

  @ManyToMany(() => Role, (role) => role.users, { cascade: true })
  @JoinTable({ name: 'user_roles' })
  roles: Role[];
}
