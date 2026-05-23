import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { environment } from '@environments/environment';

async function prepareMocks(): Promise<void> {
  if (!environment.mockApi) return;
  const { worker } = await import('./testing/mocks/browser');
  await worker.start({ onUnhandledRequest: 'bypass' });
}

prepareMocks()
  .then(() => bootstrapApplication(App, appConfig))
  .catch((err) => console.error(err));
