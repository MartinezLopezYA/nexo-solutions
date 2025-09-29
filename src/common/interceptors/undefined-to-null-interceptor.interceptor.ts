import { CallHandler, ExecutionContext, Injectable, NestInterceptor, Body } from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class UndefinedToNullInterceptorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    if (request.body && typeof request.body === 'object') {
      request.body = this.cleanObject(request.body);
    }

    return next.handle().pipe(
      map((data) => {
        return data;
      })
    );
  }

  private cleanObject(obj: any): any {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      acc[key] =
        value === undefined || value === ''
          ? null
          : typeof value === 'object' && value !== null
          ? this.cleanObject(value)
          : value;
      return acc;
    }, {} as any);
  }

}
