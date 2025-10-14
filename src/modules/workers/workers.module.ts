import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Worker } from './entities/worker.entity';
import { WorkersController } from './workers.controller';
import { WorkersService } from './workers.service';
import { Client } from '../clients/entities/client.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Worker, Client])],
    providers: [WorkersService],
    controllers: [WorkersController],
    exports: [WorkersService],
})
export class WorkersModule {}
