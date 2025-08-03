import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { TasksService } from './tasks.service';
import {
  CreateTaskDto,
  TaskResponseDto,
  UpdateStatusDto,
  UpdateTaskDto,
} from './dto/task.dto';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Tasks')
@Controller('v1/tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  @ApiResponse({ status: 200, description: 'Success', type: [TaskResponseDto] })
  @ApiResponse({ status: 404, description: 'Not Found' })
  getAllTasks(): TaskResponseDto[] {
    return this.tasksService.getAllTasks();
  }

  @Get(':id')
  getTaskById(@Param('id') id: string): TaskResponseDto {
    return this.tasksService.getTaskById(id);
  }

  @Post()
  @ApiBody({ type: CreateTaskDto })
  createTask(@Body() newTask: CreateTaskDto): TaskResponseDto {
    return this.tasksService.createTask(newTask.title, newTask.description);
  }

  @Patch(':id')
  updateTask(
    @Param('id') id: string,
    @Body() updatedTask: UpdateTaskDto,
  ): TaskResponseDto {
    return this.tasksService.updateTask(
      id,
      updatedTask.title,
      updatedTask.description,
    );
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() status: UpdateStatusDto,
  ): TaskResponseDto {
    return this.tasksService.updateStatus(id, status.status);
  }
}
