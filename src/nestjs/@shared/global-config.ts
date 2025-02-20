import { INestApplication, ValidationPipe } from '@nestjs/common';
import { BadRequestExceptionFilter } from './filter/bad-request-exception.filter';
import { NotFoundExceptionFilter } from './filter/not-found-exception.filter';
import { EntityValidationExceptionFilter } from './filter/entity-validation-exception.filter';
import { HttpExceptionFilter } from './filter/http-exception.filter';

export function applyGlobalConfig(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: 422,
      transform: true,
      whitelist: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.useGlobalFilters(
    new BadRequestExceptionFilter(),
    new NotFoundExceptionFilter(),
    new EntityValidationExceptionFilter(),
    new HttpExceptionFilter(),
  );
}
