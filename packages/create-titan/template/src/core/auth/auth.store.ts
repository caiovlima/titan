import { Injectable, computed, signal } from '@angular/core';
import type { AuthTokens } from '@core/auth/types/auth-tokens.interface';
import type { AuthUser } from '@core/auth/types/auth-user.interface';

interface AuthState {
  user: AuthUser | null;
  tokens: AuthTokens | null;
  loading: boolean;
  error: string | null;
}

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly _state = signal<AuthState>({
    user: null,
    tokens: null,
    loading: false,
    error: null,
  });

  readonly user = computed(() => this._state().user);
  readonly tokens = computed(() => this._state().tokens);
  readonly loading = computed(() => this._state().loading);
  readonly error = computed(() => this._state().error);
  readonly isAuthenticated = computed(() => Boolean(this._state().tokens?.accessToken));
  readonly roles = computed(() => this._state().user?.roles ?? []);
  readonly permissions = computed(() => this._state().user?.permissions ?? []);

  setLoading(loading: boolean): void {
    this._state.update((s) => ({ ...s, loading }));
  }

  setError(error: string | null): void {
    this._state.update((s) => ({ ...s, error, loading: false }));
  }

  setSession(user: AuthUser, tokens: AuthTokens): void {
    this._state.set({ user, tokens, loading: false, error: null });
  }

  updateTokens(tokens: AuthTokens): void {
    this._state.update((s) => ({ ...s, tokens }));
  }

  clear(): void {
    this._state.set({ user: null, tokens: null, loading: false, error: null });
  }
}
