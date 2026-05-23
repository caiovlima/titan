import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import {
  EnvironmentProviders,
  ErrorHandler,
  Provider,
  provideAppInitializer,
  inject,
} from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withPreloading,
  PreloadAllModules,
} from '@angular/router';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';

import { routes } from '@app/app.routes';
import { authInterceptor } from '@core/auth/interceptors/auth.interceptor';
import { AuthFacade } from '@core/auth/auth.facade';
import { GlobalErrorHandler } from '@core/errors/global-error.handler';
import { ThemeService } from '@shared/theme/theme.service';
import { BACKEND_ADAPTER } from '@infrastructure/adapters/backend.token';
import { SupabaseAdapter } from '@infrastructure/adapters/supabase/supabase.adapter';

export function provideTitanCore(): (Provider | EnvironmentProviders)[] {
  return [
    provideRouter(
      routes,
      withComponentInputBinding(),
      withPreloading(PreloadAllModules),
    ),

    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor]),
    ),

    provideClientHydration(withEventReplay()),

    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler,
    },

    {
      provide: BACKEND_ADAPTER,
      useClass: SupabaseAdapter,
    },

    provideAppInitializer(() => {
      inject(AuthFacade).init();
      inject(ThemeService).init();
    }),
  ];
}