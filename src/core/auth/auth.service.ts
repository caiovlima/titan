import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, catchError, delay, of, tap } from 'rxjs';
import { BaseHttpService } from '@core/http/base-http.service';
import { ConfigService } from '@core/config/config.service';
import { AuthStore } from '@core/auth/auth.store';
import { SocialProvider } from '@core/auth/enums/social-provider.enum';
import {
  DEMO_PASSWORD,
  createDemoLoginResponse,
} from '@core/auth/constants/demo-auth.constants';
import type { LoginRequest } from '@core/auth/types/login-request.interface';
import type { LoginResponse } from '@core/auth/types/login-response.interface';
import type { AuthTokens } from '@core/auth/types/auth-tokens.interface';
import type { AuthUser } from '@core/auth/types/auth-user.interface';

const USER_STORAGE_KEY = 'titan_user';

@Injectable({ providedIn: 'root' })
export class AuthService extends BaseHttpService {
  private readonly store = inject(AuthStore);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  login(credentials: LoginRequest): Observable<LoginResponse> {
    this.store.setLoading(true);

    if (this.config.isDemoAuthEnabled) {
      return this.loginWithDemoBypass(credentials);
    }

    return this.post<LoginResponse, LoginRequest>('/auth/login', credentials).pipe(
      tap((response) => this.applySession(response)),
    );
  }

  /** One-click demo login — ignores form values, no HTTP. */
  loginAsDemo(): Observable<LoginResponse> {
    this.store.setLoading(true);
    const response = createDemoLoginResponse();
    return of(response).pipe(
      delay(100),
      tap((res) => this.applySession(res)),
    );
  }

  /** Demo bypass — no HTTP, works without MSW or backend. */
  loginWithDemoBypass(credentials: LoginRequest): Observable<LoginResponse> {
    if (credentials.password !== DEMO_PASSWORD) {
      return new Observable((subscriber) => {
        subscriber.error(new Error(`Use demo password: ${DEMO_PASSWORD}`));
      });
    }

    const response = createDemoLoginResponse(credentials.email);

    return of(response).pipe(
      delay(150),
      tap((res) => this.applySession(res)),
    );
  }

  refreshToken(): Observable<AuthTokens> {
    if (this.config.isDemoAuthEnabled) {
      const tokens = createDemoLoginResponse().tokens;
      return of(tokens).pipe(tap((t) => this.persistTokens(t)));
    }

    const refreshToken = this.getRefreshToken();
    return this.post<AuthTokens>('/auth/refresh', { refreshToken }).pipe(
      tap((tokens) => {
        this.persistTokens(tokens);
        this.store.updateTokens(tokens);
      }),
    );
  }

  /**
   * Always clears the local session first (demo, local, prod).
   * Server revoke is best-effort and never blocks logout.
   */
  logout(): Observable<void> {
    this.clearSession();

    if (!this.isBrowser) {
      return of(undefined);
    }

    return this.post<void>('/auth/logout', {}).pipe(
      catchError(() => of(undefined)),
    );
  }

  socialLogin(provider: SocialProvider): void {
    if (this.config.isDemoAuthEnabled) {
      this.applySession(createDemoLoginResponse());
      return;
    }
    if (!this.isBrowser) return;
    window.location.href = `${this.config.apiUrl}/auth/oauth/${provider}`;
  }

  restoreSession(): void {
    if (!this.isBrowser) return;

    const rawTokens = localStorage.getItem(this.config.environment.auth.tokenKey);
    const rawUser = localStorage.getItem(USER_STORAGE_KEY);
    if (!rawTokens || !rawUser) return;

    try {
      const tokens = JSON.parse(rawTokens) as AuthTokens;
      const user = JSON.parse(rawUser) as AuthUser;
      if (tokens.expiresAt > Date.now()) {
        this.store.setSession(user, tokens);
      } else {
        this.clearSession();
      }
    } catch {
      this.clearSession();
    }
  }

  getAccessToken(): string | null {
    return this.store.tokens()?.accessToken ?? null;
  }

  getRefreshToken(): string | null {
    if (this.isBrowser) {
      return localStorage.getItem(this.config.environment.auth.refreshKey);
    }
    return this.store.tokens()?.refreshToken ?? null;
  }

  clearSession(): void {
    if (this.isBrowser) {
      localStorage.removeItem(this.config.environment.auth.tokenKey);
      localStorage.removeItem(this.config.environment.auth.refreshKey);
      localStorage.removeItem(USER_STORAGE_KEY);
    }
    this.store.clear();
  }

  private applySession(response: LoginResponse): void {
    this.persistSession(response);
    this.store.setSession(response.user, response.tokens);
  }

  private persistSession(response: LoginResponse): void {
    if (!this.isBrowser) return;
    localStorage.setItem(
      this.config.environment.auth.tokenKey,
      JSON.stringify(response.tokens),
    );
    localStorage.setItem(
      this.config.environment.auth.refreshKey,
      response.tokens.refreshToken,
    );
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(response.user));
  }

  private persistTokens(tokens: AuthTokens): void {
    if (!this.isBrowser) return;
    localStorage.setItem(this.config.environment.auth.tokenKey, JSON.stringify(tokens));
    localStorage.setItem(this.config.environment.auth.refreshKey, tokens.refreshToken);
  }
}
