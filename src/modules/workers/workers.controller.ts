import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { WorkersService } from './workers.service';
import { WorkerCreateDto, WorkerResponseDto, WorkerStatusDto, WorkerUpdateDto } from './dto/worker.dto';

@Controller('workers')
export class WorkersController {
    constructor(private readonly workersService: WorkersService) {}

    @Get('v1')
    @ApiOperation({
        summary: 'Get all workers',
        description: 'This endpoint returns a list of all workers.',
    })
    @ApiResponse({
        status: 200,
        description: 'List of workers',
        type: [WorkerResponseDto],
    })
    @ApiResponse({ status: 404, description: 'No workers found' })
    async getAllWorkers(): Promise<WorkerResponseDto[]> {
        return this.workersService.getAllWorkers();
    }

    @Get('v1/:clientuuid')
    @ApiOperation({
        summary: 'Get all workers by client',
        description: 'This endpoint returns a list of all workers by client.',
    })
    @ApiResponse({
        status: 200,
        description: 'List of workers',
        type: [WorkerResponseDto],
    })
    @ApiResponse({ status: 404, description: 'No workers found' })
    async getWorkersByClient(
        @Param('clientuuid') clientuuid: string
    ): Promise<WorkerResponseDto[]> {
        return this.workersService.getWorkersByClient(clientuuid);
    }

    @Post('v1')
    @ApiOperation({
        summary: 'Add a worker',
        description: 'This endpoint adds a new worker.',
    })
    @ApiResponse({
        status: 201,
        description: 'Worker added successfully',
        type: WorkerResponseDto,
    })
    @ApiResponse({ status: 400, description: 'Worker already exists' })
    async addWorker(
        @Body() worker: WorkerCreateDto
    ): Promise<WorkerResponseDto> {
        return this.workersService.addWorker(worker);
    }

    @Patch('v1/:workeruuid/status')
    @ApiOperation({
        summary: 'Update worker status',
        description: 'This endpoint updates the status of a worker.',
    })
    @ApiResponse({
        status: 200,
        description: 'Worker status updated successfully',
        type: WorkerStatusDto,
    })
    @ApiResponse({ status: 404, description: 'Worker not found' })
    async updateWorkerStatus(
        @Param('workeruuid') workeruuid: string
    ): Promise<WorkerStatusDto> {
        return this.workersService.updateWorkerStatus(workeruuid);
    }

    @Patch('v1/:workeruuid')
    @ApiOperation({
        summary: 'Update worker',
        description: 'This endpoint updates a worker.',
    })
    @ApiResponse({
        status: 200,
        description: 'Worker updated successfully',
        type: WorkerResponseDto,
    })
    @ApiResponse({ status: 404, description: 'Worker not found' })
    async updateWorker(
        @Param('workeruuid') workeruuid: string,
        @Body() worker: WorkerUpdateDto
    ): Promise<WorkerResponseDto> {
        return this.workersService.updateWorker(workeruuid, worker);
    }

    @Delete('v1/:workeruuid/remove')
    @ApiOperation({
        summary: 'Delete a worker',
        description: 'This endpoint deletes a worker.',
    })
    @ApiResponse({
        status: 200,
        description: 'Worker deleted successfully',
        type: WorkerStatusDto,
    })
    @ApiResponse({ status: 404, description: 'Worker not found' })
    async removeWorker(
        @Param('workeruuid') workeruuid: string
    ): Promise<WorkerStatusDto> {
        return this.workersService.removeWorker(workeruuid);
    }

}
