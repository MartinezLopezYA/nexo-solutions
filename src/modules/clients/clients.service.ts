import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { DeepPartial, Repository } from 'typeorm';
import { ClientCreateDto, ClientResponseDto, ClientStatusDto, ClientUpdateDto, ClientWithWorkersDto } from './dto/client.dto';
import { AlreadyExistsException, NotFoundException } from 'src/common/exceptions/general-exception.';
import { InternalException } from 'src/common/exceptions/internal-exception';
import { IdentificationType } from '../identification-type/entities/identification-type.entity';
import { City } from '../location/entities/city.entity';

@Injectable()
export class ClientsService {
    constructor(
        @InjectRepository(Client)
        private readonly clientRepository: Repository<Client>,
        @InjectRepository(IdentificationType)
        private readonly identificationTypeRepository: Repository<IdentificationType>,
        @InjectRepository(City)
        private readonly cityRepository: Repository<City>,
    ) { }

    async getAllClients(): Promise<ClientResponseDto[]> {
        try {
            const clients = await this.clientRepository.find({
                where: { isDeleted: false },
                order: { clientname: 'ASC' },
                relations: ['clientidentificationtype', 'city'],
            });

            if (!clients || clients.length === 0) throw new NotFoundException('No clients found', HttpStatus.NOT_FOUND, 'NF_CLIENT_ERROR');

            const clientResponseDto = clients.map(client => ({
                clientuuid: client.clientuuid,
                clienttype: client.clienttype,
                clientidentificationtype: client.clientidentificationtype,
                clientidentificationnumber: client.clientidentificationnumber,
                clientverificationnumber: client.clientverificationnumber,
                clientname: client.clientname,
                clientcode: client.clientcode,
                clientemail: client.clientemail,
                clientphone: client.clientphone,
                city: client.city,
                clientaddress: client.clientaddress,
                isActive: client.isActive,
                createdAt: client.createdAt,
                updatedAt: client.updatedAt,
            } as ClientResponseDto)) || [];

            return clientResponseDto;
        } catch (error) {
            this.handleInternalError(error, 'An error occurred while getting the clients');
        }
    }

    async getClientByUuid(clientuuid: string): Promise<ClientWithWorkersDto> {
        try {
            const client = await this.clientRepository.findOneBy({
                clientuuid: clientuuid,
            });

            if (!client) throw new NotFoundException('Client not found', HttpStatus.NOT_FOUND, 'NF_CLIENT_ERROR');

            return {
                clientuuid: client.clientuuid,
                clienttype: client.clienttype,
                clientidentificationtype: client.clientidentificationtype,
                clientidentificationnumber: client.clientidentificationnumber,
                clientverificationnumber: client.clientverificationnumber,
                clientname: client.clientname,
                clientcode: client.clientcode,
                clientemail: client.clientemail,
                clientphone: client.clientphone,
                city: client.city,
                clientaddress: client.clientaddress,
                isActive: client.isActive,
                createdAt: client.createdAt,
                updatedAt: client.updatedAt,
                workers: client.workers || [],
            } as ClientWithWorkersDto;
        } catch (error) {
            this.handleInternalError(error, 'An error occurred while getting the client by uuid');
        }
    }

    async getClientByIdentificationNumber(clientidentificationnumber: number): Promise<Client> {
        return await this.clientRepository.findOneBy({
            clientidentificationnumber: clientidentificationnumber,
        });
    }

    async getClientByEmail(clientemail: string): Promise<Client> {
        return await this.clientRepository.findOneBy({
            clientemail: clientemail,
        });
    }

    async getClientByPhone(clientphone: string): Promise<Client> {
        return await this.clientRepository.findOneBy({
            clientphone: clientphone,
        });
    }

    async getClientByCode(clientcode: string): Promise<Client> {
        return await this.clientRepository.findOneBy({
            clientcode: clientcode,
        });
    }

    async getClientByUserName(clientname: string): Promise<Client> {
        return await this.clientRepository.findOneBy({
            clientname: clientname,
        });
    }

    async addClient(client: ClientCreateDto): Promise<ClientResponseDto> {
        try {

            await this.ensureClientDoesNotExist('clientname', client.clientname, 'CLIENT_CLIENTNAME_ERROR');
            await this.ensureClientDoesNotExist('clientphone', client.clientphone, 'CLIENT_CLIENTPHONE_ERROR');
            await this.ensureClientDoesNotExist('clientidentificationnumber', client.clientidentificationnumber.toString(), 'CLIENT_CLIENTIDNUMBER_ERROR');
            await this.ensureClientDoesNotExist('clientemail', client.clientemail, 'CLIENT_CLIENTEMAIL_ERROR');

            const [identificationType, city] = await Promise.all([
                this.identificationTypeRepository.findOneBy({ identificationtypeuuid: client.clientidentificationtype }),
                this.cityRepository.findOneBy({ cityuuid: client.cityuuid }),
            ]);

            if (!identificationType) throw new NotFoundException('Identification type not found', HttpStatus.NOT_FOUND, 'NF_IDENTIFICATION_TYPE_ERROR');
            if (!city) throw new NotFoundException('City not found', HttpStatus.NOT_FOUND, 'NF_CITY_ERROR');

            const newClientData: DeepPartial<Client> = {
                ...client,
                clientidentificationtype: { identificationtypeuuid: client.clientidentificationtype },
                city: { cityuuid: client.cityuuid },
            };

            const clientEntity = this.clientRepository.create(newClientData);
            const clientSaved = await this.clientRepository.save(clientEntity);

            const clientResponse: ClientResponseDto = {
                clientuuid: clientSaved.clientuuid,
                clienttype: clientSaved.clienttype,
                clientidentificationtype: clientSaved.clientidentificationtype,
                clientidentificationnumber: clientSaved.clientidentificationnumber,
                clientverificationnumber: clientSaved.clientverificationnumber,
                clientname: clientSaved.clientname,
                clientcode: clientSaved.clientcode,
                clientemail: clientSaved.clientemail,
                clientphone: clientSaved.clientphone,
                city: clientSaved.city,
                clientaddress: clientSaved.clientaddress,
                isActive: clientSaved.isActive,
                createdAt: clientSaved.createdAt,
                updatedAt: clientSaved.updatedAt,
            };

            return clientResponse;
        } catch (error) {
            this.handleInternalError(error, 'An error occurred while adding the client');
        }
    }

