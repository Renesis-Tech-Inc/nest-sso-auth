import { readFileSync } from 'fs';
import * as path from 'path';
import { env } from 'process';

import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { parse } from 'dotenv';
import * as expressBasicAuth from 'express-basic-auth';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { UnprocessableEntityException, ValidationPipe } from '@nestjs/common';
import { ValidationFormatter } from './transformers/validation.transtormer';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';

// Load environment variables from .env file
const envConfig = parse(readFileSync(path.join(__dirname, '..', '.env')));

// Set environment variables
for (const k in envConfig) {
  process.env[k] = envConfig[k];
}

// Bootstrap function to initialize the NestJS application
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Basic authentication for Swagger documentation
  app.use(
    '/docs',
    expressBasicAuth({
      users: {
        [process.env.SWAGGER_USERNAME]: process.env.SWAGGER_PASSWORD,
      },
      challenge: true,
      unauthorizedResponse: 'Unauthorized',
    }),
  );

  // Global prefix for API endpoints
  app.setGlobalPrefix('api/v1');

  // Increase the maximum payload size for JSON requests
  app.use(express.json({ limit: '10mb' }));

  // Global logging interceptor
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Global validation pipe with custom exception handling
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors: any) =>
        new UnprocessableEntityException(ValidationFormatter(errors)),
      transform: false, // Do not transform request body to DTO class automatically
    }),
  );

  // Global exception filter
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  // Swagger API documentation setup
  const config = new DocumentBuilder()
    .setTitle('SSO-AUTH')
    .setDescription('SSO AUTH Restful APIs')
    .setVersion('1.0')
    .addTag('SSO-AUTH')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/docs', app, document);

  // Enable CORS
  app.enableCors();

  // Start the NestJS application
  const PORT = env.PORT || 3011;
  await app.listen(PORT, async () => {
    console.log(`Server is running on port: ${PORT}`);
  });
}

// Start the application
bootstrap();
