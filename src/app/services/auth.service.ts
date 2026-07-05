import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Minimal client-side session gate. There is no auth backend wired yet, so
 * this only tracks whether the user has "signed in" during this browser
 * session — enough to keep the transfer form from being reached by typing
 * the URL directly. Replace `login()` with a real credential check once the
 * backend endpoint exists.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly STORAGE_KEY = 'amb247_session';

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  private get storage(): Storage | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }
    try {
      return window.sessionStorage;
    } catch {
      return null;
    }
  }

  isLoggedIn(): boolean {
    return this.storage?.getItem(this.STORAGE_KEY) === '1';
  }

  login(): void {
    this.storage?.setItem(this.STORAGE_KEY, '1');
  }

  logout(): void {
    this.storage?.removeItem(this.STORAGE_KEY);
  }
}
