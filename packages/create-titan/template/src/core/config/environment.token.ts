import { InjectionToken } from '@angular/core';
import { environment } from '@environments/environment';
import type { Environment } from '@environments/types/environment.interface';

export const ENVIRONMENT = new InjectionToken<Environment>('ENVIRONMENT', {
  providedIn: 'root',
  factory: () => environment,
});
