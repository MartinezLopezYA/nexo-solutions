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

            if (!identificationTypes || identificationTypes.length === 0) throw new NotFoundException('No identification types found', HttpStatus.NOT_FOUND, 'NF_IDENTIFICATION_TYPE_ERROR');

            const identificationTypeResponseDto = identificationTypes.map(identificationType => ({
                identificationtypeuuid: identificationType.identificationtypeuuid,
                identificationtypename: identificationType.identificationtypename,
                identificationtypecode: identificationType.identificationtypecode,
                isActive: identificationType.isActive,
            } as IdentificationTypeResponseDto)) || [];

            return identificationTypeResponseDto;
        } catch (error) {
            this.handleInternalError(error, 'An error occurred while getting all identification types');
        }
    }

    async getIdentiTypeByName(identificationtypename: string): Promise<IdentificationType> {
        return await this.identificationTypeRepository.findOneBy({
            identificationtypename: identificationtypename,
        });
    }

    async getIdentiTypeByCode(identificationtypecode: string): Promise<IdentificationType> {
        return await this.identificationTypeRepository.findOneBy({
            identificationtypecode: identificationtypecode,
        });
    }

    async addIdentificationType(identificationType: CreateIdentificationTypeDto): Promise<IdentificationTypeResponseDto> {
        try {

            await this.ensureIdentificationTypeDoesNotExist('identificationtypename', identificationType.identificationtypename, 'AEN_IDENTIFICATION_TYPE_ERROR');
            await this.ensureIdentificationTypeDoesNotExist('identificationtypecode', identificationType.identificationtypecode, 'AEC_IDENTIFICATION_TYPE_ERROR');

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

    private async ensureIdentificationTypeDoesNotExist(type: 'identificationtypename' | 'identificationtypecode', value: string, code: string) {
        const IdentificationType = type === 'identificationtypename' ? await this.getIdentiTypeByName(value as string) : await this.getIdentiTypeByCode(value as string);
        if (IdentificationType) {
            throw new AlreadyExistsException(
                'Identification type with ' + type + ' ' + value + ' already exists',
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
    }
}
