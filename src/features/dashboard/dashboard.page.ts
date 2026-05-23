import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthFacade } from '@core/auth/auth.facade';
import { ThemeService } from '@shared/theme/theme.service';
import { ButtonComponent } from '@shared/ui/button/button.component';
import { PermissionDirective } from '@shared/rbac/directives/permission.directive';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [ButtonComponent, PermissionDirective],
  templateUrl: './dashboard.page.html',
  styleUrl: './dashboard.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPage {
  protected readonly auth = inject(AuthFacade);
  protected readonly theme = inject(ThemeService);

  logout(): void {
    this.auth.logout().subscribe();
  }
}
