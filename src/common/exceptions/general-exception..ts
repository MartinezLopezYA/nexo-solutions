import { HttpException, HttpStatus } from '@nestjs/common';

export class NotFoundException extends HttpException {
  constructor(message: string, status: HttpStatus, errorCode: string) {
    super(
      {
        statusCode: status,
        errorCode,
        message,
      },
      status,
    );
  }
}

export class AlreadyExistsException extends HttpException {
  constructor(message: string, status: HttpStatus, errorCode: string) {
    super(
      {
        statusCode: status,
        errorCode,
        message,
      },
      status,
    );
  }
}
