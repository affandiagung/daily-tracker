import { CanActivate, ExecutionContext, Type, mixin } from '@nestjs/common';
import { Request } from 'express';

export const RoleGuard = (...roles: string[]): Type<CanActivate> => {
  class RoleGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      if (!roles || roles.length === 0) return true;

      const request = context.switchToHttp().getRequest<Request>();
      const user = (request as any).user;

      return roles.includes(user.role);
    }
  }

  return mixin(RoleGuardMixin);
};
