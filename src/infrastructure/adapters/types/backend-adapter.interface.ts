import { Observable } from 'rxjs';
import type { AuthUser } from '@core/auth/types/auth-user.interface';

export interface BackendAdapter {
  readonly name: string;
  signIn(email: string, password: string): Observable<AuthUser>;
  signOut(): Observable<void>;
}
