import { HttpException, HttpStatus } from '@nestjs/common';

export class PermissionException extends HttpException {
  constructor(message: string, status: HttpStatus) {
    super(message, status);
  }
}

export class PermissionNotFoundException extends HttpException {
  constructor(permissionId: string) {
    super(`Permission with ID ${permissionId} not found`, HttpStatus.NOT_FOUND);
  }
}

export class PermissionAlreadyExistsException extends HttpException {
  constructor(permissionName: string) {
    super(
      `Permission with name ${permissionName} already exists`,
      HttpStatus.CONFLICT,
    );
  }
}
