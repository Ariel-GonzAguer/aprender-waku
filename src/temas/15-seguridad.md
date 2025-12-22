---
titulo: "15-seguridad"
autor: "Ariel"
fecha: "21-12-2025"
tags: ["waku", "guía", "seguridad", "autenticación", "autorización"]
---

**Nota**: Esta es una sección extra que no se menciona en la documentación oficial de Waku, pero que considero importante tratar.

### Introducción

Waku inyecta scripts para mostrar el contenido de nuestra página, lo que puede generar choques con una CSP (Content Security Policy) estricta.
Una forma de mitigar este problema es usar `nonce` en los scripts inyectados.
Para ello podemos crear un _middleware_ que genere un `nonce` único para cada solicitud y lo agregue a los encabezados de respuesta, pero hay un detalle: según dónde se despliegue, la forma de agregar encabezados puede variar.

En Vercel los cabezados se configuran en el archivo `vercel.json`, de manera estática, por lo que no es posible (o no he logrado) agregar un `nonce` dinámicamente.

En Netlify, en cambio, podemos usar un middleware para agregar los encabezados dinámicamente mediante Edge Functions.
Acá un ejemplo de un middleware que agrega un `nonce` a los scripts inyectados por Waku:

```ts
// netlify/edge-functions/csp-nonce.ts

// debemos instalar el paquete '@netlify/edge-functions' → pnpm add -D @netlify/edge-functions
import type { Context } from "@netlify/edge-functions";

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
  // Generar un nonce único para esta request
  const nonce = generateNonce();

  // Obtener la respuesta original
  const response = await context.next();
  const contentType = response.headers.get("content-type") || "";

  // Solo procesar respuestas HTML
  if (!contentType.includes("text/html")) {
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
    // ...otras directivas CSP según sea necesario
  ].join("; ");

  newHeaders.set("Content-Security-Policy", csp);

  // Leer el HTML y añadir el nonce a los scripts inline
  const html = await response.text();

  // Inyectar el nonce en todos los scripts inline
  // Captura scripts con o sin atributos, pero solo inline (sin src)
  const modifiedHtml = html.replace(
    /<script(?!\s+src=)([^>]*)>/gi,
    (match, attributes) => {
      // Si ya tiene nonce, no añadir otro
      if (attributes.includes("nonce=")) {
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
  path: "/*",
};
```

Este middleware genera un `nonce` único para cada solicitud, lo agrega a la política de seguridad de contenido y lo inyecta en los scripts inline del HTML. De esta manera, podemos mantener una CSP estricta sin bloquear los scripts necesarios para que Waku funcione correctamente.

#### Sugerencias adicionales

- -> Analizar qué políticas de seguridad son necesarias para nuestra aplicación y ajustarlas según el contexto.
- -> Siempre validar y sanitizar cualquier entrada del usuario para prevenir ataques de inyección.
- -> Utilizar HTTPS para todas las comunicaciones para proteger los datos en tránsito.
- -> Implementar mecanismos de autenticación y autorización adecuados para proteger las rutas sensibles de la aplicación.
- -> Mantener las dependencias actualizadas para evitar vulnerabilidades conocidas.
- -> Realizar auditorías de seguridad periódicas para identificar y mitigar posibles riesgos.
- -> Considerar el uso de herramientas de análisis de seguridad estática para detectar vulnerabilidades en el código.
- -> No usar 'unsafe-eval' ni 'unsafe-inline' en la CSP (a menos que sea absolutamente necesario), ya que esto puede abrir la puerta a ataques XSS.
- 

[← Volver](/temas/14-despliegue)
