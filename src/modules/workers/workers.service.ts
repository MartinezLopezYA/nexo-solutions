import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Worker } from './entities/worker.entity';
import { Repository } from 'typeorm';
import { Client } from '../clients/entities/client.entity';
import { WorkerCreateDto, WorkerResponseDto, WorkerStatusDto, WorkerUpdateDto } from './dto/worker.dto';
import { AlreadyExistsException, NotFoundException } from 'src/common/exceptions/general-exception.';
import { InternalException } from 'src/common/exceptions/internal-exception';

@Injectable()
export class WorkersService {
    constructor(
        @InjectRepository(Worker)
        private readonly workerRepository: Repository<Worker>,
        @InjectRepository(Client)
        private readonly clientRepository: Repository<Client>,
    ) { }

    async getAllWorkers(): Promise<WorkerResponseDto[]> {
        try {
            const workers = await this.workerRepository.find({
                where: { isDeleted: false },
                order: { workername: 'ASC' },
                relations: ['roles'],
            });

            if (!workers || workers.length === 0) throw new NotFoundException('No workers found', HttpStatus.NOT_FOUND, 'NF_WORKER_ERROR');

            const workerResponseDto = workers.map(worker => ({
                workeruuid: worker.workeruuid,
                workername: worker.workername,
                workerlastname: worker.workerlastname,
                workerusername: worker.workerusername,
                workeremail: worker.workeremail,
                workerphone: worker.workerphone,
                workeridentificationnumber: worker.workeridentificationnumber,
                isActive: worker.isActive,
                roles: worker.roles,
            } as WorkerResponseDto)) || [];

            return workerResponseDto;
        } catch (error) {
            throw new InternalException('An error occurred while retrieving the workers');
        }
    }

    async getWorkerByUserName(workerusername: string): Promise<Worker> {
        return await this.workerRepository.findOneBy({
            workerusername: workerusername,
        });
    }

    async getWorkerByPhone(workerphone: string): Promise<Worker> {
        return await this.workerRepository.findOneBy({
            workerphone: workerphone,
        });
    }

    async getWorkerByIdentificationNumber(workeridentificationnumber: number): Promise<Worker> {
        return await this.workerRepository.findOneBy({
            workeridentificationnumber: workeridentificationnumber,
        });
    }

    async getWorkerByEmail(workeremail: string): Promise<Worker> {
        return await this.workerRepository.findOneBy({
            workeremail: workeremail,
        });
    }

    async getWorkersByClient(clientuuid: string): Promise<WorkerResponseDto[]> {
        try {
            const workers = await this.workerRepository.find({
                where: { client: { clientuuid: clientuuid } },
                order: { workername: 'ASC' },
                relations: ['roles'],
            });

            if (!workers || workers.length === 0) throw new NotFoundException('No workers found', HttpStatus.NOT_FOUND, 'NF_WORKER_ERROR');

            const workerResponseDto = workers.map(worker => ({
                workeruuid: worker.workeruuid,
                workername: worker.workername,
                workerlastname: worker.workerlastname,
                workerusername: worker.workerusername,
                workeremail: worker.workeremail,
                workerphone: worker.workerphone,
                workeridentificationnumber: worker.workeridentificationnumber,
                isActive: worker.isActive,
                roles: worker.roles,
            } as WorkerResponseDto)) || [];

            return workerResponseDto;
        } catch (error) {
            throw new InternalException('An error occurred while retrieving the workers');
        }
    }

    async addWorker(worker: WorkerCreateDto): Promise<WorkerResponseDto> {
        try {
            const client = await this.clientRepository.findOneBy({
                clientuuid: worker.clientuuid,
            });

            if (!client) throw new NotFoundException('Client not found', HttpStatus.NOT_FOUND, 'NF_CLIENT_ERROR');

            if (client.clientactualworkers === client.clientmaxworkers) throw new AlreadyExistsException('Client max workers reached', HttpStatus.BAD_REQUEST, 'MAX_WORKERS_ERROR');

            await this.ensureWorkerDoesNotExist('workerusername', worker.workerusername, 'WORKER_USERNAME_ERROR');
            await this.ensureWorkerDoesNotExist('workerphone', worker.workerphone, 'WORKER_PHONE_ERROR');
            await this.ensureWorkerDoesNotExist('workeridentificationnumber', worker.workeridentificationnumber.toString(), 'WORKER_IDENTIFICATION_NUMBER_ERROR');
            await this.ensureWorkerDoesNotExist('workeremail', worker.workeremail, 'WORKER_EMAIL_ERROR');

            const workerEntity = this.workerRepository.create(worker);
            const workerSaved = await this.workerRepository.save(workerEntity);

            return {
                workeruuid: workerSaved.workeruuid,
                workername: workerSaved.workername,
                workerlastname: workerSaved.workerlastname,
                workerusername: workerSaved.workerusername,
                workeremail: workerSaved.workeremail,
                workerphone: workerSaved.workerphone,
                workeridentificationnumber: workerSaved.workeridentificationnumber,
                isActive: workerSaved.isActive,
                roles: workerSaved.roles,
            } as WorkerResponseDto;
        } catch (error) {
            throw new InternalException('An error occurred while adding the worker');
        }
    }

