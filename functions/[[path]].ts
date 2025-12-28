/**
 * Cloudflare Pages Function
 * Middleware que maneja el enrutamiento y aplica CSP
 * Las rutas /api/* son manejadas por functions/api/[[path]].ts
 */

export interface PagesFunction {
  (context: any): Promise<Response>;
}

/**
 * Genera un nonce criptográficamente seguro para CSP
 */
function generateNonce(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array));
}

/**
 * Inyecta nonce en todos los scripts inline del HTML
 */
async function injectNonceIntoHTML(response: Response, nonce: string): Promise<Response> {
  const html = await response.text();
  
  let scriptCount = 0;
  
  // Agregar nonce a:
  // 1. Todos los tags <script> sin src (inline scripts)
  // 2. Todos los tags <script> con id (como los de Waku)
  let modifiedHtml = html.replace(
    /<script(?![^>]*\ssrc=)(?![^>]*\snonce=)([^>]*)>/gi,
    (match) => {
      scriptCount++;
      return match.replace('<script', `<script nonce="${nonce}"`);
    }
  );

  console.log(`Nonces inyectados en ${scriptCount} scripts inline`);

  return new Response(modifiedHtml, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });
}

/**
 * Aplica headers de seguridad y CSP a respuestas HTML
 */
async function applySecurityHeaders(response: Response): Promise<Response> {
  const contentType = response.headers.get('content-type') || '';

  // Solo aplicar CSP a respuestas HTML
  if (!contentType.includes('text/html')) {
    return response;
  }

  // Generar un nonce único para esta request
  const nonce = generateNonce();

  // Inyectar nonce en los scripts inline del HTML
  const modifiedResponse = await injectNonceIntoHTML(response, nonce);

  // CSP con nonce - sin unsafe-inline ni unsafe-eval
  const cspHeader = `default-src 'self'; script-src 'self' 'nonce-${nonce}' https://cdn.jsdelivr.net; style-src 'self' 'nonce-${nonce}' https://fonts.googleapis.com; img-src 'self' data: https: blob:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://api.github.com https://api.pokemontcg.io https://api.thecatapi.com https://jsonplaceholder.typicode.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self';`;

  // Eliminar cualquier CSP header existente antes de agregar el nuestro
  const headers = new Headers(modifiedResponse.headers);
  headers.delete('Content-Security-Policy');
  headers.delete('Content-Security-Policy-Report-Only');
  
  // Agregar nuestro CSP
  headers.set('Content-Security-Policy', cspHeader);
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('X-Frame-Options', 'DENY');
  headers.set('X-XSS-Protection', '1; mode=block');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  console.log('CSP aplicado:', cspHeader);

  return new Response(modifiedResponse.body, {
    status: modifiedResponse.status,
    statusText: modifiedResponse.statusText,
    headers: headers,
  });
}

export const onRequest: PagesFunction = async (context) => {
  const { request, next } = context;
  const url = new URL(request.url);
  const pathname = url.pathname;

  // No procesar rutas API (manejadas por functions/api/[[path]].ts)
  if (pathname.startsWith("/api/")) {
    return await next();
  }

  // No procesar archivos estáticos (imágenes, CSS, JS, etc.)
  if (
    /\.(js|css|jpg|jpeg|png|gif|svg|ico|woff|woff2|ttf|eot|webp)$/i.test(
      pathname
    )
  ) {
    return await next();
  }

  // Obtener respuesta para páginas
  let response = await next();

  // Si es 404 y no tiene extensión, es una ruta dinámica SSR
  if (response.status === 404 && !pathname.includes(".")) {
    // Dejar que Waku maneje el SSR
    response = await next();
  }

  // Aplicar headers de seguridad y CSP
  return applySecurityHeaders(response);
};
