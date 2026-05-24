import type { AuthTokens } from '@core/auth/types/auth-tokens.interface';
import type { AuthUser } from '@core/auth/types/auth-user.interface';
import type { LoginResponse } from '@core/auth/types/login-response.interface';

export const DEMO_EMAIL = 'admin@titan.dev';
export const DEMO_PASSWORD = 'password123';

export const DEMO_USER: AuthUser = {
  id: 'demo-1',
  email: DEMO_EMAIL,
  name: 'Titan Admin',
  roles: ['admin'],
  permissions: ['app:read', 'admin:write'],
};

export function createDemoLoginResponse(email = DEMO_EMAIL): LoginResponse {
  const tokens: AuthTokens = {
    accessToken: 'demo-access-token',
    refreshToken: 'demo-refresh-token',
    expiresAt: Date.now() + 24 * 60 * 60 * 1000,
  };

  return {
    user: { ...DEMO_USER, email },
    tokens,
  };
}
