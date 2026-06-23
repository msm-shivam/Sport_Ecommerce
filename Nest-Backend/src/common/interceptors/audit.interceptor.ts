import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditLogService } from '../../modules/security-compliance/services/audit-log.service';
import { SKIP_AUDIT_LOG_KEY } from '../decorators/skip-audit-log.decorator';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(
    private readonly auditLogService: AuditLogService,
    private readonly reflector: Reflector,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const skipAudit =
      this.reflector.getAllAndOverride<boolean>(SKIP_AUDIT_LOG_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);
    if (skipAudit) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    const { method, ip, headers, params, route } = request;
    const user = request.user as { sub?: string } | undefined;

    if (!['POST', 'PATCH', 'PUT', 'DELETE'].includes(method)) {
      return next.handle();
    }

    const action = this.getAction(method);
    const entityType = this.getEntityType(route.path);

    return next.handle().pipe(
      tap((response: unknown) => {
        const res = response as Record<string, unknown> | undefined;
        const data = res?.data ?? res;
        const entityId =
          (params?.id as string) ??
          ((data as Record<string, unknown> | undefined)?.id as string) ??
          null;

        this.auditLogService
          .log({
            userId: user?.sub ?? null,
            action,
            entityType,
            entityId,
            ipAddress: ip,
            userAgent: headers['user-agent'],
            newValues:
              action === 'CREATE' || action === 'UPDATE' ? (data as Record<string, unknown>) : null,
          })
          .catch(() => {});
      }),
    );
  }

  private getAction(method: string): string {
    switch (method) {
      case 'POST':
        return 'CREATE';
      case 'PATCH':
      case 'PUT':
        return 'UPDATE';
      case 'DELETE':
        return 'DELETE';
      default:
        return method;
    }
  }

  private getEntityType(path: string): string {
    const segments = path.split('/').filter(Boolean);
    const skip = new Set([
      'admin',
      'api',
      'v1',
      'auth',
      ':id',
      ':entityType',
      ':entityId',
      ':tagId',
    ]);
    for (const seg of segments) {
      if (!skip.has(seg) && !seg.startsWith(':')) {
        return seg.endsWith('s') ? seg.slice(0, -1) : seg;
      }
    }
    return 'unknown';
  }
}
