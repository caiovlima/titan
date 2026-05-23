import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, TimeoutError, throwError, timer } from 'rxjs';
import { catchError, retry, timeout } from 'rxjs/operators';
import { ConfigService } from '@core/config/config.service';
import type { HttpRequestOptions } from '@core/http/types/http-options.interface';

@Injectable({ providedIn: 'root' })
export class BaseHttpService {
  protected readonly http = inject(HttpClient);
  protected readonly config = inject(ConfigService);

  protected get baseUrl(): string {
    return this.config.apiUrl;
  }

  get<T>(path: string, options?: HttpRequestOptions): Observable<T> {
    return this.request('GET', path, undefined, options);
  }

  post<T, B = unknown>(path: string, body: B, options?: HttpRequestOptions): Observable<T> {
    return this.request('POST', path, body, options);
  }

  put<T, B = unknown>(path: string, body: B, options?: HttpRequestOptions): Observable<T> {
    return this.request('PUT', path, body, options);
  }

  patch<T, B = unknown>(path: string, body: B, options?: HttpRequestOptions): Observable<T> {
    return this.request('PATCH', path, body, options);
  }

  delete<T>(path: string, options?: HttpRequestOptions): Observable<T> {
    return this.request('DELETE', path, undefined, options);
  }

  private request<T>(
    method: string,
    path: string,
    body?: unknown,
    options?: HttpRequestOptions,
  ): Observable<T> {
    const url = `${this.baseUrl}${path}`;
    const timeoutMs = options?.timeoutMs ?? 30_000;
    const retryCount = options?.retryCount ?? 0;

    return this.http.request<T>(method, url, { body, ...options }).pipe(
      timeout(timeoutMs),
      retry({
        count: retryCount,
        delay: (error, retryIndex) => {
          if (error instanceof HttpErrorResponse && error.status >= 500) {
            return timer(Math.min(1000 * 2 ** retryIndex, 8000));
          }
          throw error;
        },
      }),
      catchError((error: unknown) => {
        if (error instanceof TimeoutError) {
          return throwError(() => new Error(`Request timeout: ${method} ${path}`));
        }
        return throwError(() => error);
      }),
    );
  }
}
