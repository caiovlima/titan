import { Injectable, Signal, computed, effect, signal } from '@angular/core';

export interface EntityState<T> {
  items: T[];
  selectedId: string | null;
  loading: boolean;
  error: string | null;
}

@Injectable()
export class SignalStateService<T extends { id: string }> {
  private readonly _state = signal<EntityState<T>>({
    items: [],
    selectedId: null,
    loading: false,
    error: null,
  });

  readonly state: Signal<EntityState<T>> = this._state.asReadonly();
  readonly items = computed(() => this._state().items);
  readonly loading = computed(() => this._state().loading);
  readonly error = computed(() => this._state().error);
  readonly selected = computed(() => {
    const { items, selectedId } = this._state();
    return items.find((item) => item.id === selectedId) ?? null;
  });

  constructor() {
    effect(() => {
      if (this._state().error) {
        // Hook for global error reporting
      }
    });
  }

  setLoading(loading: boolean): void {
    this._state.update((s) => ({ ...s, loading }));
  }

  setError(error: string | null): void {
    this._state.update((s) => ({ ...s, error, loading: false }));
  }

  setItems(items: T[]): void {
    this._state.update((s) => ({ ...s, items, loading: false, error: null }));
  }

  upsert(item: T): void {
    this._state.update((s) => {
      const index = s.items.findIndex((i) => i.id === item.id);
      const items =
        index === -1
          ? [...s.items, item]
          : s.items.map((i, idx) => (idx === index ? item : i));
      return { ...s, items };
    });
  }

  remove(id: string): void {
    this._state.update((s) => ({
      ...s,
      items: s.items.filter((i) => i.id !== id),
      selectedId: s.selectedId === id ? null : s.selectedId,
    }));
  }

  select(id: string | null): void {
    this._state.update((s) => ({ ...s, selectedId: id }));
  }

  reset(): void {
    this._state.set({ items: [], selectedId: null, loading: false, error: null });
  }
}
