import { DataSource } from 'typeorm';
import configuration from './src/config/configuration';
import * as dotenv from 'dotenv';

dotenv.config();
const config = configuration();

export default new DataSource({
  type: 'postgres',
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: config.database.database,
  entities: ['src/modules/**/entities/*.entity.ts'],
  migrations: [
    'src/database/migrations/*.ts',
    'src/database/seeds/*.ts',
  ],
});
