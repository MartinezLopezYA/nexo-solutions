import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './tasks.entity';
import { v4 } from 'uuid';

@Injectable()
export class TasksService {
  private tasks: Task[] = [
    {
      id: '1',
      title: 'Task 1',
      description: 'Description for Task 1',
      status: TaskStatus.PENDING,
    },
  ];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTaskById(id: string): Task {
    return this.tasks.find((task) => task.id === id);
  }

  createTask(title: string, description: string): Task {
    const newTask: Task = {} as Task;
    newTask.id = v4();
    newTask.title = title;
    newTask.description = description;
    newTask.status = TaskStatus.PENDING;
    this.tasks.push(newTask);
    return newTask;
  }

  updateTask(id: string, title: string, description: string): Task {
    const task = this.getTaskById(id);
    if (!task) {
      throw new Error(`Task with id ${id} not found`);
    }
    task.title = title;
    task.description = description;
    return task;
  }

  updateStatus(id: string, status: TaskStatus): Task {
    const task = this.getTaskById(id);
    if (!task) {
      throw new Error(`Task with id ${id} not found`);
    }
    task.status = status;
    return task;
  }
}
