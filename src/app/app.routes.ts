import { Routes } from '@angular/router';
import { Login } from './modules/auth/login/login';
import { Registro } from './modules/traslado/pages/registro/registro';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'registro', component: Registro, canActivate: [authGuard] },
  { path: '**', redirectTo: 'login' }
];
