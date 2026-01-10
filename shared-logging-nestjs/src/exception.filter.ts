import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LoggerService } from './logger.service';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : exception instanceof Error
        ? exception.message
        : 'Error desconocido';

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: typeof message === 'string' ? message : (message as any).message || message,
    };

    // Log del error
    if (exception instanceof Error) {
      this.logger.logError(exception, 'HTTP', {
        url: request.url,
        method: request.method,
        statusCode: status,
        body: request.body,
        query: request.query,
        params: request.params,
        headers: request.headers,
      });
    } else {
      this.logger.error(
        JSON.stringify(errorResponse),
        exception instanceof Error ? exception.stack : undefined,
        'HTTP',
      );
    }

    response.status(status).json(errorResponse);
  }
}





