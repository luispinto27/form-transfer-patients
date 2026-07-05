export const environment = {
  production: true,
  apiUrl: 'https://ambulancias247backend.fly.dev/api',
  // Same-origin path; Vercel rewrites it to the legacy PHP server (see vercel.json)
  // so the browser call is same-origin and avoids CORS — mirrors proxy.conf.json in dev.
  servicioApiUrl: '/index.php',
  servicioUsuario: 'historiaClinica',
  servicioPassword: '4536905-8a3deb23',
  loginUsuario: 'admin',
  loginPassword: '123456'
};
