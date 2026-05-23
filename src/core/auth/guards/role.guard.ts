import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthFacade } from '@core/auth/auth.facade';

export const roleGuard = (roles: string[]): CanActivateFn => {
  return () => {
    const auth = inject(AuthFacade);
    const router = inject(Router);
    const hasRole = roles.some((role) => auth.hasRole(role));

    return hasRole ? true : router.createUrlTree(['/app/forbidden']);
  };
};
