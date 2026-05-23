import { ErrorHandler, Injectable, inject } from '@angular/core';
import { LoggerService } from '@core/observability/logger.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private readonly logger = inject(LoggerService);

  handleError(error: unknown): void {
    const normalized =
      error instanceof Error ? error : new Error(typeof error === 'string' ? error : 'Unknown error');
    this.logger.error('Unhandled application error', normalized);
  }
}
