import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import type { BackendAdapter } from '@infrastructure/adapters/types/backend-adapter.interface';
import type { AuthUser } from '@core/auth/types/auth-user.interface';

@Injectable()
export class SupabaseAdapter implements BackendAdapter {
  readonly name = 'supabase';

  signIn(email: string, _password: string): Observable<AuthUser> {
    if (!email) {
      return throwError(() => new Error('Supabase adapter not configured'));
    }
    return of({
      id: 'supabase-user',
      email,
      name: email.split('@')[0],
      roles: ['user'],
      permissions: ['app:read'],
    });
  }

  signOut(): Observable<void> {
    return of(undefined);
  }
}
