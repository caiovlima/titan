import { TestBed } from '@angular/core/testing';
import { DashboardPage } from './dashboard.page';
import { AuthFacade } from '@core/auth/auth.facade';
import { ThemeService } from '@shared/theme/theme.service';

describe('DashboardPage', () => {
  it('should create', async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardPage],
      providers: [
        {
          provide: AuthFacade,
          useValue: {
            user: () => ({ name: 'Test' }),
            logout: () => ({ subscribe: () => undefined }),
          },
        },
        { provide: ThemeService, useValue: { toggle: () => undefined } },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(DashboardPage);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
