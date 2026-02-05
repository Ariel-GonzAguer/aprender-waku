# Implementación de CSP con Nonces

Este proyecto utiliza **Content Security Policy (CSP)** con **nonces dinámicos** para mejorar la seguridad sin bloquear los scripts inline necesarios de Waku.

## ¿Qué son los nonces?

Un **nonce** (number used once) es un valor aleatorio único que se genera para cada petición. Solo los scripts que incluyan este nonce específico serán permitidos por la CSP.

## Arquitectura

### 1. Edge Function (`netlify/edge-functions/csp-nonce.ts`)

Esta función se ejecuta en el edge de Netlify (cercano al usuario) para cada petición HTML:

1. **Genera un nonce criptográficamente seguro** usando `crypto.getRandomValues()`
2. **Añade el header CSP** con el nonce dinámico
3. **Inyecta el nonce** en todos los scripts inline del HTML

### 2. Configuración Netlify (`netlify.toml`)

```toml
[[edge_functions]]
  function = "csp-nonce"
  path = "/*"
```

Esto configura la edge function para que intercepte todas las peticiones HTML.

## Content Security Policy

La política actual incluye:

- `script-src 'self' 'nonce-XXXXX'` - Solo permite scripts del mismo origen o con el nonce
- `script-src-elem 'self' 'nonce-XXXXX'` - Aplica la restricción también a elementos `<script>`
- `connect-src` - Permite conexiones a Firebase y servicios de Google
- `img-src 'self' data: https:` - Permite imágenes del mismo origen, data URIs y HTTPS
- `style-src 'self' 'unsafe-inline'` - Permite estilos inline (necesario para Tailwind)
- `default-src 'none'` - Bloquea todo por defecto

## Ventajas de usar nonces

✅ **Seguridad**: Cada request tiene un nonce único, imposible de predecir  
✅ **Compatible con Waku**: Permite los scripts inline necesarios para hidratación  
✅ **Sin 'unsafe-inline'**: Evitamos la directiva insegura `'unsafe-inline'`  
✅ **Protección XSS**: Previene inyección de scripts maliciosos  

## Testing

### Desarrollo local

El CSP con nonces solo funciona en Netlify. Para desarrollo local:

```bash
pnpm dev
```

Los errores de CSP no aparecerán en desarrollo local, solo en producción.

### Producción

Después de deployar a Netlify:

1. Verifica en DevTools que el header CSP incluye el nonce
2. Verifica que los scripts inline tienen el atributo `nonce="..."`
3. No deberían aparecer errores de CSP en la consola

## Troubleshooting

### Error: "script-src-elem 'self'"

Si sigues viendo este error, verifica:

1. ✅ La edge function está deployada en Netlify
2. ✅ El archivo está en `netlify/edge-functions/csp-nonce.ts`
3. ✅ El `netlify.toml` tiene la configuración correcta
4. ✅ Has redeployado después de los cambios

### Scripts externos

Si necesitas añadir más scripts externos (ej: analytics), añádelos a la directiva `script-src`:

```typescript
const csp = [
  // ...
  `script-src 'self' 'nonce-${nonce}' https://www.gstatic.com https://tu-script.com`,
  // ...
];
```

## Referencias

- [Content Security Policy (MDN)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [Netlify Edge Functions](https://docs.netlify.com/edge-functions/overview/)
- [CSP Nonces](https://content-security-policy.com/nonce/)
