import { InjectionToken } from '@angular/core';
import type { BackendAdapter } from '@infrastructure/adapters/types/backend-adapter.interface';

export const BACKEND_ADAPTER = new InjectionToken<BackendAdapter>('BACKEND_ADAPTER');
