import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '@core/auth/auth.service';

let refreshInFlight = false;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.getAccessToken();

  const authedReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authedReq).pipe(
    catchError((error: unknown) => {
      if (!(error instanceof HttpErrorResponse) || error.status !== 401) {
        return throwError(() => error);
      }

      if (refreshInFlight) {
        return throwError(() => error);
      }

      refreshInFlight = true;
      return auth.refreshToken().pipe(
        switchMap((tokens) => {
          refreshInFlight = false;
          const retry = req.clone({
            setHeaders: { Authorization: `Bearer ${tokens.accessToken}` },
          });
          return next(retry);
        }),
        catchError((refreshError) => {
          refreshInFlight = false;
          auth.clearSession();
          return throwError(() => refreshError);
        }),
      );
    }),
  );
};
