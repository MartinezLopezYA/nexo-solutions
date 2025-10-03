import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { validationSchema } from './config/validation';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { LocationModule } from './modules/location/location.module';
import { IdentificationTypeModule } from './modules/identification-type/identification-type.module';
import { ClientModule } from './modules/clients/client.module';
import { ProfessionsModule } from './modules/professions/professions.module';
import { ProfessionsCategoryModule } from './modules/professions-category/professions-category.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config) => ({
        type: 'postgres',
        host: config.get('database.host'),
        port: config.get('database.port'),
        username: config.get('database.username'),
        password: config.get('database.password'),
        database: config.get('database.database'),
        autoLoadEntities: true,
        synchronize: false,
      }),
      inject: [ConfigService],
    }),

    DatabaseModule,
    ClientModule,
    UsersModule,
    RolesModule,
    PermissionsModule,
    ProfessionsCategoryModule,
    ProfessionsModule,
    LocationModule,
    IdentificationTypeModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
