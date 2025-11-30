---
titulo: "3-enrutamiento"
autor: "Ariel"
fecha: "30-11-2025"
tags: ["waku", "enrutamiento", "rutas", "guía"]
---

Esta es la sección más extensa de la guía.

### Introducción

Waku utiliza un sistema mínimo de enrutamiento basado en archivos, similar a Astro.
Cada archivo `.tsx` dentro de la carpeta `src/pages` se convertirá una ruta de nuestra aplicación. Así de fácil.
Además, Waku nos da acceso a su [API de bajo nivel](https://github.com/wakujs/waku/blob/main/docs/create-pages.mdx "Enlace a API de bajo nivel de Waku") si preferimos definir las rutas programáticamente; eso sí, en esta guía nos enfocaremos en el enrutamiento basado en archivos, al igual que en la documentación oficial.

Páginas y layouts pueden crearse creando archivos `.tsx` que contengan dos exportaciones: una función `default` que para el componente React, y una función llamada `getConfig` que retorna un objeto de configuración para definir el tipo de renderizado y otras opciones.

Como vimos en la [sección anterior](/temas/2-renderizado "enlace a tema 2-renderizado"), Waku soporta dos tipos de renderizado: SSG (estático) y SSR (dinámico).
Layouts, páginas y slices (se verán más adelante) son estáticos por defecto (SSG), mientras los handlers de API son dinámicos (SSR) por defecto.

Por ejemplo, este proyecto prerenderiza en un layout estático (SSG) el header y footer, pero otro el contenido de estos temas se renderiza dinámicamente (SSR) desde el servidor, usando un Server Component para renderizar el markdown, y otro Server Component como slug (se verá más adelante) para cada tema.

Acá el código del layout general (`src/pages/_layout.tsx`):

```tsx
import Header from "../components/Header";
import Footer from "../components/Footer";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col min-h-screen w-full text-white text-lg bg-zinc-900 cursor-default">
      <Header />
      <main className="flex flex-col flex-1 w-full">{children}</main>
      <Footer />
    </section>
  );
}

export const getConfig = async () => {
  return {
    render: "static",
  } as const;
};
```

Nótese que el layout importa dos Shared Components, para el header y el footer, que se renderizan estáticamente (SSG).
El layout toma una prop `children` que representa el contenido de cada página que se muestra dentro del layout, el contenido puede ser estático o dinámico, con Client Components y Server Components.

Acá el código del renderizador de markdown de cada tema (`src/components/MarkdownRenderer.server.tsx`):

```tsx
import fm from "front-matter";
import fs from "fs";
import path from "path";
import MarkdownContent from "../components/MarkdownContent.client";

interface FrontmatterAttributes {
  titulo?: string;
  autor?: string;
  fecha?: string;
  [key: string]: unknown;
  tags?: string[];
}

interface Props {
  markdown: string;
}

// Función para procesar referencias a archivos
async function processFileReferences(content: string): Promise<string> {
  const fileRefRegex = /#file:([^\s\n]+)/g;
  let processedContent = content;

  const matches = Array.from(content.matchAll(fileRefRegex));

  for (const match of matches) {
    const filePath = match[1];
    if (!filePath) continue;
    const fullPath = path.join(process.cwd(), "src", filePath);

    try {
      if (fs.existsSync(fullPath)) {
        const fileContent = fs.readFileSync(fullPath, "utf-8");
        const ext = path.extname(filePath).slice(1) || "tsx";
        const codeBlock = `\`\`\`${ext}\n${fileContent}\n\`\`\``;
        processedContent = processedContent.replace(match[0], codeBlock);
      }
    } catch (error) {
      console.error(`Error reading file ${filePath}:`, error);
    }
  }

  return processedContent;
}

export default async function MarkdownRenderer({ markdown }: Props) {
  // Parsear frontmatter
  const parsed = fm<FrontmatterAttributes>(markdown);

  // Extraer atributos y contenido
  const { attributes: data, body: content } = parsed;

  // Procesar referencias a archivos
  const processedContent = await processFileReferences(content);

  // Sanitizar el id para evitar inyecciones accidentales
  const titleValue =
    typeof data.titulo === "string"
      ? data.titulo
      : typeof (data as any).title === "string"
      ? (data as any).title
      : undefined;

  const safeId = titleValue
    ? titleValue.toLowerCase().replace(/[^a-z0-9-_]+/g, "-")
    : undefined;

  return (
    <>
      <title>{data.titulo}</title>
      <meta name="author" content={data.autor} />
      <meta
        name="keywords"
        content={Array.isArray(data.tags) ? data.tags.join(", ") : ""}
      />
      <meta name="robots" content="index, follow" />

      <article className="prose lg:prose-xl mx-auto p-4 leading-loose text-center text-balance">
        <header className="mb-6 text-center text-red-600 text-4xl">
          {data.titulo && <h2 id={safeId}>{data.titulo}</h2>}
          {(data.autor || data.fecha) && (
            <p className="text-sm text-gray-500 italic">
              {data.autor && <>Por {data.autor}</>}
              {data.autor && data.fecha && " — "}
              {data.fecha && <>{data.fecha}</>}
            </p>
          )}
        </header>

        <MarkdownContent markdown={processedContent} />
      </article>
    </>
  );
}

