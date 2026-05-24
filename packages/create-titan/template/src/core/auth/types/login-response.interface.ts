import type { AuthTokens } from './auth-tokens.interface';
import type { AuthUser } from './auth-user.interface';

export interface LoginResponse {
  user: AuthUser;
  tokens: AuthTokens;
}
