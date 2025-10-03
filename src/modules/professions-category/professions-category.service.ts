import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProfessionCategory } from './entities/profession-category.entity';
import { ProfessionCategoryCreateDto, ProfessionCategoryResponseDto, ProfessionCategoryStatusDto, ProfessionCategoryUpdateDto } from './dto/profession-category.dto';
import { AlreadyExistsException, NotFoundException } from 'src/common/exceptions/general-exception.';

@Injectable()
export class ProfessionsCategoryService {
    constructor(
        @InjectRepository(ProfessionCategory)
        private readonly professionCategoryRepository: Repository<ProfessionCategory>,
    ) { }

    async getProfessionCategoryByAbbreviation(abbreviation: string): Promise<ProfessionCategory> {
        return await this.professionCategoryRepository.findOneBy({
            professioncategoryabbreviation: abbreviation
        });
    }

    async getProfessionCategoryByCode(code: string): Promise<ProfessionCategory> {
        return await this.professionCategoryRepository.findOneBy({
            professioncategorycode: code
        });
    }

    async getProfessionCategoryByName(name: string): Promise<ProfessionCategory> {
        return await this.professionCategoryRepository.findOneBy({
            professioncategoryname: name
        });
    }

    async getAllProfessionsCategories(): Promise<ProfessionCategoryResponseDto[]> {
        try {
            const professions = await this.professionCategoryRepository.find({
                where: {
                    isDeleted: false,
                },
                order: { professioncategoryname: 'ASC' },
            });

            if (!professions || professions.length === 0) {
                throw new NotFoundException(
                    'No professions found',
                    HttpStatus.NOT_FOUND,
                    'NF_PROFESSION_ERROR',
                );
            }

            const professionResponseDto = professions.map(profession => ({
                professioncategoryuuid: profession.professioncategoryuuid,
                professioncategoryname: profession.professioncategoryname,
                professioncategoryabbreviation: profession.professioncategoryabbreviation,
                professioncategorycode: profession.professioncategorycode,
                isActive: profession.isActive,
            } as ProfessionCategoryResponseDto)) || [];
            return professionResponseDto;
        } catch (error) {
            this.handleInternalError(error, 'An error occurred while getting all professions');
        }
    }

    async getActiveProfessionsCategories(): Promise<ProfessionCategoryResponseDto[]> {
        try {
            const professions = await this.professionCategoryRepository.find({
                where: {
                    isDeleted: false,
                    isActive: true,
                },
                order: { professioncategoryname: 'ASC' },
            });

            if (!professions || professions.length === 0) {
                throw new NotFoundException(
                    'No professions found',
                    HttpStatus.NOT_FOUND,
                    'NF_PROFESSION_ERROR',
                );
            }

            const professionResponseDto = professions.map(profession => ({
                professioncategoryuuid: profession.professioncategoryuuid,
                professioncategoryname: profession.professioncategoryname,
                professioncategoryabbreviation: profession.professioncategoryabbreviation,
                professioncategorycode: profession.professioncategorycode,
                isActive: profession.isActive,
            } as ProfessionCategoryResponseDto)) || [];
            return professionResponseDto;
        } catch (error) {
            this.handleInternalError(error, 'An error occurred while getting all professions');
        }
    }

    async addProfessionCategory(professionCategory: ProfessionCategoryCreateDto): Promise<ProfessionCategoryResponseDto> {
        try {
            const pcByName = await this.getProfessionCategoryByName(professionCategory.professioncategoryname);
            if (pcByName) {
                throw new AlreadyExistsException(
                    'Profession category already exists',
                    HttpStatus.BAD_REQUEST,
                    'AEN_PROFESSION_CATEGORY_ERROR',
                );
            }

            const pcByAbbreviation = await this.getProfessionCategoryByAbbreviation(professionCategory.professioncategoryabbreviation);
            if (pcByAbbreviation) {
                throw new AlreadyExistsException(
                    'Profession category abbreviation already exists',
                    HttpStatus.BAD_REQUEST,
                    'AEA_PROFESSION_CATEGORY_ERROR',
                );
            }

            const pcByCode = await this.getProfessionCategoryByCode(professionCategory.professioncategorycode);
            if (pcByCode) {
                throw new AlreadyExistsException(
                    'Profession category code already exists',
                    HttpStatus.BAD_REQUEST,
                    'AEC_PROFESSION_CATEGORY_ERROR',
                );
            }

            const newProfessionCategory = this.professionCategoryRepository.create(professionCategory);
            const savedProfessionCategory = await this.professionCategoryRepository.save(newProfessionCategory);
            const professionCategoryResponse: ProfessionCategoryResponseDto = {
                professioncategoryuuid: savedProfessionCategory.professioncategoryuuid,
                professioncategoryname: savedProfessionCategory.professioncategoryname,
                professioncategoryabbreviation: savedProfessionCategory.professioncategoryabbreviation,
                professioncategorycode: savedProfessionCategory.professioncategorycode,
                isActive: savedProfessionCategory.isActive,
            }
            return professionCategoryResponse;
        } catch (error) {
            this.handleInternalError(error, 'An error occurred while adding a profession category');
        }
    }

