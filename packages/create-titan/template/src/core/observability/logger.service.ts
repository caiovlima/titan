import { Injectable, inject } from '@angular/core';
import { ConfigService } from '@core/config/config.service';

@Injectable({ providedIn: 'root' })
export class LoggerService {
  private readonly config = inject(ConfigService);

  info(message: string, context?: Record<string, unknown>): void {
    if (!this.config.isProduction) {
      console.info(`[Titan] ${message}`, context ?? '');
    }
  }

  warn(message: string, context?: Record<string, unknown>): void {
    console.warn(`[Titan] ${message}`, context ?? '');
  }

  error(message: string, error?: Error, context?: Record<string, unknown>): void {
    console.error(`[Titan] ${message}`, error, context ?? '');
    // Sentry/Datadog integration point
  }
}
