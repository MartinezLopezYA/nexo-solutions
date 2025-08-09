import { HttpException, HttpStatus } from '@nestjs/common';

export class RoleException extends HttpException {
  constructor(message: string, status: HttpStatus) {
    super(message, status);
  }
}

export class RoleNotFoundException extends HttpException {
  constructor(roleId: string) {
    super(`Role with ID ${roleId} not found`, HttpStatus.NOT_FOUND);
  }
}

export class RoleAlreadyExistsException extends HttpException {
  constructor(roleName: string) {
    super(`Role with name ${roleName} already exists`, HttpStatus.CONFLICT);
  }
}