    async updateClientStatus(clientuuid: string): Promise<ClientStatusDto> {
        try {
            const existingClient = await this.clientRepository.findOneBy({
                clientuuid: clientuuid,
            });

            if (!existingClient) throw new NotFoundException(`Client with uuid ${clientuuid} not found`, HttpStatus.NOT_FOUND, 'NF_CLIENT_ERROR');

            existingClient.isActive = !existingClient.isActive;
            const savedClient = await this.clientRepository.save(existingClient);
            const clientResponse: ClientStatusDto = {
                clientuuid: savedClient.clientuuid,
                message: 'Client status updated successfully',
                statusCode: HttpStatus.OK,
            };
            return clientResponse;
        } catch (error) {
            this.handleInternalError(error, 'An error occurred while updating the client status');
        }
    }

    async updateClient(clientuuid: string, client: ClientUpdateDto): Promise<ClientResponseDto> {
        try {
            const existingClient = await this.clientRepository.findOneBy({
                clientuuid: clientuuid,
            });

            if (!existingClient) throw new NotFoundException(`Client with uuid ${clientuuid} not found`, HttpStatus.NOT_FOUND, 'NF_CLIENT_ERROR');

            if (existingClient && existingClient.clientname !== client.clientname) await this.ensureClientDoesNotExist('clientname', client.clientname, 'CLIENT_CLIENTNAME_ERROR');
            if (existingClient && existingClient.clientphone !== client.clientphone) await this.ensureClientDoesNotExist('clientphone', client.clientphone, 'CLIENT_CLIENTPHONE_ERROR');
            if (existingClient && existingClient.clientidentificationnumber !== client.clientidentificationnumber) await this.ensureClientDoesNotExist('clientidentificationnumber', client.clientidentificationnumber.toString(), 'CLIENT_CLIENTIDNUMBER_ERROR');
            if (existingClient && existingClient.clientemail !== client.clientemail) await this.ensureClientDoesNotExist('clientemail', client.clientemail, 'CLIENT_CLIENTEMAIL_ERROR');

            const newClientData: DeepPartial<Client> = {
                ...client,
                clientidentificationtype: { identificationtypeuuid: client.clientidentificationtype },
                city: { cityuuid: client.cityuuid },
            };

            const clientEntity = this.clientRepository.create(newClientData);
            const clientSaved = await this.clientRepository.save(clientEntity);

            const clientResponse: ClientResponseDto = {
                clientuuid: clientSaved.clientuuid,
                clienttype: clientSaved.clienttype,
                clientidentificationtype: clientSaved.clientidentificationtype,
                clientidentificationnumber: clientSaved.clientidentificationnumber,
                clientverificationnumber: clientSaved.clientverificationnumber,
                clientname: clientSaved.clientname,
                clientcode: clientSaved.clientcode,
                clientemail: clientSaved.clientemail,
                clientphone: clientSaved.clientphone,
                city: clientSaved.city,
                clientaddress: clientSaved.clientaddress,
                isActive: clientSaved.isActive,
                createdAt: clientSaved.createdAt,
                updatedAt: clientSaved.updatedAt,
            };
            return clientResponse;
        } catch (error) {
            this.handleInternalError(error, 'An error occurred while updating the client');
        }
    }

    async removeClient(clientuuid: string): Promise<ClientStatusDto> {
        try {
            const existingClient = await this.clientRepository.findOneBy({
                clientuuid: clientuuid,
            });

            if (!existingClient) throw new NotFoundException(`Client with uuid ${clientuuid} not found`, HttpStatus.NOT_FOUND, 'NF_CLIENT_ERROR');

            existingClient.isDeleted = !existingClient.isDeleted;
            const savedClient = await this.clientRepository.save(existingClient);
            const clientResponse: ClientStatusDto = {
                clientuuid: savedClient.clientuuid,
                message: 'Client deleted successfully',
                statusCode: HttpStatus.OK,
            };
            return clientResponse;
        } catch (error) {
            this.handleInternalError(error, 'An error occurred while removing the client');
        }
    }


    private async ensureClientDoesNotExist(type: 'clientname' | 'clientphone' | 'clientidentificationnumber' | 'clientemail', value: string, code: string) {
        const client = type === 'clientname' ? await this.getClientByUserName(value as string) : type === 'clientphone' ? await this.getClientByPhone(value as string) : type === 'clientidentificationnumber' ? await this.getClientByIdentificationNumber(parseInt(value)) : await this.getClientByEmail(value as string);
        if (client) {
            throw new AlreadyExistsException(
                'Client with ' + type + ' ' + value + ' already exists',
                HttpStatus.BAD_REQUEST,
                code,
            );
        }
    }

    private handleInternalError(error: unknown, message: string): never {
        if (error instanceof HttpException) {
            throw error;
        }
        throw new HttpException(
            {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                errorCode: 'INTERNAL_SERVER_ERROR',
                message,
            },
            HttpStatus.INTERNAL_SERVER_ERROR,
        );
    };
}
