import { Module } from '@nestjs/common';
import { ProfessionsController } from './professions.controller';
import { ProfessionsService } from './professions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profession } from './entities/profession.entity';
import { ProfessionCategory } from '../professions-category/entities/profession-category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Profession, ProfessionCategory])],
  providers: [ProfessionsService],
  controllers: [ProfessionsController],
  exports: [ProfessionsService]
})
export class ProfessionsModule {}
