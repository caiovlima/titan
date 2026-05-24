import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import type { BackendAdapter } from '@infrastructure/adapters/types/backend-adapter.interface';
import type { AuthUser } from '@core/auth/types/auth-user.interface';

@Injectable()
export class FirebaseAdapter implements BackendAdapter {
  readonly name = 'firebase';

  
  signIn(email: string, _password: string): Observable<AuthUser> {
    if (!email) {
      return throwError(() => new Error('Firebase adapter not configured'));
    }
    return of({
      id: 'firebase-user',
      email,
      name: email.split('@')[0],
      password: _password, // Not used, just for demo purposes
      roles: ['user'],
      permissions: ['app:read'],
    });
  }

  signOut(): Observable<void> {
    return of(undefined);
  }
}
