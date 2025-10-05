import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { RolesModule } from '../roles/roles.module';
import { Role } from '../roles/entities/role.entity';
import { IdentificationType } from '../identification-type/entities/identification-type.entity';
import { Profession } from '../professions/entities/profession.entity';
import { City } from '../location/entities/city.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, IdentificationType, Profession, City]), RolesModule],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
