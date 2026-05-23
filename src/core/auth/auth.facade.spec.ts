import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthFacade } from './auth.facade';
import { AuthService } from './auth.service';

describe('AuthFacade', () => {
  it('redirects to login after logout in any environment', () => {
    const navigate = jest.fn().mockResolvedValue(true);
    const clearSession = jest.fn();
    const logout = jest.fn().mockReturnValue(of(undefined));

    TestBed.configureTestingModule({
      providers: [
        AuthFacade,
        { provide: AuthService, useValue: { logout, clearSession } },
        { provide: Router, useValue: { navigate } },
      ],
    });

    const facade = TestBed.inject(AuthFacade);
    facade.logout().subscribe();

    expect(logout).toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledWith(['/auth/login'], { replaceUrl: true });
  });

  it('still redirects when logout api fails', () => {
    const navigate = jest.fn().mockResolvedValue(true);
    const clearSession = jest.fn();

    TestBed.configureTestingModule({
      providers: [
        AuthFacade,
        {
          provide: AuthService,
          useValue: {
            logout: () => throwError(() => new Error('network')),
            clearSession,
          },
        },
        { provide: Router, useValue: { navigate } },
      ],
    });

    const facade = TestBed.inject(AuthFacade);
    facade.logout().subscribe();

    expect(clearSession).toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledWith(['/auth/login'], { replaceUrl: true });
  });
});
