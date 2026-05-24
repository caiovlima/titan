import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  effect,
  inject,
} from '@angular/core';
import { AuthFacade } from '@core/auth/auth.facade';

@Directive({
  selector: '[appHasPermission]',
  standalone: true,
})
export class PermissionDirective {
  private readonly templateRef = inject(TemplateRef<unknown>);
  private readonly viewContainer = inject(ViewContainerRef);
  private readonly auth = inject(AuthFacade);

  private permissions: string[] = [];
  private hasView = false;

  @Input()
  set appHasPermission(value: string | string[]) {
    this.permissions = Array.isArray(value) ? value : [value];
    this.render();
  }

  constructor() {
    effect(() => {
      this.auth.permissions();
      this.render();
    });
  }

  private render(): void {
    const allowed = this.permissions.every((p) => this.auth.hasPermission(p));

    if (allowed && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!allowed && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}
