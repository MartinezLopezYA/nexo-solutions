import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ProfessionCategory } from './entities/profession-category.entity';
import { CategoryWithProfessionDto, ProfessionCategoryCreateDto, ProfessionCategoryResponseDto, ProfessionCategoryStatusDto, ProfessionCategoryUpdateDto } from './dto/profession-category.dto';
import { AlreadyExistsException, NotFoundException } from 'src/common/exceptions/general-exception.';
import { Profession } from '../professions/entities/profession.entity';

@Injectable()
export class ProfessionsCategoryService {
    constructor(
        @InjectRepository(ProfessionCategory)
        private readonly professionCategoryRepository: Repository<ProfessionCategory>,
        @InjectRepository(Profession)
        private readonly professionRepository: Repository<Profession>,
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

    async getProfessionCategoryByUuid(uuid: string): Promise<CategoryWithProfessionDto> {
        try {
            const professionCategory = await this.professionCategoryRepository.findOne({
                where: { professioncategoryuuid: uuid},
                relations: ['professions'],
            });

            if (!professionCategory) throw new NotFoundException(`Profession category with uuid ${uuid} not found`, HttpStatus.NOT_FOUND, 'NF_PROFESSION_CATEGORY_ERROR');

            const professionResponseDto = {
                professioncategoryuuid: professionCategory.professioncategoryuuid,
                professioncategoryname: professionCategory.professioncategoryname,
                professions: professionCategory.professions.filter((profession) => profession.isActive).map(profession => ({
                    professionuuid: profession.professionuuid,
                    professionname: profession.professionname,
                })) || [],
            } as CategoryWithProfessionDto;
            return professionResponseDto;
        } catch (error) {
            this.handleInternalError(error, 'An error occurred while getting the profession category by uuid');
        }
    }

    async getAllProfessionsCategories(): Promise<ProfessionCategoryResponseDto[]> {
        try {
            const professions = await this.professionCategoryRepository.find({
                where: {
                    isDeleted: false,
                },
                order: { professioncategoryname: 'ASC' },
            });

            if (!professions || professions.length === 0) throw new NotFoundException('No professions found', HttpStatus.NOT_FOUND, 'NF_PROFESSION_ERROR');

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

            if (!professions || professions.length === 0) throw new NotFoundException('No professions found', HttpStatus.NOT_FOUND, 'NF_PROFESSION_ERROR');

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
            await this.ensureProfessionCategoryDoesNotExist('professioncategoryname', professionCategory.professioncategoryname, 'AEN_PROFESSION_CATEGORY_ERROR');
            await this.ensureProfessionCategoryDoesNotExist('professioncategoryabbreviation', professionCategory.professioncategoryabbreviation, 'AEA_PROFESSION_CATEGORY_ERROR');
            await this.ensureProfessionCategoryDoesNotExist('professioncategorycode', professionCategory.professioncategorycode, 'AEC_PROFESSION_CATEGORY_ERROR');

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

            if (!existingProfessionCategory) throw new NotFoundException(`Profession category with uuid ${professioncategoryuuid} not found`, HttpStatus.NOT_FOUND, 'NF_PROFESSION_CATEGORY_ERROR');

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
            await this.ensureProfessionCategoryDoesNotExist('professioncategoryname', professionCategory.professioncategoryname, 'AEN_PROFESSION_CATEGORY_ERROR');
            await this.ensureProfessionCategoryDoesNotExist('professioncategoryabbreviation', professionCategory.professioncategoryabbreviation, 'AEA_PROFESSION_CATEGORY_ERROR');
            await this.ensureProfessionCategoryDoesNotExist('professioncategorycode', professionCategory.professioncategorycode, 'AEC_PROFESSION_CATEGORY_ERROR');

            const existingProfessionCategory = await this.professionCategoryRepository.findOneBy({
                professioncategoryuuid: professioncategoryuuid,
            });

            if (!existingProfessionCategory) throw new NotFoundException(`Profession category with uuid ${professioncategoryuuid} not found`, HttpStatus.NOT_FOUND, 'NF_PROFESSION_CATEGORY_ERROR');

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

            if (!existingProfessionCategory) throw new NotFoundException(`Profession category with uuid ${professioncategoryuuid} not found`, HttpStatus.NOT_FOUND, 'NF_PROFESSION_CATEGORY_ERROR');

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

    async assignProfessionsToCategory(categoryuuid: string, professionsuuids: string[]): Promise<CategoryWithProfessionDto> {
        try {
            const category = await this.professionCategoryRepository.findOne({
                where: { professioncategoryuuid: categoryuuid },
                relations: ['professions'],
            });

            if (!category) throw new NotFoundException(`Profession category with uuid ${categoryuuid} not found`, HttpStatus.NOT_FOUND, 'NF_PROFESSION_CATEGORY_ERROR');

            const idsArray = Array.isArray(professionsuuids) ? professionsuuids : Object.values(professionsuuids);

            const professions = await this.professionRepository.find({
                where: { professionuuid: In(idsArray) },
            });

            if (professions.length !== idsArray.length) throw new NotFoundException(`Some professions not found for category with uuid ${categoryuuid}`, HttpStatus.NOT_FOUND, 'NFP_PROFESSION_CATEGORY_ERROR');

            category.professions = professions;
            const savedProfessionCategory = await this.professionCategoryRepository.save(category);
            const categoryResponse: CategoryWithProfessionDto = {
                professioncategoryuuid: savedProfessionCategory.professioncategoryuuid,
                professioncategoryname: savedProfessionCategory.professioncategoryname,
                professions: savedProfessionCategory.professions.map(profession => ({
                    professionuuid: profession.professionuuid,
                    professionname: profession.professionname
                })),
            }
            return categoryResponse;
        } catch (error) {
            this.handleInternalError(error, 'An error occurred while assigning professions to the category');
        }
    }

    private async ensureProfessionCategoryDoesNotExist(type: 'professioncategoryname' | 'professioncategoryabbreviation' | 'professioncategorycode', value: string, code: string) {
        const professionCategory = type === 'professioncategoryname'
            ? await this.getProfessionCategoryByName(value as string)
            : type === 'professioncategoryabbreviation'
            ? await this.getProfessionCategoryByAbbreviation(value as string)
            : await this.getProfessionCategoryByCode(value as string);
        if (professionCategory) {
            throw new AlreadyExistsException(
                'Profession category with ' + type + ' ' + value + ' already exists',
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
