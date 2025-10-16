import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { IdentificationTypeService } from './identification-type.service';
import { CreateIdentificationTypeDto, IdentificationTypeResponseDto } from './dto/identification-type.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@ApiTags('Identification Type')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('identification-type')
export class IdentificationTypeController {
    constructor(private identificationTypeService: IdentificationTypeService) { }

    @Get('v1')
    @ApiOperation({
        summary: 'Get all identification types',
        description: 'This endpoint returns a list of all identification types.',
    })
    @ApiResponse({
        status: 200,
        description: 'List of identification types',
        type: [IdentificationTypeResponseDto],
    })
    @ApiResponse({ status: 404, description: 'No identification types found' })
    async getAllIdentificationTypes(): Promise<IdentificationTypeResponseDto[]> {
        return await this.identificationTypeService.getAllIdentificationTypes();
    }

    @Post('v1')
    @ApiOperation({
        summary: 'Add a new identification type',
        description: 'This endpoint allows you to add a new identification type.',
    })
    @ApiResponse({
        status: 201,
        description: 'Identification type created successfully',
        type: IdentificationTypeResponseDto,
    })
    @ApiResponse({ status: 400, description: 'Bad request' })
    async addIdentificationType(@Body() identificationType: CreateIdentificationTypeDto): Promise<IdentificationTypeResponseDto> {
        return await this.identificationTypeService.addIdentificationType(identificationType);
    }
}
