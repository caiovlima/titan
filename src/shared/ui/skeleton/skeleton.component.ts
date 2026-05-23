import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { cn } from '@shared/utils/cn';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  templateUrl: './skeleton.component.html',
  styleUrl: './skeleton.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkeletonComponent {
  readonly className = input('', { alias: 'class' });

  classes(): string {
    return cn('animate-pulse rounded-md bg-muted', this.className());
  }
}
