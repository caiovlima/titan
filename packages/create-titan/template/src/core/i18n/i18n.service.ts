import { HttpClient } from '@angular/common/http';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import type { TranslationKey } from '@core/i18n/types/translation-key.type';

@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly dictionary = signal<Record<string, string>>({});

  readonly lang = signal<'en' | 'pt'>('en');

  async setLanguage(lang: 'en' | 'pt'): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;
    const data = await firstValueFrom(
      this.http.get<Record<string, string>>(`/assets/i18n/${lang}.json`),
    );
    this.dictionary.set(data);
    this.lang.set(lang);
    localStorage.setItem('titan-lang', lang);
  }

  t(key: TranslationKey): string {
    return this.dictionary()[key] ?? key;
  }
}
