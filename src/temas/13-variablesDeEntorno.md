---
titulo: "13-variablesDeEntorno"
autor: "Ariel"
fecha: "30-11-2025"
tags: ["waku", "guía", "variables de entorno"]
---

Es **muy** importante distinguir las variables de entorno que deben mantenerse en secreto, de aquellas que pueden hacerse públicas sin problema.

##### Privadas

Por defecto, **todas** las variables de entorno se consideran privadas y solo son accesibles en los Server Components, que se renderizan exclusivamente en un entorno seguro. Sin embargo, se debe tener cuidado de no pasar la variable como `prop` a ningún Client Component. Estas variables debemos almacenarlas en un archivo `.env.local` o `.env` en la raíz del proyecto.

##### Públicas

Para definir variables de entorno públicas, debemos usar el prefijo `WAKU_PUBLIC_`. Esto hace que estas variables se puedan acceder en entornos del cliente(navegador) mediante Client Components.
Estarán disponibles/presentes como texto sin formato en el paquete de JavaScript de producción que se envía a los navegadores.

#### Runtime Agnóstico (recomendado)

Las variables de entorno están disponibles en el servidor a través de la función `getEnv` de Waku y en el cliente a través de `import.meta.env`.

Veamos los siguientes ejemplos de la documentación oficial:

```tsx
// Server Component
// Los Server Components pueden acceder a todas las variables de entorno

import { getEnv } from "waku";

export const ServerComponent = async () => {
  const secretKey = getEnv("SECRET_KEY");

  return <>{/* ...*/}</>;
};
```

```tsx
// Client Component
// Los Client Components solo pueden acceder a variables públicas
"use client";

export const ClientComponent = () => {
  const publicStatement = import.meta.env.WAKU_PUBLIC_HELLO;

  return <>{/* ...*/}</>;
};
```

#### Node.js

En entornos `Node.js`, se puede utilizar `process.env` para compatibilidad.

```tsx
// Server Component
export const ServerComponent = async () => {
  const secretKey = process.env.SECRET_KEY;

  return <>{/* ...*/}</>;
};
```

[Siguiente: 14-despliegue →](/temas/14-despliegue)

[← Volver](/temas/12-manejoDeEstado)
