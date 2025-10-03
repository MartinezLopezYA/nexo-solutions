import { Body, Controller, Delete, Get, Param, Patch, Post, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UndefinedToNullInterceptorInterceptor } from 'src/common/interceptors/undefined-to-null-interceptor.interceptor';
import { ProfessionsCategoryService } from './professions-category.service';
import { ProfessionCategoryCreateDto, ProfessionCategoryResponseDto, ProfessionCategoryStatusDto, ProfessionCategoryUpdateDto } from './dto/profession-category.dto';

@ApiTags('Professions Category')
@UseInterceptors(UndefinedToNullInterceptorInterceptor)
@Controller('professions-category')
export class ProfessionsCategoryController {
    constructor(private readonly professionsCategoryService: ProfessionsCategoryService) { }

    @Get('v1')
    @ApiOperation({
        summary: 'Get all professions category',
        description: 'This endpoint returns a list of all professions category.',
    })
    @ApiResponse({
        status: 200,
        description: 'List of professions category',
        type: [ProfessionCategoryResponseDto],
    })
    @ApiResponse({ status: 404, description: 'No professions category found' })
    async getAllProfessionsCategory(): Promise<ProfessionCategoryResponseDto[]> {
        return this.professionsCategoryService.getAllProfessionsCategories();
    }

    @Get('v1/active')
    @ApiOperation({
        summary: 'Get all active professions category',
        description: 'This endpoint returns a list of all active professions category.',
    })
    @ApiResponse({
        status: 200,
        description: 'List of active professions category',
        type: [ProfessionCategoryResponseDto],
    })
    @ApiResponse({ status: 404, description: 'No active professions category found' })
    async getActiveProfessionsCategory(): Promise<ProfessionCategoryResponseDto[]> {
        return this.professionsCategoryService.getActiveProfessionsCategories();
    }

    @Post('v1')
    @ApiOperation({
        summary: 'Add a Profession Category',
        description: 'This endpoint adds a new Prefession Category'
    })
    @ApiResponse({
        status: 201,
        description: 'Profession Category added successfully',
        type: ProfessionCategoryResponseDto
    })
    @ApiResponse({ status: 400, description: 'Profession Category already exists' })
    async addProfessionCategory(@Body() professionCategory: ProfessionCategoryCreateDto): Promise<ProfessionCategoryResponseDto> {
        return this.professionsCategoryService.addProfessionCategory(professionCategory)
    }

    @Patch('v1/:professioncategoryuuid/status')
    @ApiOperation({
        summary: 'Update profession category status',
        description: 'This endpoint updates the status of a profession category.',
    })
    @ApiResponse({
        status: 200,
        description: 'Profession category status updated successfully',
        type: ProfessionCategoryStatusDto,
    })
    @ApiResponse({ status: 404, description: 'Profession category not found' })
    async updateProfessionCategoryStatus(
        @Param('professioncategoryuuid') professioncategoryuuid: string
    ): Promise<ProfessionCategoryStatusDto> {
        return this.professionsCategoryService.updateProfessionCategoryStatus(professioncategoryuuid);
    }

    @Patch('v1/:professioncategoryuuid')
    @ApiOperation({
        summary: 'Update profession category',
        description: 'This endpoint updates a profession category.',
    })
    @ApiResponse({
        status: 200,
        description: 'Profession category updated successfully',
        type: ProfessionCategoryResponseDto,
    })
    @ApiResponse({ status: 404, description: 'Profession category not found' })
    async updateProfessionCategory(
        @Param('professioncategoryuuid') professioncategoryuuid: string,
        @Body() professionCategory: Partial<ProfessionCategoryUpdateDto>
    ): Promise<ProfessionCategoryResponseDto> {
        return this.professionsCategoryService.updateProfessionCategory(professioncategoryuuid, professionCategory);
    }

    @Delete('v1/:professioncategoryuuid/remove')
    @ApiOperation({
        summary: 'Delete a profession category',
        description: 'This endpoint deletes a profession category.',
    })
    @ApiResponse({
        status: 200,
        description: 'Profession category deleted successfully',
        type: ProfessionCategoryStatusDto,
    })
    @ApiResponse({ status: 404, description: 'Profession category not found' })
    async removeProfessionCategory(
        @Param('professioncategoryuuid') professioncategoryuuid: string
    ): Promise<ProfessionCategoryStatusDto> {
        return this.professionsCategoryService.removeProfessionCategory(professioncategoryuuid);
    }

}
