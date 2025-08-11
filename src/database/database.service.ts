import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class DatabaseService {
  constructor(private readonly dataSource: DataSource) {}

  async testConnection(): Promise<string> {
    try {
      await this.dataSource.query('SELECT 1');
      const dbName = this.dataSource.options.database;
      return `✅ Database connection successful! Connected to "${dbName}".`;
    } catch (error) {
      console.error('❌ Database connection failed:', error.message);
      return '❌ Database connection failed!';
    }
  }
}
