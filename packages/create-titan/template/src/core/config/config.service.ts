import { Injectable, inject } from '@angular/core';
import { ENVIRONMENT } from './environment.token';
import type { Environment } from '@environments/types/environment.interface';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private readonly env = inject(ENVIRONMENT);

  get environment(): Environment {
    return this.env;
  }

  get apiUrl(): string {
    return this.env.apiUrl;
  }

  get isProduction(): boolean {
    return this.env.production;
  }

  get mockApi(): boolean {
    return this.env.mockApi;
  }

  isFeatureEnabled(flag: string): boolean {
    return Boolean(this.env.featureFlags[flag]);
  }

  get isDemoAuthEnabled(): boolean {
    return this.mockApi || this.isFeatureEnabled('demoAuth');
  }
}
