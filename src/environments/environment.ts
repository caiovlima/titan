import type { Environment } from './types/environment.interface';

export const environment: Environment = {
  production: false,
  name: 'local',
  apiUrl: '/api',
  mockApi: true,
  auth: {
    tokenKey: 'titan_access_token',
    refreshKey: 'titan_refresh_token',
    refreshSkewMs: 60_000,
  },
  observability: {
    sentryDsn: '',
    datadogClientToken: '',
    enableTracing: false,
  },
  backends: {
    supabaseUrl: '',
    supabaseAnonKey: '',
    firebase: { apiKey: '', authDomain: '', projectId: '' },
  },
  featureFlags: {
    demoAuth: true,
    socialLogin: true,
    commandPalette: true,
  },
};
