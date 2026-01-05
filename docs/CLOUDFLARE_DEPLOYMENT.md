# Despliegue en Cloudflare Pages - Guía de Configuración

Este documento describe cómo desplegar el proyecto Waku en Cloudflare Pages. Dado que Cloudflare Pages usa Workers runtime (no Node.js completo), **solo funciona SSG (Static Site Generation)**.

## LIMITACIÓN CRÍTICA

**Cloudflare Pages NO es compatible con SSR de Waku.**

El servidor de Waku (`dist/server/`) requiere módulos nativos de Node.js (`fs`, `path`, `http`, `crypto`) que no existen en Cloudflare Workers runtime. Esto significa:

- **SSG (Static Site Generation)**: Funciona - páginas pre-generadas en build time
- **CSG (Client-Side Generation)**: Funciona - componentes `.client.tsx` 
- **SSR (Server-Side Rendering)**: NO funciona - requiere Node.js runtime
- **API Routes (`src/pages/api/*.ts`)**: NO funcionan - deben reimplementarse manualmente en `/functions/api/`

**RECOMENDACIÓN:** Para SSR completo, usa Netlify. Este proyecto ya tiene configuración de Netlify en `netlify.toml`.

## Requisitos Previos

- Cuenta en Cloudflare Pages
- Node.js 18.x o superior
- pnpm instalado
- Wrangler CLI (ya incluido en `package.json`)

## Configuración

### 1. Autenticar con Cloudflare

```bash
wrangler login
```

### 2. Estructura del Proyecto

Cloudflare Pages desplegará:

- `dist/public/` - Páginas estáticas generadas por Waku
- `/functions/` - Edge Functions (Cloudflare Workers)

Lo que **NO** se despliega:
- `dist/server/` - Servidor SSR de Waku (incompatible con Workers runtime)
- `src/pages/api/` - API routes de Waku (deben reimplementarse)

### 3. Convertir Rutas Dinámicas a SSG

Todas las rutas con `[slug]`, `[id]` u otros parámetros dinámicos deben convertirse a SSG:

```typescript
// src/pages/ejemplos/[slug].tsx
export const getConfig = async () => {
  return {
    render: "static",
    staticPaths: [
      "componente-cliente",
      "componente-servidor",
      "componente-shared"
    ]
  } as const;
};
```

Sin `staticPaths`, la ruta intentará usar SSR y fallará con error "Connection closed".

### 4. Reimplementar API Routes

Los endpoints de `src/pages/api/*.ts` deben reimplementarse manualmente en `/functions/api/[[path]].ts`:

```typescript
// functions/api/[[path]].ts
export const onRequest = async (context: any) => {
  const { request } = context;
  const url = new URL(request.url);
  const pathname = url.pathname;
  const method = request.method;

  const apiPath = pathname.replace('/api/', '').split('?')[0];

  if (apiPath === 'jsonPlaceholderPosts' && method === 'GET') {
    const idParam = url.searchParams.get('id');
    const apiUrl = idParam 
      ? `https://jsonplaceholder.typicode.com/posts/${idParam}`
      : 'https://jsonplaceholder.typicode.com/posts';
    
    const response = await fetch(apiUrl);
    const data = await response.json();
    return Response.json(data);
  }

  return Response.json(
    { error: `Endpoint /api/${apiPath} not found` },
    { status: 404 }
  );
};
```

Cada endpoint de Waku debe copiarse y adaptarse manualmente como Cloudflare Function.

## Scripts de Deployment

### Desarrollo Local

```bash
pnpm dev
```

Ejecuta Waku con SSR completo en `localhost:3000` (solo disponible en desarrollo).

### Build

```bash
pnpm build
```

Genera:
- `dist/public/` - Páginas SSG y assets estáticos (esto se despliega)
- `dist/server/` - Servidor SSR (no se usa en Cloudflare)

## Probar antes del Despliegue

```bash
pnpm cf-pages:test
```

### Desplegar

```bash
pnpm deploy:cloudflare
```

Ejecuta:
1. `waku build` - Genera páginas estáticas
2. `wrangler pages deploy dist/public` - Sube a Cloudflare Pages
3. Las funciones en `/functions/` se despliegan automáticamente

## Content Security Policy (CSP)

El archivo `functions/[[path]].ts` implementa CSP con nonces dinámicos:

```typescript
// Se genera un nonce único por request
const nonce = generateNonce();

