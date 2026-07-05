import { Routes } from '@angular/router';
import { Login } from './modules/auth/login/login';
import { Registro } from './modules/traslado/pages/registro/registro';
import { authGuard, loginGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login, canActivate: [loginGuard] },
  { path: 'registro', component: Registro, canActivate: [authGuard] },
  { path: '**', redirectTo: 'login' }
];
