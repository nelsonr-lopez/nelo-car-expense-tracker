import { HttpException, HttpStatus } from '@nestjs/common';

export class BaseHttpException extends HttpException {
  constructor(
    message: string,
    status: HttpStatus,
    public readonly code: string,
    public readonly details?: any,
  ) {
    super(
      {
        message,
        code,
        details,
        status,
      },
      status,
    );
  }
}

export class BadRequestException extends BaseHttpException {
  constructor(message: string, code = 'BAD_REQUEST', details?: any) {
    super(message, HttpStatus.BAD_REQUEST, code, details);
  }
}

export class NotFoundException extends BaseHttpException {
  constructor(message: string, code = 'NOT_FOUND', details?: any) {
    super(message, HttpStatus.NOT_FOUND, code, details);
  }
}

export class UnauthorizedException extends BaseHttpException {
  constructor(message: string, code = 'UNAUTHORIZED', details?: any) {
    super(message, HttpStatus.UNAUTHORIZED, code, details);
  }
}

export class ForbiddenException extends BaseHttpException {
  constructor(message: string, code = 'FORBIDDEN', details?: any) {
    super(message, HttpStatus.FORBIDDEN, code, details);
  }
}

export class InternalServerErrorException extends BaseHttpException {
  constructor(message: string, code = 'INTERNAL_SERVER_ERROR', details?: any) {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR, code, details);
  }
}
