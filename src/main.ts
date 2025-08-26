import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';

import { join } from 'path';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Serve static dashboard
  app.useStaticAssets(join(__dirname, '..', 'public'));

  const config = new DocumentBuilder()
    .setTitle('IWGC API')
    .setDescription('API to enqueue and process lab results')
    .setVersion('1.0')
    // .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'BearerAuth')
    // .addServer('http://localhost:3000')
    // .addTag('health')
    // .addTag('lab-results')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`API listening on http://localhost:${port}`);
  console.log(`Swagger UI on http://localhost:${port}/docs`);
}
bootstrap();
