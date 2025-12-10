---
titulo: "2-renderizado"
autor: "Ariel"
fecha: "28-11-2025"
tags:
  [
    "waku",
    "framework",
    "react",
    "renderizado",
    "server components",
    "client components",
    "shared components",
    "ssr",
    "ssg",
    "weaving patterns",
    "RSC",
    "renderizado del lado del servidor",
    "renderizado estático",
    "renderizado dinámico",
    "server-side rendering",
    "static site generation",
  ]
---

Waku nos permite trabajar con dos tipos de componentes: de servidor (Server Components) y de cliente (Client Components).
Si usted viene de crear proyectos React con Vite, ya está familiarizado con componentes de cliente.

#### Server Components

Los _Server Components_ se renderizan desde el servidor y envían HTML pre-renderizado al cliente. Esto significa que el contenido ya está listo para mostrarse cuando llega al navegador, pudiendo mejorar la experiencia de la persona usuaria.
Estos componentes pueden realizar operaciones asincrónicas, como llamadas a APIs, consultas a bases de datos, y demás operaciones que requieran de lógica del lado del servidor de manera **segura**.
Podemos acceder al sistema de archivos, variables de entorno y otras funcionalidades del servidor sin preocuparnos por exponer información sensible al cliente.
Estos componentes **no** tienen estado, efectos secundarios, acceso a APIs **exclusivas del navegador**, interactividad ni acceso al DOM, ya que se ejecutan **exclusivamente** en el servidor.

