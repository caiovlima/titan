export interface Environment {
  production: boolean;
  name: 'local' | 'dev' | 'hml' | 'prod';
  apiUrl: string;
  mockApi: boolean;
  auth: {
    tokenKey: string;
    refreshKey: string;
    refreshSkewMs: number;
  };
  observability: {
    sentryDsn: string;
    datadogClientToken: string;
    enableTracing: boolean;
  };
  backends: {
    supabaseUrl: string;
    supabaseAnonKey: string;
    firebase: {
      apiKey: string;
      authDomain: string;
      projectId: string;
    };
  };
  featureFlags: Record<string, boolean>;
}
