import { Injectable, inject, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthFacade } from '@core/auth/auth.facade';
import { DEMO_EMAIL, DEMO_PASSWORD } from '@core/auth/constants/demo-auth.constants';

@Injectable()
export class LoginFacade {
  private readonly auth = inject(AuthFacade);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  readonly submitting = signal(false);

  readonly form = this.fb.nonNullable.group({
    email: [DEMO_EMAIL, [Validators.required, Validators.email]],
    password: [DEMO_PASSWORD, [Validators.required, Validators.minLength(8)]],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.runLogin(() => this.auth.login(this.form.getRawValue()));
  }

  /** One-click demo — no form/API dependency. */
  enterWithDemoAccount(): void {
    this.runLogin(() => this.auth.loginAsDemo());
  }

  private runLogin(action: () => ReturnType<AuthFacade['login']>): void {
    this.submitting.set(true);
    action().subscribe((result) => {
      this.submitting.set(false);
      if (result ?? this.auth.isAuthenticated()) {
        void this.router.navigate(['/app']);
      }
    });
  }
}
