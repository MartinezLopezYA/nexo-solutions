import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class DatabaseService {
  constructor(private readonly dataSource: DataSource) {}

  async testConnection(): Promise<string> {
    try {
      await this.dataSource.query('SELECT 1');
      return '✅ Database connection successful!';
    } catch (error) {
      console.error('❌ Database connection failed:', error.message);
      return '❌ Database connection failed!';
    }
  }
}
