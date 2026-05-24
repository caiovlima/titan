import { HttpContext, HttpHeaders, HttpParams } from '@angular/common/http';

export interface HttpRequestOptions {
  headers?: HttpHeaders | Record<string, string | string[]>;
  params?: HttpParams | Record<string, string | number | boolean | readonly (string | number | boolean)[]>;
  context?: HttpContext;
  withCredentials?: boolean;
  timeoutMs?: number;
  retryCount?: number;
}
