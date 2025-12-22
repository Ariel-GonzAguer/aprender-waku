import type { Context } from '@netlify/edge-functions';

/**
 * Genera un nonce criptográficamente seguro para CSP
 */
function generateNonce(): string {
  const nonceBytes = new Uint8Array(16);
  crypto.getRandomValues(nonceBytes);
  return btoa(String.fromCharCode(...nonceBytes));
}

/**
 * Edge Function que añade nonces dinámicos a la Content Security Policy
 * y los inyecta en los scripts inline del HTML
 */
export default async (request: Request, context: Context) => {
  console.log('Procesando request para añadir CSP con nonce dinámico');
  // Generar un nonce único para esta request
  const nonce = generateNonce();

  // Obtener la respuesta original
  const response = await context.next();
  const contentType = response.headers.get('content-type') || '';

  // Solo procesar respuestas HTML
  if (!contentType.includes('text/html')) {
    return response;
  }

  // Crear nueva respuesta con headers modificados
  const newHeaders = new Headers(response.headers);
  
  // Configurar CSP con el nonce dinámico
  const csp = [
    "default-src 'none'",
    `script-src 'self' 'nonce-${nonce}'`,
    `script-src-elem 'self' 'nonce-${nonce}'`,
    "connect-src 'self' https://pokeapi.co https://api.thecatapi.com https://jsonplaceholder.typicode.com",
    "img-src 'self' data: https: blob:",
    "style-src 'self' 'unsafe-inline'",
    "font-src 'self' data:",
    "frame-ancestors 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "manifest-src 'self'"
  ].join('; ');
  
  newHeaders.set('Content-Security-Policy', csp);

  // Leer el HTML y añadir el nonce a los scripts inline
  const html = await response.text();
  
  // Inyectar el nonce en todos los scripts inline
  // Captura scripts con o sin atributos, pero solo inline (sin src)
  const modifiedHtml = html.replace(
    /<script(?!\s+src=)([^>]*)>/gi,
    (match, attributes) => {
      // Si ya tiene nonce, no añadir otro
      if (attributes.includes('nonce=')) {
        return match;
      }
      // Añadir nonce antes del cierre >
      return `<script${attributes} nonce="${nonce}">`;
    }
  );

  return new Response(modifiedHtml, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
};

export const config = {
  path: '/*',
};