    async updateWorkerStatus(workeruuid: string): Promise<WorkerStatusDto> {
        try {
            const existingWorker = await this.workerRepository.findOneBy({
                workeruuid: workeruuid,
            });

            if (!existingWorker) throw new NotFoundException(`Worker with uuid ${workeruuid} not found`, HttpStatus.NOT_FOUND, 'NF_WORKER_ERROR');

            existingWorker.isActive = !existingWorker.isActive;
            const savedWorker = await this.workerRepository.save(existingWorker);
            const workerResponse: WorkerStatusDto = {
                workeruuid: savedWorker.workeruuid,
                message: 'Worker status updated successfully',
                statusCode: HttpStatus.OK,
            };
            return workerResponse;
        } catch (error) {
            throw new InternalException('An error occurred while updating the worker status');
        }
    }

    async updateWorker(workeruuid: string, worker: WorkerUpdateDto): Promise<WorkerResponseDto> {
        try {
            const existingWorker = await this.workerRepository.findOneBy({
                workeruuid: workeruuid,
            });

            if (!existingWorker) throw new NotFoundException(`Worker with uuid ${workeruuid} not found`, HttpStatus.NOT_FOUND, 'NF_WORKER_ERROR');

            existingWorker.workername = worker.workername;
            existingWorker.workerlastname = worker.workerlastname;
            existingWorker.workerusername = worker.workerusername;
            existingWorker.workeremail = worker.workeremail;
            existingWorker.workerphone = worker.workerphone;
            existingWorker.workeridentificationnumber = worker.workeridentificationnumber;
            const savedWorker = await this.workerRepository.save(existingWorker);
            return {
                workeruuid: savedWorker.workeruuid,
                workername: savedWorker.workername,
                workerlastname: savedWorker.workerlastname,
                workerusername: savedWorker.workerusername,
                workeremail: savedWorker.workeremail,
                workerphone: savedWorker.workerphone,
                workeridentificationnumber: savedWorker.workeridentificationnumber,
                isActive: savedWorker.isActive,
                roles: savedWorker.roles,
            } as WorkerResponseDto;
        } catch (error) {
            throw new InternalException('An error occurred while updating the worker');
        }
    }

    async removeWorker(workeruuid: string): Promise<WorkerStatusDto> {
        try {
            const existingWorker = await this.workerRepository.findOneBy({
                workeruuid: workeruuid,
            });

            if (!existingWorker) throw new NotFoundException(`Worker with uuid ${workeruuid} not found`, HttpStatus.NOT_FOUND, 'NF_WORKER_ERROR');

            await this.workerRepository.remove(existingWorker);
            return {
                workeruuid: existingWorker.workeruuid,
                message: 'Worker deleted successfully',
                statusCode: HttpStatus.OK,
            }
        } catch (error) {
            throw new InternalException('An error occurred while deleting the worker');
        }
    }

    private async ensureWorkerDoesNotExist(type: 'workerusername' | 'workerphone' | 'workeridentificationnumber' | 'workeremail', value: string, code: string) {
        const worker = type === 'workerusername' ? await this.getWorkerByUserName(value as string) : type === 'workerphone' ? await this.getWorkerByPhone(value as string) : type === 'workeridentificationnumber' ? await this.getWorkerByIdentificationNumber(parseInt(value)) : await this.getWorkerByEmail(value as string);
        if (worker) {
            throw new AlreadyExistsException(
                'Worker with ' + type + ' ' + value + ' already exists',
                HttpStatus.BAD_REQUEST,
                code,
            );
        }
    }
}
