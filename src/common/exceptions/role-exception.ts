import { HttpException, HttpStatus } from '@nestjs/common';

export class RoleException extends HttpException {
  constructor(message: string, status: HttpStatus) {
    super(message, status);
  }
}
