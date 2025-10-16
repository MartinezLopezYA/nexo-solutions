import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UndefinedToNullInterceptorInterceptor } from 'src/common/interceptors/undefined-to-null-interceptor.interceptor';
import { ProfessionsService } from './professions.service';
import { ProfessionCreateDto, ProfessionResponseDto, ProfessionStatusDto, ProfessionUpdateDto, ProfessionWithCategoriesDto } from './dto/profession.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@ApiTags('Professions')
@UseInterceptors(UndefinedToNullInterceptorInterceptor)
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('professions')
export class ProfessionsController {
    constructor(private readonly professionsService: ProfessionsService) { }

    @Get('v1/:professionuuid')
    @ApiOperation({
        summary: 'Get profession by uuid',
        description: 'This endpoint returns a profession by uuid.',
    })
    @ApiResponse({
        status: 200,
        description: 'Profession found',
        type: ProfessionWithCategoriesDto,
    })
    @ApiResponse({ status: 404, description: 'Profession not found' })
    async getProfessionByUuid(@Param('professionuuid') professionuuid: string): Promise<ProfessionWithCategoriesDto> {
        return this.professionsService.getProfessionByUuid(professionuuid);
    }

    @Get('v1')
    @ApiOperation({
        summary: 'Get all professions',
        description: 'This endpoint returns all professions.'
    })
    @ApiResponse({
        status: 200,
        description: 'Professions found',
        type: ProfessionResponseDto,
        isArray: true,
    })
    @ApiResponse({ status: 404, description: 'Profession not found' })
    async getAllProfessions(): Promise<ProfessionResponseDto[]> {
        return this.professionsService.getAllProfessions();
    }

    @Post('v1')
    @ApiOperation({
        summary: 'Add a Profession',
        description: 'This endpoint adds a new Profession'
    })
    @ApiResponse({
        status: 201,
        description: 'Profession added successfully',
        type: ProfessionResponseDto
    })
    @ApiResponse({ status: 400, description: 'Profession already exists' })
    async addProfession(@Body() profession: ProfessionCreateDto): Promise<ProfessionResponseDto> {
        return this.professionsService.addProfession(profession)
    }

    @Patch('v1/:professionuuid/status')
    @ApiOperation({
        summary: 'Update a Profession status',
        description: 'This endpoint updates a profession status by uuid.'
    })
    @ApiResponse({ status: 200, description: 'Profession status updated successfully' })
    @ApiResponse({ status: 404, description: 'Profession not found' })
    async updateProfessionStatus(@Param('professionuuid') professionuuid: string): Promise<ProfessionStatusDto> {
        return this.professionsService.updateProfessionStatus(professionuuid);
    }

    @Patch('v1/:professionuuid')
    @ApiOperation({
        summary: 'Update a Profession',
        description: 'This endpoint updates a profession by uuid.'
    })
    @ApiResponse({ status: 200, description: 'Profession updated successfully' })
    @ApiResponse({ status: 404, description: 'Profession not found' })
    async updateProfession(@Param('professionuuid') professionuuid: string, @Body() profession: ProfessionUpdateDto): Promise<ProfessionResponseDto> {
        return this.professionsService.updateProfession(professionuuid, profession);
    }

    @Delete('v1/:professionuuid')
    @ApiOperation({
        summary: 'Delete a Profession',
        description: 'This endpoint deletes a profession by uuid.'
    })
    @ApiResponse({ status: 200, description: 'Profession deleted successfully' })
    @ApiResponse({ status: 404, description: 'Profession not found' })
    async removeProfession(@Param('professionuuid') professionuuid: string): Promise<ProfessionStatusDto> {
        return this.professionsService.removeProfession(professionuuid);
    }


}
