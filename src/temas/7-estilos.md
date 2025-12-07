---
titulo: "7-estilos"
autor: "Ariel"
fecha: "7-12-2025"
tags: ["waku", "guía", "estilos", "css", "diseño", "tailwind"]
---

Por default, Waku viene con Tailwind CSS preconfigurado, lo que facilita iniciar proyectos rápidamente.

### Estilos globales

Para agregar estilos globales, podemos agregarlos en el archivo `src/styles.css`, o bien crear un nuevo archivo CSS en `src/estilos/index.css`, e importarlo a nuestro layout principal.

Para este proyecto se usa `src/styles.css`, y se importa a `src/pages/_root.tsx`. Este es el archivo `src/styles.css`:

```css
@import "tailwindcss";

/* Estilos para código inline - elementos como `computed`, `ref`, etc. */
code {
  @apply bg-gray-300 text-black px-1.5 py-0.5 rounded text-sm font-mono;
}

/* Asegurar que los bloques de código no hereden estos estilos */
pre code {
  @apply bg-transparent text-inherit px-0 py-0 rounded-none;
}

/* Estilos para bloques de código */
.bloqueCodigo {
  @apply text-left p-6 bg-[#24292e] rounded-lg border shadow-sm my-4 m-[0_auto];
}
``` 
[Siguiente: 8-staticAssets →](/temas/8-staticAssets)

[← Volver](/temas/6-metada)
