import { Routes } from '@angular/router';
import { authGuard } from '@core/auth/guards/auth.guard';
import { guestGuard } from '@core/auth/guards/guest.guard';
import { permissionGuard } from '@core/auth/guards/permission.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'app' },
  {
    path: 'auth',
    canActivate: [guestGuard],
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('@features/auth/login/login.page').then((m) => m.LoginPage),
      },
    ],
  },
  {
    path: 'app',
    canActivate: [authGuard, permissionGuard(['app:read'])],
    loadComponent: () =>
      import('@features/shell/app-shell.component').then((m) => m.AppShellComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('@features/dashboard/dashboard.page').then((m) => m.DashboardPage),
      },
    ],
  },
  { path: '**', redirectTo: 'app' },
];
