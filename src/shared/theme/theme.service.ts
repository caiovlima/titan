import { DOCUMENT, Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type ThemeMode = 'light' | 'dark' | 'system';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly storageKey = 'titan-theme';

  readonly mode = signal<ThemeMode>('system');

  init(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const stored = localStorage.getItem(this.storageKey) as ThemeMode | null;
    if (stored) this.mode.set(stored);
    this.apply();
  }

  setMode(mode: ThemeMode): void {
    this.mode.set(mode);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.storageKey, mode);
    }
    this.apply();
  }

  toggle(): void {
    const resolved = this.resolveTheme();
    this.setMode(resolved === 'dark' ? 'light' : 'dark');
  }

  private apply(): void {
    const root = this.document.documentElement;
    const resolved = this.resolveTheme();
    root.classList.toggle('dark', resolved === 'dark');
  }

  private resolveTheme(): 'light' | 'dark' {
    const mode = this.mode();
    if (mode !== 'system') return mode;
    if (!isPlatformBrowser(this.platformId)) return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
}
