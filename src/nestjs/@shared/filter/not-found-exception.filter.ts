import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import { UserNotFoundException } from '../../../core/user/domain/exception/user-not-found.exception';
import { HttpResponse } from '../http-response';

@Catch(UserNotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: NotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response: Response = ctx.getResponse();

    response
      .status(422)
      .json(HttpResponse.failure(404, [exception.message], 'NotFound'));
  }
}
