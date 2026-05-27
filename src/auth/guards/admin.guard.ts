import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from "@nestjs/common";

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    if (!user?.isAdmin) throw new ForbiddenException('Admins only');
    return true;
  }
}
