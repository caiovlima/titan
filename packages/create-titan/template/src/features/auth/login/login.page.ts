import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthFacade } from '@core/auth/auth.facade';
import { ConfigService } from '@core/config/config.service';
import { ButtonComponent } from '@shared/ui/button/button.component';
import { InputComponent } from '@shared/ui/input/input.component';
import { LoginFacade } from './login.facade';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent, InputComponent],
  providers: [LoginFacade],
  templateUrl: './login.page.html',
  styleUrl: './login.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage {
  protected readonly facade = inject(LoginFacade);
  protected readonly auth = inject(AuthFacade);
  protected readonly config = inject(ConfigService);
  private readonly router = inject(Router);

  protected onSocialLogin(action: () => void): void {
    action();
    if (this.config.isDemoAuthEnabled && this.auth.isAuthenticated()) {
      void this.router.navigate(['/app']);
    }
  }
}