export const getConfig = async () => {
  return {
    render: "dynamic",
  } as const;
};
```

Este componente no tiene `getConfig` y no utiliza `use client`, por lo que es un Server Component estático (SSG) por defecto.

Y acá el código del slug dinámico de cada tema (`src/pages/temas/[slug].tsx`):

```tsx
import type { PageProps } from "waku/router";
import { getTemaBySlug } from "../../lib/utils";
import MarkdownRenderer from "../../components/MarkdownRenderer.server";
import { Link } from "waku/router/client";

export default async function PostDetail({ slug }: PageProps<"/temas/[slug]">) {
  const tema = await getTemaBySlug(slug);

  if (!tema) {
    return (
      <>
        <head>
          <title>Tema no encontrado</title>
        </head>
        <div className="p-8">
          <h1>Tema no encontrado</h1>
          <p>
            El tema <code>{slug}</code> no existe.
          </p>
          <p>
            <Link to="/" className="text-blue-600 underline">
              Volver al inicio
            </Link>
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="max-w-[85%] m-[0_auto]">
        <MarkdownRenderer markdown={tema.contenido} />
      </div>
    </>
  );
}

export const getConfig = async () => {
  return {
    render: "dynamic",
  } as const;
};
```

Nótese que el slug importa el renderizador de markdown como un Server Component y tiene `getConfig` con redernizado dinámico (SSR).

---

#### Páginas

Las páginas renderizan una sola ruta, ruta segmentada/dinámica o "catch-all", basadas en la estructura de archivos dentro de `src/pages`, siguiendo las convenciones indicadas a continuación.
Todas las componentes de página reciben automáticamente dos props: `path` (string) y `query` (string).

##### Rutas básicas (Single Routes)

Estas rutas se pueden crear de dos formas:

- -> Creando un archivo `.tsx` dentro de `src/pages` con el nombre de la ruta. Por ejemplo, `src/pages/about.tsx` crea la ruta `/about`.
- -> Creando una carpeta dentro de `src/pages` con el nombre de la ruta, y dentro de esa carpeta un archivo `index.tsx`. Por ejemplo, `src/pages/temas-felinos/index.tsx` crea la ruta `/temas-felinos`.

##### Rutas segmentadas/dinámicas (Segmented/Dynamic Routes)

Estas rutas se definen creando archivos o carpetas con nombres entre parentesis cuadrados `[]`, que representan un segmento dinámico de la ruta. Por ejemplo:

- `src/pages/temas/[slug].tsx` crea rutas como `/temas/tema-1`, `/temas/tema-2`, etc., donde `slug` es un parámetro dinámico que puede tomar cualquier valor.
- `src/pages/gatos/[slug]/index.tsx` crea rutas como `/gatos/rojizo/index`, `/gatos/vaca/index`, etc.

Este tipo de componente necesita importar el tipo `PageProps` desde `waku` para tipar las props que recibe.
También puede decidir si es SSG o SSR mediante `getConfig`. Si se elige SSG, es necesario agregar la propiedad `staticPaths` en `getConfig`, el cual es un array con las rutas que se desean prerenderizar estáticamente.
Para trabajar con el valor dinámico (`slug`) normalmente se utiliza alguna función que obtenga los datos desde una fuente externa (archivo, base de datos, API, etc.) y retorne el valor correspondiente.

Para este proyecto se creó un archivo `src/lib/gatos.ts` con un array de objetos con data de gatos, y una función para obtener la data de un gato por su slug. Esta función se importa en el componente de ruta dinámica (`src/pages/gatos/[slug]/index.tsx`) para obtener la data del gato correspondiente al slug de la ruta.

Acá el código del archivo con la data de gatos y la función para obtener la data por slug (`src/lib/gatos.ts`):

```tsx
export const gatos = [
  {
    slug: "sundae",
    nombre: "Sundae",
    edad: 3,
    color: "naranja",
    mejorAmigo: "/imagenes/ardilla-amiga.webp",
  },
  {
    slug: "luna",
    nombre: "Luna",
    edad: 2,
    color: "gris",
    mejorAmigo: "/imagenes/caballo-amigo.webp",
  },
  {
    slug: "timi",
    nombre: "Timi",
    edad: 5,
    color: "vaca",
    mejorAmigo: "/imagenes/pato-amigo.webp",
  },
];
export function getGatoBySlug(slug: string) {
  return gatos.find((gato) => gato.slug === slug);
}
```

Acá el código del componente de ruta dinámica para cada gato (`src/pages/gatos/[slug]/index.tsx`):

```tsx
/**
 * Este componente de página muestra el funcionamiento de una ruta segmentada/dinámica.
 * Cada gato tiene su propia página accesible mediante su slug.
 * El componente obtiene el slug desde las props de la página y utiliza
 * la función getGatoBySlug para obtener los detalles del gato correspondiente.
 * Si el gato no se encuentra, muestra un mensaje de "Gato no encontrado".
 */

import type { PageProps } from "waku/router";
import { getGatoBySlug } from "../../../lib/gatos";

export default async function GatoDetalle({
  slug,
  path,
}: PageProps<"/gatos/[slug]">) {
  const gato = getGatoBySlug(slug);

  if (!gato) {
    return (
      <div>
        <h1>Gato no encontrado</h1>
      </div>
    );
  }

  return (
    <section
      title="Gatos estático segmentados/dinámicos"
      className="flex flex-col justify-center items-center my-10 text-xl"
    >
      <p className="mb-2 text-amber-300">Nombre del michi</p>
      <p className="mb-6">{gato.nombre}</p>
      <p className="mb-6">Edad: {gato.edad}</p>
      <p className="mb-6">Color: {gato.color}</p>
      <p className="mb-6">slug: {gato.slug}</p>
      <p className="mb-2">Mejor amiga de {gato.nombre}:</p>
      <img
        src={gato.mejorAmigo}
        alt={`Mejor amigo de ${gato.nombre}`}
        className="mb-6"
      />
      <p>path:{path}</p>
    </section>
  );
}

export const getConfig = async () => {
  return {
    render: "static",
    staticPaths: ["sundae", "luna", "timi"],
  } as const;
};
```

Nótese que el componente importa el tipo `PageProps` desde `waku/router` para tipar las props que recibe, y utiliza la función `getGatoBySlug` para obtener la data del gato correspondiente al slug de la ruta, además tiene `getConfig` con renderizado estático (SSG) y la propiedad `staticPaths` con los slugs de los gatos que se desean prerenderizar estáticamente, es decir, las rutas `/gatos/sundae`, `/gatos/luna` y `/gatos/timi` serán generadas estáticamente en el build.

Para renderizar componentes como rutas dinámicas segmentadas (como el caso de los ejemplo de componentes de cliente, servidor y shared) en este proyecto se creó el archivo `src/pages/ejemplos/[slug].tsx`, que funciona de manera similar al componente de ruta dinámica para cada gato, pero renderiza el componente completo, sin (practicamente) una estrutura definida en el slug, sino que se renderiza el componente completo según el slug.

Acá el código del componente de ruta dinámica para cada ejemplo (`src/pages/ejemplos/[slug].tsx`):

```tsx
import type { PageProps } from "waku/router";
import { Link } from "waku/router/client";
import * as ejemplos from "../../components/ejemplos";

type EjemploKey = keyof typeof ejemplos;

// Función para convertir slug a nombre de componente
// Ejemplo: "componente-cliente" → "EjemploComponenteCliente"
function slugToComponentName(slug: string): string {
  const words = slug.split("-");
  const capitalizedWords = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1)
  );
  return `Ejemplo${capitalizedWords.join("")}`;
}

