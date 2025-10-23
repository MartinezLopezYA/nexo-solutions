import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profession } from './entities/profession.entity';
import { Repository } from 'typeorm';
import { ProfessionCategory } from '../professions-category/entities/profession-category.entity';
import { AlreadyExistsException, NotFoundException } from 'src/common/exceptions/general-exception.';
import { ProfessionCreateDto, ProfessionInCategoryDto, ProfessionResponseDto, ProfessionStatusDto, ProfessionUpdateDto, ProfessionWithCategoriesDto } from './dto/profession.dto';
import { CategoryWithProfessionDto } from '../professions-category/dto/profession-category.dto';
import { InternalException } from 'src/common/exceptions/internal-exception';

@Injectable()
export class ProfessionsService {
    constructor(
        @InjectRepository(Profession)
        private readonly professionRepository: Repository<Profession>,
        @InjectRepository(ProfessionCategory)
        private readonly professionCategoryRepository: Repository<ProfessionCategory>
    ) { }

    async getProfessionByName(professionname: string): Promise<Profession> {
        return await this.professionRepository.findOneBy({
            professionname: professionname
        });
    }

    async getProfessionByAbbreviation(professionabbreviation: string): Promise<Profession> {
        return await this.professionRepository.findOneBy({
            professionabbreviation: professionabbreviation
        });
    }

    async getProfessionByCode(professioncode: string): Promise<Profession> {
        return await this.professionRepository.findOneBy({
            professioncode: professioncode
        })
    }

    async getAllProfessions(): Promise<ProfessionResponseDto[]> {
        try {
            const professions = await this.professionRepository.find({
                where: { isActive: true },
                order: { professionname: 'ASC' },
            });
            if (!professions) throw new NotFoundException('No professions found', HttpStatus.NOT_FOUND, 'NF_PROFESSION_ERROR');

            const professionResponseDto = professions.map((profession) => ({
                professionuuid: profession.professionuuid,
                professionname: profession.professionname,
                professiondescription: profession.professiondescription,
                professionabbreviation: profession.professionabbreviation,
                professioncode: profession.professioncode,
                isActive: profession.isActive,
            } as ProfessionResponseDto)) || [];
            return professionResponseDto;
        } catch (error) {
            this.handleInternalError(error, 'An error occurred while getting all professions');
        }
    }

    async getProfessionByUuid(uuid: string): Promise<ProfessionWithCategoriesDto> {
        try {
            const profession = await this.professionRepository.findOneBy({
                professionuuid: uuid,
            })
            if (!profession) throw new NotFoundException(`Profession with uuid ${uuid} not found`, HttpStatus.NOT_FOUND, 'NF_PROFESSION_ERROR');

            const professionResponseDto: ProfessionWithCategoriesDto = {
                professionuuid: profession.professionuuid,
                professionname: profession.professionname,
                professioncategory: profession.professioncategory ? {
                    professioncategoryuuid: profession.professioncategory.professioncategoryuuid,
                    professioncategoryname: profession.professioncategory.professioncategoryname,
                } : null
            };

            return professionResponseDto;
        } catch (error) {
            this.handleInternalError(error, 'An error occurred while getting the profession by uuid');
        }
    }

    async getProfessionsByCategory(professionscategoryuuid: string): Promise<ProfessionInCategoryDto[]> {
        try {
            const professioncategory = await this.professionCategoryRepository.findOneBy({
                professioncategoryuuid: professionscategoryuuid
            })

            if (!professioncategory) throw new NotFoundException(`Profession Category with uuid ${professionscategoryuuid} not found`, HttpStatus.NOT_FOUND, 'NF_PROFESSION_CATEGORY_ERROR')

            const professions = await this.professionRepository.find({
                where: { professioncategory: { professioncategoryuuid: professionscategoryuuid } },
                order: { professionname: 'ASC' }
            });

            if (!professions || professions.length === 0) throw new NotFoundException('No professions found', HttpStatus.NOT_FOUND, 'NF_PROFESSIONS_ERROR');

            const professionsResponseDto = professions.map(profession => ({
                professionuuid: profession.professionuuid,
                professionname: profession.professionname,
            } as ProfessionInCategoryDto)) || [];

            return professionsResponseDto;
        } catch (error) {
            throw new InternalException('An error ocurred while retrieving the professions');
        }
    }

