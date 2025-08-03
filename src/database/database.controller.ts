import { Controller, Get } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Database')
@Controller('database')
export class DatabaseController {
  constructor(private readonly databaseService: DatabaseService) {}

  @Get('test')
  async testConnection() {
    return await this.databaseService.testConnection();
  }
}