export default async function PostDetail({
  slug,
}: PageProps<"/ejemplos/[slug]">) {
  const componentName = slugToComponentName(slug);
  const Component = ejemplos[componentName as EjemploKey] as
    | React.ComponentType<any>
    | undefined;

  if (!Component) {
    return (
      <>
        <head>
          <title>Ejemplo no encontrado</title>
        </head>
        <div className="p-8 max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Ejemplo no encontrado</h1>
          <p className="mb-4">
            El ejemplo{" "}
            <code className="bg-gray-200 px-2 py-1 rounded">{slug}</code> no
            existe.
          </p>

          <p className="mt-6">
            <Link
              to="/"
              className="text-blue-600 underline hover:text-blue-800"
            >
              ← Volver al inicio
            </Link>
          </p>
        </div>
      </>
    );
  }

  return (
    <section className="flex flex-col justify-center items-center text-center text-balance mt-10">
      <Component />
    </section>
  );
}

export const getConfig = async () => {
  return {
    render: "dynamic",
  } as const;
};
```

Y este es el contenido de `src/components/ejemplos/index.ts` que exporta todos los ejemplos:

```tsx
// Auto-import todos los componentes Ejemplo*
export { default as EjemploComponenteServidor } from "./EjemploComponenteServidor";
export { default as EjemploComponenteCliente } from "./EjemploComponenteCliente";
export { default as EjemploComponenteShared } from "./EjemploComponenteShared";

// Para agregar más componentes, simplemente crea un archivo Ejemplo*.tsx
// y exportelo acá siguiendo el patrón anterior
```

---

##### Rutas segmentadas/dinámicas anidadas (Nested Segmented/Dynamic Routes)

Las rutas pueden tener multiples segmentos, por ejemplo `/pokemones/[generacion]/[region]/[id]`, que se define creando una carpeta `pokemones` dentro de `src/pages`, y dentro de esa carpeta otra carpeta `[generacion]`, y dentro de esta otra carpeta `[region]`, y dentro de esta otra carpeta `[id]`, y finalmente dentro de esta última carpeta un archivo `index.tsx`.