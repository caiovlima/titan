import { http, HttpResponse, delay } from 'msw';
import type { LoginResponse } from '@core/auth/types/login-response.interface';

const mockUser = {
  id: '1',
  email: 'admin@titan.dev',
  name: 'Titan Admin',
  roles: ['admin'],
  permissions: ['app:read', 'admin:write'],
};

export const handlers = [
  http.post('*/api/auth/login', async ({ request }) => {
    await delay(400);
    const body = (await request.json()) as { email: string; password: string };

    if (body.password !== 'password123') {
      return HttpResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const response: LoginResponse = {
      user: { ...mockUser, email: body.email },
      tokens: {
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        expiresAt: Date.now() + 3_600_000,
      },
    };

    return HttpResponse.json(response);
  }),

  http.post('*/api/auth/refresh', async () => {
    await delay(200);
    return HttpResponse.json({
      accessToken: 'mock-access-token-refreshed',
      refreshToken: 'mock-refresh-token',
      expiresAt: Date.now() + 3_600_000,
    });
  }),

  http.post('*/api/auth/logout', async () => {
    await delay(100);
    return HttpResponse.json(null);
  }),
];
