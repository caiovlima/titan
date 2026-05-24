import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthFacade } from '@core/auth/auth.facade';

export const permissionGuard = (permissions: string[]): CanActivateFn => {
  return () => {
    const auth = inject(AuthFacade);
    const router = inject(Router);
    const allowed = permissions.every((p) => auth.hasPermission(p));

    return allowed ? true : router.createUrlTree(['/app/forbidden']);
  };
};
