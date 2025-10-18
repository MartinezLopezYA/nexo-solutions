import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { UnauthorizedException } from '../exceptions/general-exception.';
import { HttpStatus } from '@nestjs/common';

@Injectable()
export class PermissionsInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const reqPermission = this.reflector.get<string[]>(
      PERMISSIONS_KEY,
      context.getHandler()
    ) ?? [];

    if (reqPermission.length === 0) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('Unauthorized', HttpStatus.UNAUTHORIZED, 'UNAUTHORIZED');
    }

    if (user.roles.includes('SUPERADMIN') || user.roles.includes('ADMIN')) {
      return next.handle();
    }

    const userPermissions: string[] = user.permissions ?? [];

    const hasAll = reqPermission.every((permission) => userPermissions.includes(permission));

    if (!hasAll) {
      throw new UnauthorizedException('Forbidden', HttpStatus.FORBIDDEN, 'DO_NOT_HAVE_PERMISSIONS');
    }

    return next.handle();
  }
}
