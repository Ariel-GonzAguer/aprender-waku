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