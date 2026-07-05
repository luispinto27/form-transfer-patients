import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    // Protected: render in the browser so the auth guard runs before any form
    // markup exists. Prerendering would ship the full form as a static file,
    // reachable by URL regardless of sign-in.
    path: 'registro',
    renderMode: RenderMode.Client
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
