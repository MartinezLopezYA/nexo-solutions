import { Module } from '@nestjs/common';
import { ProfessionsCategoryController } from './professions-category.controller';
import { ProfessionsCategoryService } from './professions-category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfessionCategory } from './entities/profession-category.entity';
import { Profession } from '../professions/entities/profession.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ProfessionCategory, Profession])],
    providers: [ProfessionsCategoryService],
    controllers: [ProfessionsCategoryController],
    exports: [ProfessionsCategoryService]
})
export class ProfessionsCategoryModule { }
