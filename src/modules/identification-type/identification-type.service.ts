import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IdentificationType } from './entities/identification-type.entity';
import { Repository } from 'typeorm';
import { AlreadyExistsException, NotFoundException } from 'src/common/exceptions/general-exception.';
import { CreateIdentificationTypeDto, IdentificationTypeResponseDto } from './dto/identification-type.dto';

@Injectable()
export class IdentificationTypeService {
    constructor(
        @InjectRepository(IdentificationType)
        private readonly identificationTypeRepository: Repository<IdentificationType>,
    ) { }

    async getAllIdentificationTypes(): Promise<IdentificationTypeResponseDto[]> {
        try {
            const identificationTypes = await this.identificationTypeRepository.find({
                order: { identificationtypename: 'ASC' },
            });
            if (!identificationTypes || identificationTypes.length === 0) {
                throw new NotFoundException(
                    'No identification types found',
                    HttpStatus.NOT_FOUND,
                    'NF_IDENTIFICATION_TYPE_ERROR',
                );
            }

            const identificationTypeResponseDto = identificationTypes.map(identificationType => ({
                identificationtypeuuid: identificationType.identificationtypeuuid,
                identificationtypename: identificationType.identificationtypename,
                identificationtypecode: identificationType.identificationtypecode,
                isActive: identificationType.isActive,
            } as IdentificationTypeResponseDto)) || [];

            return identificationTypeResponseDto;
        } catch (error) {
            this.handleInternalError(error, 'An error occurred while updating the identification type');
        }
    }

    async findByName(identificationtypename: string): Promise<IdentificationType> {
        return await this.identificationTypeRepository.findOneBy({
            identificationtypename: identificationtypename,
        });
    }

    async findByCode(identificationtypecode: string): Promise<IdentificationType> {
        return await this.identificationTypeRepository.findOneBy({
            identificationtypecode: identificationtypecode,
        });
    }

    async addIdentificationType(identificationType: CreateIdentificationTypeDto): Promise<IdentificationTypeResponseDto> {
        try {
            const existName = await this.findByName(identificationType.identificationtypename);
            if (existName) {
                throw new AlreadyExistsException(
                    'Identification type with name ' + identificationType.identificationtypename + ' already exists',
                    HttpStatus.BAD_REQUEST,
                    'AEN_IDENTIFICATION_TYPE_ERROR',
                );
            }
            const existCode = await this.findByCode(identificationType.identificationtypecode);
            if (existCode) {
                throw new AlreadyExistsException(
                    'Identification type with code ' + identificationType.identificationtypecode + ' already exists',
                    HttpStatus.BAD_REQUEST,
                    'AEC_IDENTIFICATION_TYPE_ERROR',
                );
            }

            const newIdentificationType = this.identificationTypeRepository.create(identificationType);
            const savedIdentificationType = await this.identificationTypeRepository.save(newIdentificationType);
            const identificationTypeResponseDto: IdentificationTypeResponseDto = {
                identificationtypeuuid: savedIdentificationType.identificationtypeuuid,
                identificationtypename: savedIdentificationType.identificationtypename,
                identificationtypecode: savedIdentificationType.identificationtypecode,
                isActive: savedIdentificationType.isActive,
            };
            return identificationTypeResponseDto;
        } catch (error) {
            this.handleInternalError(error, 'An error occurred while updating the identification type');
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
    }
}
