## APIs del navegador que NO podés usar en un RSC → No existe el window

- window
- document
- localStorage
- sessionStorage
- navigator
- history
- location
- matchMedia
- scrollTo, scrollBy
- requestAnimationFrame
- IntersectionObserver
- ResizeObserver
- MutationObserver
- WebSocket del navegador (aunque sí podés usar WebSocket del servidor)
- Canvas (canvas.getContext(...))
- WebGL
- DOM (no podés manipular elementos)
- Web Animations API

## APIs que SÍ podés usar

- fetch
- crypto (hash, randomUUID, etc.)
- URL, URLSearchParams
- lectura de archivos (si tu entorno lo permite)
- llamadas a bases de datos (¡muy recomendado!)
- SDKs de terceros (Stripe, Firestore Admin, PocketBase admin, etc.)
- process.env para leer variables privadas
- lógica pesada (cálculos, formateo, parseo)
- cache del servidor
- llamadas internas a APIs privadas
- librerías que no dependan del DOM (ej.: date-fns, zod, lodash, jose, bcrypt, etc.)

## Head en slug routes
Se puede agregar un head con metadatos dinámicos en rutas de slug, pero hay que tener en cuenta que el head se genera en el servidor y no puede depender de datos del cliente. 
No se puede incluir body ni html en estas rutas, si se usa _root.tsx.

## Altura completa de pantalla (min-h-screen vs h-full)

**Problema:** El fondo no cubre toda la pantalla cuando hay poco contenido.

**Causa:** `h-full` (height: 100%) requiere que el elemento padre tenga altura definida. En pantallas con poco contenido, el body con `h-full` solo ocupa la altura del contenido.

**Solución:** Usar `min-h-screen` en lugar de `h-full`:
- `min-h-screen` = altura mínima de 100vh (toda la ventana visible)
- Garantiza que el fondo cubra toda la pantalla, incluso con poco contenido
- Si el contenido excede la pantalla, se extiende correctamente

**Ejemplo:**
```tsx
// _root.tsx
<html className='min-h-screen'>
  <body className='min-h-screen'>{children}</body>
</html>

// _layout.tsx
<section className="flex flex-col min-h-screen bg-zinc-900">
  {children}
</section>
```