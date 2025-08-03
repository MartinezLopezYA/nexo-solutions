import { Role } from '../../roles/entities/role.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class User {
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
  email: string;

  @Column({ nullable: true, length: 15 })
  phone: string;

  @ManyToMany(() => Role, (role) => role.users, { cascade: true })
  @JoinTable({ name: 'user_roles' })
  roles: Role[];
}
