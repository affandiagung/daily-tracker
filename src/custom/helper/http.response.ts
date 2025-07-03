import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

// Success response
export function successResponse<T>(
  data: T,
  message: string,
  statusCode: number,
) {
  return {
    message,
    error: false,
    statusCode,
    data,
  };
}

// Status Code 400
export function throwBadRequest(message: string): never {
  throw new HttpException(
    {
      message,
      error: 'Bad Request',
      statusCode: HttpStatus.BAD_REQUEST,
      data: null,
    },
    HttpStatus.BAD_REQUEST,
  );
}

// Status Code 401
export function throwUnauthorized(message: string): never {
  throw new HttpException(
    {
      message,
      error: 'Unauthorized',
      statusCode: HttpStatus.UNAUTHORIZED,
      data: null,
    },
    HttpStatus.UNAUTHORIZED,
  );
}

// Status Code 403
export function throwForbidden(message: string): never {
  throw new HttpException(
    {
      message,
      error: 'Forbidden',
      statusCode: HttpStatus.FORBIDDEN,
      data: null,
    },
    HttpStatus.FORBIDDEN,
  );
}

// Status Code 404
export function throwNotFound(message: string): never {
  throw new HttpException(
    {
      message,
      error: 'Not Found',
      statusCode: HttpStatus.NOT_FOUND,
      data: null,
    },
    HttpStatus.NOT_FOUND,
  );
}

// Status Code 409
export function throwConflict(message: string): never {
  throw new HttpException(
    {
      message,
      error: 'Conflict',
      statusCode: HttpStatus.CONFLICT,
      data: null,
    },
    HttpStatus.CONFLICT,
  );
}

// Status Code 422
export function throwUnprocessableEntity(message: string): never {
  throw new HttpException(
    {
      message,
      error: 'Unprocessable Entity',
      statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      data: null,
    },
    HttpStatus.UNPROCESSABLE_ENTITY,
  );
}

// Status Code 500
export function throwInternalServerError(
  message: string = 'Internal Server Error',
): never {
  throw new HttpException(
    {
      message,
      error: 'Internal Server Error',
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      data: null,
    },
    HttpStatus.INTERNAL_SERVER_ERROR,
  );
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const message =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : (exceptionResponse as any).message;

    const error =
      typeof exceptionResponse === 'string'
        ? 'Terjadi Kesalahan Silahkan coba beberapa saat lagi'
        : (exceptionResponse as any).error;

    response.status(status).json({
      statusCode: status,
      message,
      error,
      data: null,
    });
  }
}
