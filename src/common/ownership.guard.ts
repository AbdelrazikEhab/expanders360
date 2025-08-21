import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';

/**
 * Simple ownership guard: ensures that a client user can only access resources
 * under their own clientId (for routes that pass :clientId or body.clientId).
 * Admin always allowed.
 */
@Injectable()
export class OwnershipGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest();
    const user = req.user;
    if (!user) return false;
    if (user.role === 'admin') return true;

    // Allow if client route param or body matches the user's clientId
    const clientIdFromParams = req.params.clientId ? +req.params.clientId : undefined;
    const clientIdFromBody = req.body?.clientId ? +req.body.clientId : undefined;

    const allowed =
      (typeof clientIdFromParams === 'number' && clientIdFromParams === user.clientId) || 
      (typeof clientIdFromBody === 'number' && clientIdFromBody === user.clientId);

    if (!allowed) throw new ForbiddenException('Not your resource');
    return true;
  }
}
