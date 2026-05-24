import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideTitanCore } from '@core/providers/app.providers';

export const appConfig: ApplicationConfig = {
  providers: [provideBrowserGlobalErrorListeners(), ...provideTitanCore()],
};
