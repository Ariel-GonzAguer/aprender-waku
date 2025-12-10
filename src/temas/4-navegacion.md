---
titulo: "4-navegacion"
autor: "Ariel"
fecha: "4-12-2025"
tags: ["waku", "guía", "navegación", "link", "router", "useRouter"]
---

### Link

Este es el componente que debemos usar para crear enlaces de navegación interna. Acepta una prop `to` que indica la ruta a la que se quiere navegar, y que se obtiene automáticamente antes de la navegación.

En este proyecto, podemos ver el uso de `<Link>` en el header para navegar entre las diferentes páginas:

```tsx
import { Link } from "waku";
export default function Header() {
  return (
    <header className="bg-black text-white h-10 flex items-center justify-center">
      <nav className="w-full flex items-center justify-between gap-10 px-4 max-w-4xl mx-auto">
        <Link to="/temas">
          Temas
        </Link>
        <Link to="/">
          Inicio
        </Link>
        <Link to="/acercaDe">
          Acerca De
        </Link>
      </nav>
    </header>
  );
}

// este componente se renderiza como 'static' por default
```

### useRouter

El hook `useRouter` se puede usar para inspeccionar la ruta actual y realizar navegaciones programáticas.

#### Propiedades del router

El objeto router tiene dos propiedades relacionadas a la ruta actual:

- -> `path`: tipo `string`.
- -> `query`: tipo `string`.

#### Métodos del router

El objeto enrutador también contiene varios métodos para la navegación programática:

- -> `router.push(to: string)` - Navegar a la ruta proporcionada

- -> `router.prefetch(to: string)` - Precargar la ruta proporcionada

- -> `router.replace(to: string)` - Reemplazar la entrada actual del historial

- -> `router.reload()` - Recargar la ruta actual

- -> `router.back()` - Navegar a la entrada anterior en el historial de sesiones

- -> `router.forward()` - Navegar a la siguiente entrada en el historial de sesiones

Acá un ejemplo de uso de `useRouter`, donde vemos `path`, `query`, `router.push()` y `router.reload()`:

```tsx
"use client";

import { useRouter } from "waku";

export default function Router() {
  const { path, query } = useRouter();
  const router = useRouter();

  return (
    <section
      className="flex flex-col justify-center items-center my-10 text-xl"
    >
      <p className="mb-6">Ruta actual: {path}</p>
      <p className="mb-6">Parámetros de consulta: {JSON.stringify(query)}</p>

      <button
        className="text-black py-5 px-4 mb-4 border-2 border-red-600 bg-amber-400 rounded"
        onClick={() => router.push("/temas/4-navegacion")}
      >
        Ir al tema 4-navegación
      </button>
      <button
        className="text-black py-5 px-4 border-2 border-red-600 bg-amber-400 rounded"
        onClick={() => {
          alert("Recargando...");
          router.reload();
        }}
      >
        Recargar
      </button>
    </section>
  );
}
```
Visite la página que usa este componente aquí: [ver página aquí](/router "enlace a la página que usa el componente Router").

[Siguiente: 5-manejo de errores →](/temas/5-manejoDeErrores)

[← Volver](/temas/3-enrutamiento)
