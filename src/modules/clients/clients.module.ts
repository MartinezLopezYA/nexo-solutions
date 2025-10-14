import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { IdentificationType } from '../identification-type/entities/identification-type.entity';
import { City } from '../location/entities/city.entity';
import { Worker } from '../workers/entities/worker.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Client, Worker, IdentificationType, City])],
  providers: [ClientsService],
  controllers: [ClientsController],
  exports: [ClientsService],
})
export class ClientsModule {}
