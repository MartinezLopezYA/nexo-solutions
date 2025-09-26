import { Module } from '@nestjs/common';
import { IdentificationTypeController } from './identification-type.controller';
import { IdentificationType } from './entities/identification-type.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdentificationTypeService } from './identification-type.service';

@Module({
  imports: [TypeOrmModule.forFeature([IdentificationType])],
  providers: [IdentificationTypeService],
  controllers: [IdentificationTypeController],
  exports: [IdentificationTypeService],
})
export class IdentificationTypeModule {}
