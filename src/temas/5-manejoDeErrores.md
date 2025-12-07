---
titulo: "5-manejo de errores"
autor: "Ariel"
fecha: "5-12-2025"
tags: ["waku", "guía", "manejo de errores", "errores"]
---

Waku nos da un `error boundary` (límite de errores) por defecto para manejar errores en nuestras aplicaciones, aunque también nos permite personalizar este comportamiento si lo necesitamos, colocando un componente `ErrorBoundary` en cualquier parte, usando librerías externas, como `react-error-boundary`, o implementando nuestro propio límite de errores.

Cuando se generan errores desde Server Components o funciones del servidor, estos se reproducen automáticamente en el navegador. Esto permite que los límites de error más cercanos los detecten y gestionen, incluso si se originaron en el servidor.

Los límites de error gestionan errores inesperados como **último recurso**. Para condiciones de error esperadas (como validación o fallos de red), trátelas explícitamente en la lógica de su aplicación.

En producción, los errores del servidor se ofuscan automáticamente en el cliente para evitar revelar información interna del servidor. Los mensajes de error detallados y los seguimientos de pila **solo son visibles en desarrollo**.

Si personaliza el elemento raíz (consulte Elemento raíz), debería añadir su propio límite de error **en los componentes correspondients, no en el elemento raíz**, ya que el límite de error raíz predeterminado de Waku está incluido en el elemento raíz predeterminado.

##### react-error-boundary

Para usar la librería `react-error-boundary`, primero debemos instalarla:

```bash
pnpm add react-error-boundary
```

Algo crucial a tener en cuenta es que los límites de error solo funcionan en componentes del cliente. Por lo tanto, debemos asegurarnos de que el componente donde implementamos el límite de error sea un componente del cliente.

Acá un ejemplo de cómo usar `react-error-boundary` tomado de (su página de npm)[https://www.npmjs.com/package/react-error-boundary "Enlace a react-error-boundary en npm"]:

```tsx
"use client";

import { ErrorBoundary } from "react-error-boundary";

<ErrorBoundary fallback={<div>Something went wrong</div>}>
  <ExampleApplication />
</ErrorBoundary>;
```

[Siguiente: 6-metadata →](/temas/6-metadata)

[← Volver](/temas/4-navegacion)
