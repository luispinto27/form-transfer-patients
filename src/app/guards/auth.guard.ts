import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Blocks routes that require a signed-in session. Enforcement runs in the
 * browser (where the session flag lives); during SSR/prerender it lets the
 * request through so the page can still be server-rendered — the browser
 * re-checks on hydration and redirects if needed.
 */
export const authGuard: CanActivateFn = () => {
  const platformId = inject(PLATFORM_ID);
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.isLoggedIn() ? true : router.createUrlTree(['/login']);
};
