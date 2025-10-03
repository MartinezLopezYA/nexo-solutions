import { Module } from '@nestjs/common';
import { ProfessionsController } from './professions.controller';
import { ProfessionsService } from './professions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profession } from './entities/profession.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Profession])],
  providers: [ProfessionsService],
  controllers: [ProfessionsController],
  exports: [ProfessionsService]
})
export class ProfessionsModule {}
