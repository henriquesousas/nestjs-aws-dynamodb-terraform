import { Response } from 'express';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { EntityValidationException } from '../../../core/@shared/entity-validation.exception';
import { HttpResponse } from '../http-response';

@Catch(EntityValidationException)
export class EntityValidationExceptionFilter implements ExceptionFilter {
  catch(exception: EntityValidationException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response: Response = ctx.getResponse();

    const error = exception.error.flatMap((item) => {
      if (typeof item === 'string') {
        return item;
      }
      if (typeof item === 'object') {
        return Object.values(item).flat();
      }
    });

    response
      .status(422)
      .json(HttpResponse.failure(422, error, 'Unprocessable Entity'));
  }
}
