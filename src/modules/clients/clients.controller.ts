import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ClientsService } from './clients.service';
import { ClientCreateDto, ClientResponseDto, ClientStatusDto, ClientUpdateDto } from './dto/client.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@ApiTags('Clients')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('client')
export class ClientsController {
    constructor(private readonly clientsService: ClientsService) {}

    @Get('v1')
    @ApiOperation({
        summary: 'Get all clients',
        description: 'This endpoint returns a list of all clients.',
    })
    @ApiResponse({
        status: 200,
        description: 'List of clients',
        type: [ClientResponseDto],
    })
    @ApiResponse({ status: 404, description: 'No clients found' })
    async getAllClients(): Promise<ClientResponseDto[]> {
        return this.clientsService.getAllClients();
    }

    @Get('v1/:clientuuid')
    @ApiOperation({
        summary: 'Get client by uuid',
        description: 'This endpoint returns a client by uuid.',
    })
    @ApiResponse({
        status: 200,
        description: 'Client',
        type: ClientResponseDto,
    })
    @ApiResponse({ status: 404, description: 'Client not found' })
    async getClientByUuid(@Param('clientuuid') clientuuid: string): Promise<ClientResponseDto> {
        return this.clientsService.getClientByUuid(clientuuid);
    }

    @Post('v1')
    @ApiOperation({
        summary: 'Add a client',
        description: 'This endpoint adds a new client.',
    })
    @ApiResponse({
        status: 201,
        description: 'Client added successfully',
        type: ClientResponseDto,
    })
    @ApiResponse({ status: 400, description: 'Client already exists' })
    async addClient(@Body() client: ClientCreateDto): Promise<ClientResponseDto> {
        return this.clientsService.addClient(client);
    }

    @Patch('v1/:clientuuid/status')
    @ApiOperation({
        summary: 'Update client status',
        description: 'This endpoint updates the status of a client.',
    })
    @ApiResponse({
        status: 200,
        description: 'Client status updated successfully',
        type: ClientStatusDto,
    })
    @ApiResponse({ status: 404, description: 'Client not found' })
    async updateClientStatus(@Param('clientuuid') clientuuid: string): Promise<ClientStatusDto> {
        return this.clientsService.updateClientStatus(clientuuid);
    }

    @Patch('v1/:clientuuid')
    @ApiOperation({
        summary: 'Update client',
        description: 'This endpoint updates a client.',
    })
    @ApiResponse({
        status: 200,
        description: 'Client updated successfully',
        type: ClientResponseDto,
    })
    @ApiResponse({ status: 404, description: 'Client not found' })
    async updateClient(@Param('clientuuid') clientuuid: string, @Body() client: ClientUpdateDto): Promise<ClientResponseDto> {
        return this.clientsService.updateClient(clientuuid, client);
    }

    @Delete('v1/:clientuuid/remove')
    @ApiOperation({
        summary: 'Delete a client',
        description: 'This endpoint deletes a client.',
    })
    @ApiResponse({
        status: 200,
        description: 'Client deleted successfully',
        type: ClientStatusDto,
    })
    @ApiResponse({ status: 404, description: 'Client not found' })
    async removeClient(@Param('clientuuid') clientuuid: string): Promise<ClientStatusDto> {
        return this.clientsService.removeClient(clientuuid);
    }
}
