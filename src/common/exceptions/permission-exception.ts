import { HttpException, HttpStatus } from '@nestjs/common';

export class PermissionException extends HttpException {
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