Este es el código de un _Server Component_ que obtiene datos desde una API de [JSONPlaceholder](https://jsonplaceholder.typicode.com/) y los renderiza desde el servidor:

```tsx
export default async function EjemploComponenteServidor() {
  /**
   * Hace fetch a un post de JSONPlaceholder.
   * @returns {Promise<any>} Una promesa que resuelve con los datos del post.
   */
  async function fetchPosts(): Promise<any> {
    const postUno = await fetch("https://jsonplaceholder.typicode.com/posts/1");
    return postUno.json().then((data) => data.title);
  }

  return (
    <section
      className="p-6 border border-gray-300 rounded-lg mb-6"
    >
      <h2 className="text-2xl font-bold mb-4">Server Component</h2>
      <p className="mb-6">
        El siguiente dato es el título del post 1 de JSONPlaceholder:
      </p>
      <code>{await fetchPosts()}</code>
    </section>
  );
}

export const getConfig = async () => {
  return {
    render: "dynamic",
  } as const;
};
```

Puede ver el renderizado en este link → [Componente de servidor/Server Component renderizado](/ejemplos/componente-servidor)

---

#### Client Components

Los _Client Components_ se ejecutan desde el navegador y permiten crear interfaces interactivas. Estos componentes pueden tener estado, efectos secundarios, acceso al DOM y APIs del navegador. Son los componentes React 'tradicionales'.
Para definir un componente como _Client Component_, debemos agregar la directiva `'use client'` al inicio del archivo del componente. Esto le indica a Waku que este componente debe ser renderizado desde el cliente.

Este es el código de un _Client Component_ que agrega gatos a una lista cuando se hace clic en un botón:

```tsx
"use client";

import { useState } from "react";
import type { ReactElement } from "react";
import EjemploComponenteShared from "./EjemploComponenteShared";

export default function EjemploComponenteCliente() {
  const [gatos, setGatos] = useState<ReactElement[]>([]);

  /**
   * Genera un elemento de imagen de un gato.
   * @returns {JSX.Element} Un elemento img que muestra un ícono de un gato rojo que mueve su cabeza.
   */
  function generarImgGato(): ReactElement {
    return (
      <img
        src="/imagenes/gato-cliente.webp"
        alt="ícono de un gato color rojo que mueve su cabeza."
        className="size-20 rounded-full"
        key={gatos.length}
      />
    );
  }

  /**
   * Agrega un nuevo gato a la lista de gatos.
   */
  function agregarGatos() {
    const imgGato = generarImgGato();
    setGatos([...gatos, imgGato]);
  }

  return (
    <section
      className="p-6 border border-gray-300 rounded-lg"
    >
      <h2 className="text-2xl font-bold mb-4">Client Component</h2>
      <p className="mb-4">
        Este componente se ejecuta en el cliente, y agrega un gato cada vez que
        se presiona el botón 'Incrementar gatos'.
      </p>
      <button
        onClick={agregarGatos}
        className="px-4 py-2 bg-amber-300 text-black cursor-pointer rounded"
      >
        Incrementar gatos
      </button>
      <p className="mt-4">Gatos:</p>
      <div className="flex flex-wrap gap-2 my-6">{gatos}</div>
      <EjemploComponenteShared />
    </section>
  );
}
```

Puede ver el renderizado en este link → [Componente de cliente/Client Component renderizado](/ejemplos/componente-cliente)
</br>
</br>

##### Importante:

Siempre que importamos un `Client Component` dentro de un `Server Component`, creamos un `“server-client boundary”` (límite entre servidor y cliente). Si importamos un `Server Component` (llamémosle 'serverCompUno.tsx') dentro de un `Client Component`(llamémosle 'clientCompUno.tsx'), y luego importamos el `clientCompUno.tsx` dentro de un `Server Component`(llamémosle 'parentServerComp.tsx'), `serverCompUno.tsx` se comportará como un `Client Component`.
Para que `serverCompUno.tsx` se comporte como un `Server Component`, debemos importarlo directamente dentro de `parentServerComp.tsx`, sin pasar por un `clientCompUno.tsx`.

- -> No debemos **importar** un `Server Component` dentro de un `Client Component`.
- -> No debe haber **nada** antes de la directiva `'use client'` en un `Client Component`, ya que esto causará un error de compilación. No comentarios, importaciones, espacios invisibles ni declaraciones de variables. Nada de nada.
- -> Podemos importar `Client Components` dentro de otros `Client Components` sin problemas.
- -> Podemos importar `Server Components` dentro de otros `Server Components` sin problemas.
- -> Podemos importar `Client Components` dentro de `Server Components` sin problemas.
- -> Podemos pasarle `Server Components` como **props(ej: children)** a `Client Components`.
- -> Podemos importar un `Shared Component` (ver más abajo) dentro de `Client Components` y `Server Components` sin problemas.

---

#### Shared components

Los _Shared Components_ son componentes que no rompen las reglas tanto de los _Server Components_ como de los _Client Components_. Estos componentes no utilizan características exclusivas de ninguno de los dos entornos, por lo que se pueden importar y utilizar en ambos tipos de componentes sin problemas. Estas son las reglas que deben seguir los _Shared Components_:

- -> No tienen estado.
- -> No utilizan efectos secundarios.
- -> No acceden al DOM.
- -> No utilizan APIs exclusivas del navegador.
- -> No realizan operaciones asíncronas.
- -> No acceden a funcionalidades exclusivas del servidor, como el sistema de archivos o variables de entorno.

Este es el código de un _Shared Component_ que muestra un mensaje simple:

```tsx
import { useId } from "react";

export default function EjemploSharedComponent() {
  function generarId() {
    let ids: string[] = [];
    for (let i = 0; i < 5; i++) {
      ids.push(useId());
    }
    console.log("ID generado:", ids);
    return ids.join(", ");
  }

  return (
    <section className="mt-6">
      <div className="p-6 bg-linear-to-r from-amber-300 to-red-600 text-black rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Componente Shared</h2>
        <p className="mb-3">
          Este componente puede renderizarse en cliente y servidor
        </p>
        <ul className="list-none space-y-2">
          <li>✓ No tiene estado</li>
          <li>✓ No usa APIs del navegador</li>
          <li>✓ No accede a funcionalidades exclusivas del servidor </li>
        </ul>
      </div>
      <p>ID generado por React con useID: {generarId()}</p>
    </section>
  );
}
```

Puede ver el renderizado en este link → [Componente compartido/Shared Component renderizado](/ejemplos/componente-shared)

---

#### ¿Cuándo es un Server Component, un Client Component o un Shared Component?

- -> Si el componente necesita interactividad, estado o acceso al DOM, tiene `'use client'` → **Client Component**.
- -> Si el componente realiza operaciones asíncronas, accede a datos del servidor o utiliza funcionalidades exclusivas del servidor → **Server Component**.
- -> Si el componente no utiliza características exclusivas de ninguno de los dos entornos → **Shared Component**.

            ¿Tiene “use client”?
         ┌──────────┴──────────┐
         |                     |
       Sí → Client Component   No
                              |
                          ¿Usa APIs del servidor?
                     ┌────────┴─────────┐
                     |                  |
                   Sí → Server Component  No
                                         |
                                 ¿Usa APIs del navegador / estado / efectos?
                                 ┌────────┴────────┐
                                 |                 |
                               Sí → Client         No
                                                   |
                                             Shared Component

---

#### Weaving patterns (Patrones de tejido)

Waku permite combinar _Server Components_ y _Client Components_ de diversas maneras para crear aplicaciones web eficientes e interactivas. Algunos patrones comunes incluyen:

- **Server Component con Client Component anidado:** Un _Server Component_ que obtiene datos del servidor y renderiza un _Client Component_ para manejar la interactividad en el cliente.
- **Client Component con Server Component anidado:** Un _Client Component_ que maneja la interactividad y renderiza un _Server Component_ para mostrar datos pre-renderizados.
- **Shared Component en ambos contextos:** Un _Shared Component_ que se utiliza tanto en _Server Components_ como en _Client Components_ para mantener la consistencia en la interfaz de usuario.

---

#### Renderizado del lado del servidor (Server-side rendering)

Waku nos ofrece la posibilidad de renderizar contenido de dos formas:

- -> Prerenderizado estático (static side generation (SSG) ).
- -> Renderizado desde el servidor en cada solicitud (server side rendering (SSR) ).

Podemos usar estos métodos tanto para layouts como para páginas individuales, incluyendo Componentes de Servidor y Componentes de Cliente.

En el siguiente tema **Enrutamiento** veremos cómo configurar cada método de renderizado en Waku.

[Siguiente: 3-enrutamiento →](/temas/3-enrutamiento)

[← Volver](/temas/1-primerosPasos)
