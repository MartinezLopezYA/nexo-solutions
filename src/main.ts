import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('nexo-solutions/api');
  const config = new DocumentBuilder()
    .setTitle('Nexo Solutions API')
    .setDescription('API documentation for Nexo Solutions')
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
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('nexo-solutions/api', app, document);
  await app.listen(3000);
}
bootstrap();
