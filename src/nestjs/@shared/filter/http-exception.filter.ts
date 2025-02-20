import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';

import { Response } from 'express';
import { HttpResponse } from '../http-response';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(httpException: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp() as HttpArgumentsHost;
    const response = ctx.getResponse<Response>();
    // const request = ctx.getRequest<Request>();

    const exception =
      httpException instanceof HttpException
        ? httpException.getResponse()
        : httpException;

    const httpResponse = HttpResponse.failure(
      exception['statusCode'],
      exception['message'],
      exception['error'],
    );

    response.status(422).json(httpResponse);
  }
}
