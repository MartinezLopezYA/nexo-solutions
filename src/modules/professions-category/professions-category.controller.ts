import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UndefinedToNullInterceptorInterceptor } from 'src/common/interceptors/undefined-to-null-interceptor.interceptor';
import { ProfessionsCategoryService } from './professions-category.service';
import { CategoryWithProfessionDto, ProfessionCategoryCreateDto, ProfessionCategoryResponseDto, ProfessionCategoryStatusDto, ProfessionCategoryUpdateDto } from './dto/profession-category.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';

@ApiTags('Professions Category')
@UseInterceptors(UndefinedToNullInterceptorInterceptor)
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('professions-category')
export class ProfessionsCategoryController {
    constructor(private readonly professionsCategoryService: ProfessionsCategoryService) { }

    @Get('v1/:professioncategoryuuid')
    @Permissions('VIEW_CATEGORY_OF_PROFESSION_INFO')
    @ApiOperation({
        summary: 'Get profession category by uuid',
        description: 'This endpoint returns a profession category by uuid.',
    })
    @ApiResponse({
        status: 200,
        description: 'Profession category found',
        type: CategoryWithProfessionDto,
    })
    @ApiResponse({ status: 404, description: 'Profession category not found' })
    async getProfessionCategoryByUuid(@Param('professioncategoryuuid') professioncategoryuuid: string): Promise<CategoryWithProfessionDto> {
        return this.professionsCategoryService.getProfessionCategoryByUuid(professioncategoryuuid);
    }

    @Get('v1')
    @Permissions('LIST_ALL_CATEGORIES_OF_PROFESSIONS')
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
    @Permissions('LIST_ACTIVE_CATEGORIES_OF_PROFESSIONS')
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
    @Permissions('CREATE_CATEGORY_OF_PROFESSION')
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
    @Permissions('DEACTIVATE_CATEGORY_OF_PROFESSION', 'ACTIVATE_CATEGORY_OF_PROFESSION')
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
    @Permissions('UPDATE_CATEGORY_OF_PROFESSION')
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
    @Permissions('DELETE_CATEGORY_OF_PROFESSION')
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

    @Post('v1/:professioncategoryuuid/assign-professions')
    @Permissions('ASSIGN_PROFESSIONS_TO_CATEGORY')
    @ApiOperation({
        summary: 'Assign professions to a profession category',
        description: 'This endpoint assigns professions to a profession category.',
    })
    @ApiResponse({
        status: 200,
        description: 'Professions assigned successfully',
        type: CategoryWithProfessionDto,
    })
    @ApiResponse({ status: 404, description: 'Profession category not found' })
    async assignProfessionsToCategory(
        @Param('professioncategoryuuid') professioncategoryuuid: string,
        @Body() professionsuuids: string[],
    ): Promise<CategoryWithProfessionDto> {
        return this.professionsCategoryService.assignProfessionsToCategory(professioncategoryuuid, professionsuuids);
    }

}
