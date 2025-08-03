import { TaskStatus } from '../tasks.entity';

export class CreateTaskDto {
  title: string = 'New Task';
  description: string = 'New Task description';
}

export class UpdateTaskDto {
  title: string = 'New Task';
  description: string = 'New Task description';
}

export class UpdateStatusDto {
  status: TaskStatus = TaskStatus.PENDING;
}

//Dto

export class TaskResponseDto {
  id: string | null;
  title: string | null;
  description: string | null;
  status: TaskStatus | null;
}