    async updateProfessionCategoryStatus(professioncategoryuuid: string): Promise<ProfessionCategoryStatusDto> {
        try {
            const existingProfessionCategory = await this.professionCategoryRepository.findOneBy({
                professioncategoryuuid: professioncategoryuuid,
            });

            if (!existingProfessionCategory) {
                throw new NotFoundException(
                    `Profession category with uuid ${professioncategoryuuid} not found`,
                    HttpStatus.NOT_FOUND,
                    'NF_PROFESSION_CATEGORY_ERROR',
                );
            }

            existingProfessionCategory.isActive = !existingProfessionCategory.isActive;
            const savedProfessionCategory = await this.professionCategoryRepository.save(existingProfessionCategory);
            const professionCategoryResponse: ProfessionCategoryStatusDto = {
                professioncategoryuuid: savedProfessionCategory.professioncategoryuuid,
                message: 'Profession category status updated successfully',
                statusCode: HttpStatus.OK,
            };
            return professionCategoryResponse;
        } catch (error) {
            this.handleInternalError(error, 'An error occurred while updating the profession category status');
        }
    }

    async updateProfessionCategory(professioncategoryuuid: string, professionCategory: Partial<ProfessionCategoryUpdateDto>): Promise<ProfessionCategoryResponseDto> {
        try {
            const pcByName = await this.getProfessionCategoryByName(professionCategory.professioncategoryname);
            if (pcByName) {
                throw new AlreadyExistsException(
                    'Profession category already exists',
                    HttpStatus.BAD_REQUEST,
                    'AEN_PROFESSION_CATEGORY_ERROR',
                );
            }

            const pcByAbbreviation = await this.getProfessionCategoryByAbbreviation(professionCategory.professioncategoryabbreviation);
            if (pcByAbbreviation) {
                throw new AlreadyExistsException(
                    'Profession category abbreviation already exists',
                    HttpStatus.BAD_REQUEST,
                    'AEA_PROFESSION_CATEGORY_ERROR',
                );
            }

            const pcByCode = await this.getProfessionCategoryByCode(professionCategory.professioncategorycode);
            if (pcByCode) {
                throw new AlreadyExistsException(
                    'Profession category code already exists',
                    HttpStatus.BAD_REQUEST,
                    'AEC_PROFESSION_CATEGORY_ERROR',
                );
            }

            const existingProfessionCategory = await this.professionCategoryRepository.findOneBy({
                professioncategoryuuid: professioncategoryuuid,
            });

            if (!existingProfessionCategory) {
                throw new NotFoundException(
                    `Profession category with uuid ${professioncategoryuuid} not found`,
                    HttpStatus.NOT_FOUND,
                    'NF_PROFESSION_CATEGORY_ERROR',
                );
            }

            const updatedProfessionCategory = Object.assign(existingProfessionCategory, professionCategory);
            const savedProfessionCategory = await this.professionCategoryRepository.save(updatedProfessionCategory);
            const professionCategoryResponse: ProfessionCategoryResponseDto = {
                professioncategoryuuid: savedProfessionCategory.professioncategoryuuid,
                professioncategoryname: savedProfessionCategory.professioncategoryname,
                professioncategoryabbreviation: savedProfessionCategory.professioncategoryabbreviation,
                professioncategorycode: savedProfessionCategory.professioncategorycode,
                isActive: savedProfessionCategory.isActive,
            };
            return professionCategoryResponse;
        } catch (error) {
            this.handleInternalError(error, 'An error occurred while updating the profession category');
        }
    }

    async removeProfessionCategory(professioncategoryuuid: string): Promise<ProfessionCategoryStatusDto> {
        try {
            const existingProfessionCategory = await this.professionCategoryRepository.findOneBy({
                professioncategoryuuid: professioncategoryuuid,
            });

            if (!existingProfessionCategory) {
                throw new NotFoundException(
                    `Profession category with uuid ${professioncategoryuuid} not found`,
                    HttpStatus.NOT_FOUND,
                    'NF_PROFESSION_CATEGORY_ERROR',
                );
            }

            existingProfessionCategory.isDeleted = true;
            const savedProfessionCategory = await this.professionCategoryRepository.save(existingProfessionCategory);
            const professionCategoryResponse: ProfessionCategoryStatusDto = {
                professioncategoryuuid: savedProfessionCategory.professioncategoryuuid,
                message: 'Profession category deleted successfully',
                statusCode: HttpStatus.OK,
            };
            return professionCategoryResponse;
        } catch (error) {
            this.handleInternalError(error, 'An error occurred while deleting the profession category');
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
