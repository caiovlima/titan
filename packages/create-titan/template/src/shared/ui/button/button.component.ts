import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { cn } from '@shared/utils/cn';
import { buttonVariants, type ButtonVariants } from './button.variants';

@Component({
  selector: 'app-button',
  standalone: true,
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  readonly variant = input<ButtonVariants['variant']>('default');
  readonly size = input<ButtonVariants['size']>('default');
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly disabled = input(false);
  readonly loading = input(false);

  readonly class = input('');

  readonly pressed = output<void>();

  classes(): string {
    return cn(
      buttonVariants({
        variant: this.variant(),
        size: this.size(),
      }),
      this.class(),
    );
  }

  onPress(event: MouseEvent): void {
    if (this.disabled() || this.loading()) {
      event.preventDefault();
      return;
    }

    if (this.type() === 'submit') {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    this.pressed.emit();
  }
}
