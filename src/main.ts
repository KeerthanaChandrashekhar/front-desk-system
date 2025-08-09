import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'; // import validation pipe

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  // Enable CORS for frontend requests
  app.enableCors({
    origin: 'http://localhost:3000',
  });

  // Enable global DTO validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove properties that are not in DTO
      forbidNonWhitelisted: true, // throw error if unknown property is sent
      transform: true, // automatically transform payloads to DTO instances
    }),
  );

  await app.listen(3001);
}
bootstrap();

