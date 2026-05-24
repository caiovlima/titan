import type { Environment } from './types/environment.interface';

export const environment: Environment = {
  production: true,
  name: 'prod',
  apiUrl: 'https://api.example.com',
  mockApi: false,
  auth: {
    tokenKey: 'titan_access_token',
    refreshKey: 'titan_refresh_token',
    refreshSkewMs: 60_000,
  },
  observability: {
    sentryDsn: '',
    datadogClientToken: '',
    enableTracing: true,
  },
  backends: {
    supabaseUrl: '',
    supabaseAnonKey: '',
    firebase: { apiKey: '', authDomain: '', projectId: '' },
  },
  featureFlags: { socialLogin: true, commandPalette: false },
};
