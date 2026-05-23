import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthFacade } from '@core/auth/auth.facade';

describe('authGuard', () => {
  it('redirects guests to login', () => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthFacade, useValue: { isAuthenticated: () => false } },
        { provide: Router, useValue: { createUrlTree: () => new UrlTree() } },
      ],
    });

    const result = TestBed.runInInjectionContext(() => authGuard({} as never, {} as never));
    expect(result).toBeTruthy();
  });
});