// Se inyecta en todos los <script> tags del HTML
const htmlWithNonces = injectNonceIntoHTML(html, nonce);

// Headers CSP sin 'unsafe-inline'
const cspHeader = `
  script-src 'self' 'nonce-${nonce}';
  connect-src 'self' https://api.github.com https://api.pokemontcg.io;
`;
```

Para agregar APIs externas, modifica `applySecurityHeaders()` en `functions/[[path]].ts`.

## Variables de Entorno

Configura en el dashboard de Cloudflare (Workers & Pages → Tu proyecto → Settings → Environment variables):

```bash
# Variables públicas
ENVIRONMENT=production
NODE_ENV=production

# Variables secretas
API_KEY=tu-api-key-aqui
```

Acceso en Cloudflare Functions:

```typescript
export const onRequest = async (context) => {
  const apiKey = context.env.API_KEY;
  // ...
};
```

## Monitoreo

Ver logs en tiempo real:

```bash
wrangler tail
```

O en el dashboard: Cloudflare → Workers & Pages → Tu proyecto → Logs

## Solución de Problemas

### Error: "Connection closed" en rutas dinámicas

**Causa:** La ruta intenta usar SSR sin `staticPaths`.

**Solución:** Agregar `getConfig()` con `staticPaths`:

```typescript
export const getConfig = async () => {
  return {
    render: "static",
    staticPaths: ["ruta-1", "ruta-2", "ruta-3"]
  } as const;
};
```

### Los endpoints API retornan HTML

**Causa:** `src/pages/api/*.ts` no se ejecutan en Cloudflare.

**Solución:** Reimplementar en `/functions/api/[[path]].ts` (ver sección "Reimplementar API Routes").

### Error: "Could not resolve 'fs', 'path', 'http'"

**Causa:** Intentar importar módulos de Node.js en funciones.

**Solución:** No importar nada de `dist/server/` ni usar módulos nativos de Node.js en `/functions/`.

### CSP bloquea scripts

**Causa:** Scripts sin atributo `nonce`.

**Solución:** Verificar que `functions/[[path]].ts` esté inyectando nonces correctamente. Revisar consola del navegador para ver qué nonce espera el CSP.

## Resumen

### Qué funciona en Cloudflare Pages:

- SSG: Páginas estáticas con `staticPaths`
- CSG: Componentes cliente (`.client.tsx`)
- Edge Functions: Middleware en `/functions/`
- API Functions: Si reimplementadas en `/functions/api/`
- Assets estáticos: Imágenes, CSS, JS

### Qué NO funciona:

- SSR: Renderizado en servidor (requiere Node.js)
- API Routes de Waku: `src/pages/api/*.ts` no se ejecutan
- Rutas dinámicas sin `staticPaths`: Fallan con "Connection closed"

### Recomendaciones:

**Usa Cloudflare Pages si:**
- Tu sitio es principalmente estático
- Puedes pre-generar todas las páginas
- No necesitas SSR dinámico
- Quieres CDN global y buen rendimiento

**Usa Netlify o Vercel si:**
- Necesitas SSR completo
- Tienes rutas verdaderamente dinámicas
- Quieres usar API routes de Waku sin reimplementar

**Checklist para desplegar en Cloudflare:**

1. Convertir todas las rutas `[slug]` a SSG con `staticPaths`
2. Reimplementar todos los endpoints `src/pages/api/*.ts` en `/functions/api/[[path]].ts`
3. Verificar que no se importan módulos de Node.js en `/functions/`
4. Ejecutar `pnpm build` y verificar `dist/public/`
5. Ejecutar `pnpm deploy:cloudflare`
6. Probar todas las rutas y endpoints en producción

Esta configuración es ideal para sitios estáticos con alto tráfico. Para SSR, usa Netlify (ya configurado en `netlify.toml`).
