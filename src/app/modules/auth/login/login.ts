import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../services/auth.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  form: FormGroup;
  // Signals so the view re-renders reliably (the app runs zoneless).
  hidePassword = signal(true);
  loginError = signal<string | null>(null);

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly auth: AuthService
  ) {
    this.form = this.fb.group({
      usuario: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  togglePassword(): void {
    this.hidePassword.update((hidden) => !hidden);
  }

  onSubmit(): void {
    this.loginError.set(null);

    // Empty/incomplete fields → show the required-field errors, not "wrong credentials".
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const usuario = (this.form.value.usuario ?? '').trim();
    const password = this.form.value.password ?? '';

    if (usuario !== environment.loginUsuario || password !== environment.loginPassword) {
      this.loginError.set('Usuario o contraseña incorrectos.');
      return;
    }

    this.auth.login();
    this.router.navigate(['/registro']);
  }
}
