---
titulo: "8-staticAssets"
autor: "Ariel"
fecha: "7-12-2025"
tags: ["waku", "guía", "static assets"]
---

Elementos como imágenes, fuentes y otros archivos estáticos se pueden almacenar en la carpeta `public` en la raíz del proyecto, y se puede acceder a esta carpeta mediante `/` ruta relativa desde el navegador.

Por ejemplo, acá accedemos al loader del gatito rojo que está en `public/loaders/OrangeCat_SVG.svg`:

```jsx
// src/pages/temas/[slug].tsx

// ... hay código arriba
<img
  aria-live="polite"
  src="/loaders/OrangeCat_SVG.svg"
  alt="Imagen de carga que muestra un gatito rojo girando."
/>
// ... hay código abajo
```
  
[Siguiente: 9-sistemaDeArchivos →](/temas/9-sistemaDeArchivos)

[← Volver](/temas/7-estilos)
