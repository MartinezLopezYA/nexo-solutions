import { Module } from '@nestjs/common';
import { LocationController } from './location.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Country } from './entities/country.entity';
import { Department } from './entities/department.entity';
import { City } from './entities/city.entity';
import { LocationService } from './location.service';

@Module({
  imports: [TypeOrmModule.forFeature([Country, Department, City])],
  providers: [LocationService],
  controllers: [LocationController],
  exports: [LocationService]
})
export class LocationModule {}
