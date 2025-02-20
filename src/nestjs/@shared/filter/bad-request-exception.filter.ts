import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
} from '@nestjs/common';
import { Response } from 'express';
import { UserAlreadyExistException } from '../../../core/user/domain/exception/user-already-exist.exception';
import { HttpResponse } from '../http-response';

@Catch(UserAlreadyExistException)
export class BadRequestExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response: Response = ctx.getResponse();
    response
      .status(400)
      .json(HttpResponse.failure(400, [exception.message], 'BadRequest'));
  }
}