    async addProfession(profession: ProfessionCreateDto): Promise<ProfessionResponseDto> {
        try {
            await this.ensureProfessionDoesNotExist('professionname', profession.professionname, 'AEN_PROFESSION_ERROR');
            await this.ensureProfessionDoesNotExist('professionabbreviation', profession.professionabbreviation, 'AEA_PROFESSION_ERROR');
            await this.ensureProfessionDoesNotExist('professioncode', profession.professioncode, 'AEC_PROFESSION_ERROR');

            const newProfession = this.professionRepository.create(profession);
            const savedProfession = await this.professionRepository.save(newProfession);
            const professionResponseDto: ProfessionResponseDto = {
                professionuuid: savedProfession.professionuuid,
                professionname: savedProfession.professionname,
                professiondescription: savedProfession.professiondescription,
                professionabbreviation: savedProfession.professionabbreviation,
                professioncode: savedProfession.professioncode,
                isActive: savedProfession.isActive,
            };
            return professionResponseDto;
        } catch (error) {
            this.handleInternalError(error, 'An error occurred while adding a profession');
        }
    }

    async updateProfessionStatus(professionuuid: string): Promise<ProfessionStatusDto> {
        try {
            const existingProfession = await this.professionRepository.findOneBy({
                professionuuid: professionuuid,
            });

            if (!existingProfession) throw new NotFoundException(`Profession with uuid ${professionuuid} not found`, HttpStatus.NOT_FOUND, 'NF_PROFESSION_ERROR');

            existingProfession.isActive = !existingProfession.isActive;
            const savedProfession = await this.professionRepository.save(existingProfession);
            const professionResponseDto: ProfessionStatusDto = {
                professionuuid: savedProfession.professionuuid,
                message: 'Profession status updated successfully',
                statusCode: HttpStatus.OK,
            };
            return professionResponseDto;
        } catch (error) {
            this.handleInternalError(error, 'An error occurred while updating the profession status');
        }
    }

    async updateProfession(professionuuid: string, profession: Partial<ProfessionUpdateDto>): Promise<ProfessionResponseDto> {
        try {
            await this.ensureProfessionDoesNotExist('professionname', profession.professionname, 'AEN_PROFESSION_ERROR');
            await this.ensureProfessionDoesNotExist('professionabbreviation', profession.professionabbreviation, 'AEA_PROFESSION_ERROR');
            await this.ensureProfessionDoesNotExist('professioncode', profession.professioncode, 'AEC_PROFESSION_ERROR');

            const existingProfession = await this.professionRepository.findOneBy({
                professionuuid: professionuuid,
            });

            if (!existingProfession) throw new NotFoundException(`Profession with uuid ${professionuuid} not found`, HttpStatus.NOT_FOUND, 'NF_PROFESSION_ERROR');

            const updatedProfession = Object.assign(existingProfession, profession);
            const savedProfession = await this.professionRepository.save(updatedProfession);
            const professionResponseDto: ProfessionResponseDto = {
                professionuuid: savedProfession.professionuuid,
                professionname: savedProfession.professionname,
                professiondescription: savedProfession.professiondescription,
                professionabbreviation: savedProfession.professionabbreviation,
                professioncode: savedProfession.professioncode,
                isActive: savedProfession.isActive,
            };
            return professionResponseDto;
        } catch (error) {
            this.handleInternalError(error, 'An error occurred while updating the profession');
        }
    }

    async removeProfession(professionuuid: string): Promise<ProfessionStatusDto> {
        try {
            const existingProfession = await this.professionRepository.findOneBy({
                professionuuid: professionuuid,
            });

            if (!existingProfession) throw new NotFoundException(`Profession with uuid ${professionuuid} not found`, HttpStatus.NOT_FOUND, 'NF_PROFESSION_ERROR');

            existingProfession.isDeleted = true;
            const savedProfession = await this.professionRepository.save(existingProfession);
            const professionResponseDto: ProfessionStatusDto = {
                professionuuid: savedProfession.professionuuid,
                message: 'Profession deleted successfully',
                statusCode: HttpStatus.OK,
            };
            return professionResponseDto;
        } catch (error) {
            this.handleInternalError(error, 'An error occurred while deleting the profession');
        }
    }

    private async ensureProfessionDoesNotExist(type: 'professionname' | 'professionabbreviation' | 'professioncode', value: string | number, code: string) {
        const profession = type === 'professionname'
            ? await this.getProfessionByName(value as string)
            : type === 'professionabbreviation'
                ? await this.getProfessionByAbbreviation(value as string)
                : await this.getProfessionByCode(value as string);
        if (profession) {
            throw new AlreadyExistsException(
                'Profession with ' + type + ' ' + value + ' already exists',
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
