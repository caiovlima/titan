import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, finalize, of, tap } from 'rxjs';
import { AuthService } from '@core/auth/auth.service';
import { AuthStore } from '@core/auth/auth.store';
import { SocialProvider } from '@core/auth/enums/social-provider.enum';
import type { LoginRequest } from '@core/auth/types/login-request.interface';

@Injectable({ providedIn: 'root' })
export class AuthFacade {
  private readonly auth = inject(AuthService);
  private readonly store = inject(AuthStore);
  private readonly router = inject(Router);

  readonly user = this.store.user;
  readonly loading = this.store.loading;
  readonly error = this.store.error;
  readonly isAuthenticated = this.store.isAuthenticated;
  readonly roles = this.store.roles;
  readonly permissions = this.store.permissions;

  init(): void {
    this.auth.restoreSession();
  }

  loginAsDemo() {
    this.store.setError(null);
    return this.auth.loginAsDemo().pipe(
      catchError((err: unknown) => {
        this.store.setError(this.resolveErrorMessage(err));
        return of(null);
      }),
      finalize(() => this.store.setLoading(false)),
    );
  }

  login(credentials: LoginRequest) {
    this.store.setError(null);
    return this.auth.login(credentials).pipe(
      catchError((err: unknown) => {
        const message = this.resolveErrorMessage(err);
        this.store.setError(message);
        return of(null);
      }),
      finalize(() => this.store.setLoading(false)),
    );
  }

  logout() {
    return this.auth.logout().pipe(
      tap(() => this.redirectToLogin()),
      catchError(() => {
        this.auth.clearSession();
        this.redirectToLogin();
        return of(undefined);
      }),
      finalize(() => {
        this.auth.clearSession();
        this.redirectToLogin();
      }),
    );
  }

  loginWithGoogle(): void {
    this.auth.socialLogin(SocialProvider.Google);
  }

  loginWithGitHub(): void {
    this.auth.socialLogin(SocialProvider.GitHub);
  }

  loginWithMicrosoft(): void {
    this.auth.socialLogin(SocialProvider.Microsoft);
  }

  hasPermission(permission: string): boolean {
    return this.store.permissions().includes(permission);
  }

  hasRole(role: string): boolean {
    return this.store.roles().includes(role);
  }

  private redirectToLogin(): void {
    void this.router.navigate(['/auth/login'], { replaceUrl: true });
  }

  private resolveErrorMessage(err: unknown): string {
    if (err instanceof HttpErrorResponse) {
      const body = err.error as { message?: string } | null;
      return body?.message ?? err.message ?? 'Login failed';
    }
    if (err instanceof Error) {
      return err.message;
    }
    return 'Login failed';
  }
}
