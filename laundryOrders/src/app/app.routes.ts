import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { authGuard } from './shared/guards/auth.guard';
import { adminGuard } from './shared/guards/admin.guard';
import { AdminComponent } from './admin/admin.component';
import { OrdersComponent } from './orders/orders.component';
import { userGuard } from './shared/guards/user.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [authGuard, adminGuard],
  },
  {
    path: 'orders',
    component: OrdersComponent,
    canActivate: [authGuard, userGuard],
  },
  {
    path: 'orders/new',
    loadComponent: () =>
      import('./orders/new-order/new-order.component').then((m) => m.NewOrderComponent),
    canActivate: [authGuard, userGuard],
  },
  { path: '', redirectTo: 'orders', pathMatch: 'full' },
];
