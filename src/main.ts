import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { UndefinedToNullInterceptorInterceptor } from './common/interceptors/undefined-to-null-interceptor.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('port');
  app.setGlobalPrefix('zentriq-dev/api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );
  app.useGlobalInterceptors(
    new UndefinedToNullInterceptorInterceptor()
  );
  const config = new DocumentBuilder()
    .setTitle('Zentriq Dev API')
    .setDescription('API documentation for Zentriq Dev')
    .setContact(
      'Andres Martinez',
      'https://portfolio-nine-dun-88.vercel.app',
      'martinezlopezyersonandres.ing@gmail.com',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('zentriq-dev/api', app, document);
  await app.listen(port || 3000);
}
bootstrap();
