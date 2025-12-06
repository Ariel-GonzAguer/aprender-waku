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

Páginas y layouts pueden crearse con archivos `.tsx` que contengan dos exportaciones: una función `default` para el componente React, y una función llamada `getConfig` que retorna un objeto de configuración para definir el tipo de renderizado y otras opciones.

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

##### Rutas segmentadas (Segmented Routes)

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

// Para agregar más componentes, simplemente cree un archivo Ejemplo*.tsx
// y exportelo acá siguiendo el patrón anterior
```

---

##### Rutas segmentadas anidadas (Nested Segmented Routes)

Las rutas pueden tener multiples segmentos, por ejemplo `/pokemones/[generacion]/[region]/[id]`, que se define creando una carpeta `pokemones` dentro de `src/pages`, y dentro de esa carpeta otra carpeta `[generacion]`, y dentro de esta otra carpeta `[region]`, y dentro de esta otra carpeta `[id]`, y finalmente dentro de esta última carpeta un archivo `index.tsx`.

Pruebe con las siguientes rutas para ver el resultado:

- -> https://aprendiendowaku.vercel.app/pokemones/primera/kanto/4
- -> https://aprendiendowaku.vercel.app/pokemones/segunda/johto/133
- -> https://aprendiendowaku.vercel.app/pokemones/primera/kanto/133

Acá el código del archivo que nos retorna la data de los pokemones (`src/lib/pokemones.ts`):

```tsx
/**
 * Obtiene los datos de un Pokémon específico por su ID.
 *
 * Realiza una consulta a la PokéAPI para obtener la información completa del Pokémon
 * y la transforma en un objeto con propiedades útiles incluyendo generación y región.
 *
 * @param {number} id - El ID del Pokémon a obtener (basado en la PokéDex nacional)
 * @returns {Promise<Record<string, any> | null>} Una promesa que se resuelve con un objeto
 * contiendo los datos del Pokémon:
 * - `nombre`: Nombre del Pokémon
 * - `tipos`: Array de tipos del Pokémon
 * - `imagen`: URL de la imagen frontal del Pokémon
 * - `id`: ID del Pokémon
 * - `fullStats`: Array completo de estadísticas del Pokémon
 * - `peso`: Peso del Pokémon en kilogramos
 * - `altura`: Altura del Pokémon en metros
 * - `generacion`: Generación a la que pertenece (primera a octava)
 * - `region`: Región asociada al Pokémon (kanto, johto, hoenn, sinnoh, unova, kalos, alola, galar)
 *
 * @throws {Error} Si la solicitud a la PokéAPI falla o el Pokémon no existe
 *
 * @example
 * const pokemon = await getPokemonByID(1);
 * console.log(pokemon.nombre); // "bulbasaur"
 * console.log(pokemon.generacion); // "primera"
 */
export async function getPokemonByID(
  id: number
): Promise<Record<string, any> | null> {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  const pokemon = await response.json();
  const objetoPokemon = {
    nombre: pokemon.name,
    tipos: pokemon.types.map((typeInfo: any) => typeInfo.type.name),
    imagen: pokemon.sprites.front_default,
    id: pokemon.id,
    fullStats: pokemon.stats,
    peso: pokemon.weight / 10,
    altura: pokemon.height / 10,
    generacion:
      id <= 151
        ? "primera"
        : id <= 251
        ? "segunda"
        : id <= 386
        ? "tercera"
        : id <= 493
        ? "cuarta"
        : id <= 649
        ? "quinta"
        : id <= 721
        ? "sexta"
        : id <= 809
        ? "séptima"
        : "octava",
    region:
      id <= 151
        ? "kanto"
        : id <= 251
        ? "johto"
        : id <= 386
        ? "hoenn"
        : id <= 493
        ? "sinnoh"
        : id <= 649
        ? "unova"
        : id <= 721
        ? "kalos"
        : id <= 809
        ? "alola"
        : "galar",
  };
  console.log("Fetched Pokémon:", objetoPokemon);
  return objetoPokemon;
}
```

Y acá el código del componente de ruta segmentada anidada para cada Pokémon (`src/pages/pokemones/[generacion]/[region]/[id]/index.tsx`):

```tsx
import type { PageProps } from "waku/router";
import { getPokemonByID } from "../../../../lib/pokemones";

/**
 * Ruta segmentada anidada dinámica con validación: /pokemones/[generacion]/[region]/[id]
 *
 * Ejemplos de uso válidos:
 * - /pokemones/primera/kanto/25 → Pikachu (Gen 1, Kanto)
 * - /pokemones/segunda/johto/152 → Chikorita (Gen 2, Johto)
 * - /pokemones/tercera/hoenn/252 → Treecko (Gen 3, Hoenn)
 *
 * Ejemplos de rutas inválidas:
 * - /pokemones/primera/kanto/560 → Error: Emboar es de Gen 5, Unova
 * - /pokemones/segunda/hoenn/25 → Error: Pikachu es de Gen 1, Kanto
 *
 * Los segmentos deben coincidir con los datos reales del Pokémon.
 */

export default async function PokemonDetailPage({
  generacion,
  region,
  id,
}: PageProps<"/pokemones/[generacion]/[region]/[id]">) {
  const pokemon = await getPokemonByID(Number(id));

  // Si no se encuentra el Pokémon
  if (!pokemon) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold text-red-600">
          Pokémon no encontrado
        </h1>
        <p className="text-gray-600">No existe un Pokémon con el ID: {id}</p>
      </div>
    );
  }

  // Validar que la generación y región coincidan
  if (pokemon.generacion !== generacion || pokemon.region !== region) {
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <div className="bg-red-50 border-2 border-red-500 rounded-lg p-6">
          <h1 className="text-3xl font-bold text-red-600 mb-4">
            Pokémon no corresponde a esta ruta
          </h1>

          <div className="bg-white rounded p-4 mb-4">
            <p className="text-lg font-semibold text-gray-800 mb-2">
              {pokemon.nombre.charAt(0).toUpperCase() + pokemon.nombre.slice(1)}{" "}
              (#{pokemon.id})
            </p>
            <img
              src={pokemon.imagen}
              alt={pokemon.nombre}
              className="w-32 h-32 mx-auto"
            />
          </div>

          <div className="space-y-2 text-sm  text-black">
            <div className="flex justify-between p-2 bg-red-100 rounded">
              <span className="font-semibold">Generación en URL:</span>
              <span className="capitalize">{generacion}</span>
            </div>
            <div className="flex justify-between p-2 bg-green-100 rounded">
              <span className="font-semibold">Generación real:</span>
              <span className="capitalize">{pokemon.generacion}</span>
            </div>
            <div className="flex justify-between p-2 bg-red-100 rounded">
              <span className="font-semibold">Región en URL:</span>
              <span className="capitalize">{region}</span>
            </div>
            <div className="flex justify-between p-2 bg-green-100 rounded">
              <span className="font-semibold">Región real:</span>
              <span className="capitalize">{pokemon.region}</span>
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded">
            <p className="text-sm text-blue-800">
              <strong>Sugerencia:</strong> Intenta con la ruta correcta:
            </p>
            <p className="text-sm text-blue-600 font-mono mt-1">
              /pokemones/{pokemon.generacion}/{pokemon.region}/{pokemon.id}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Si todo es correcto, mostrar la card del Pokémon
  const primerTipo = pokemon.tipos[0] || "desconocido";

  return (
    <div className="max-w-5xl mx-auto p-8">
      {/* Breadcrumb contextual */}
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
        <span>Pokédex</span>
        <span>›</span>
        <span className="font-semibold text-blue-600 capitalize">
          {pokemon.generacion} Generación
        </span>
        <span>›</span>
        <span className="font-semibold text-green-600 capitalize">
          {pokemon.region}
        </span>
        <span>›</span>
        <span className="font-semibold text-black capitalize">
          {pokemon.nombre}
        </span>
      </nav>

      {/* Indicador de éxito */}
      <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
        <p className="text-green-700 font-semibold">Ruta válida</p>
        <p className="text-sm text-green-600">
          Este Pokémon corresponde correctamente a {pokemon.generacion}{" "}
          generación, región {pokemon.region}.
        </p>
      </div>

      {/* Card principal */}
      <div className="bg-white rounded-lg shadow-xl p-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Columna izquierda: Imagen */}
          <div>
            <div className="flex justify-center mb-4">
              <div className="text-center">
                <img
                  src={pokemon.imagen}
                  alt={pokemon.nombre}
                  className="w-64 h-64 object-contain bg-linear-to-br from-blue-50 to-purple-50 rounded-lg shadow-md"
                />
              </div>
            </div>
          </div>

          {/* Columna derecha: Información */}
          <div>
            <h1 className="text-4xl font-bold capitalize mb-4 text-black">
              {pokemon.nombre}
            </h1>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-gray-600">Pokédex Nacional</span>
                <span className="text-xl font-bold text-black">
                  #{pokemon.id}
                </span>
              </div>

              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-gray-600">Tipos</span>
                <div className="flex gap-2">
                  {pokemon.tipos.map((tipo: string) => (
                    <span
                      key={tipo}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded capitalize font-semibold"
                    >
                      {tipo}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-gray-600">Altura</span>
                <span className="text-lg font-semibold text-black">
                  {pokemon.altura}m
                </span>
              </div>

              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-gray-600">Peso</span>
                <span className="text-lg font-semibold text-black">
                  {pokemon.peso}kg
                </span>
              </div>
            </div>

            {/* Información contextual de generación y región */}
            <div className="bg-linear-to-r from-blue-50 to-green-50 rounded-lg p-4 space-y-3">
              <div>
                <p className="text-sm text-gray-500 mb-1">Generación</p>
                <p className="font-semibold text-black capitalize">
                  {pokemon.generacion}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Región</p>
                <p className="font-semibold text-black capitalize">
                  {pokemon.region}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4 text-black">
            Estadísticas Base
          </h2>
          <div className="space-y-3">
            {pokemon.fullStats.map((stat: any) => (
              <div key={stat.stat.name}>
                <div className="flex justify-between mb-1">
                  <span className="font-semibold capitalize text-sm text-gray-700">
                    {stat.stat.name.replace("-", " ")}
                  </span>
                  <span className="text-sm font-bold text-black">
                    {stat.base_stat}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded h-4">
                  <div
                    className="bg-linear-to-r from-blue-500 to-purple-500 h-4 rounded transition-all"
                    style={{ width: `${Math.min(stat.base_stat / 2.5, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export const getConfig = async () => {
  return {
    render: "dynamic",
  } as const;
};
```

Ahora, si queremos usar SSG en rutas segmentadas anidadas, debemos definir la propiedad `staticPaths` en `getConfig`, que ahora será un array con los arrays de segmentos.
Acá este ejemplo de la documentación oficial de Waku:

```tsx
// ./src/pages/shop/[category]/[product].tsx
import type { PageProps } from "waku/router";

// Create product detail pages
export default async function ProductDetailPage({
  category,
  product,
}: PageProps<"/shop/[category]/[product]">) {
  return <>{/* ...*/}</>;
}

export const getConfig = async () => {
  return {
    render: "static",
    staticPaths: [
      ["same-category", "some-product"],
      ["same-category", "another-product"],
    ],
  } as const;
};
```

##### Rutas catch-all (Catch-All Routes)

También son conocidas como rutas "wildcard", son definidas creando un archivo o carpeta usando tres puntos `...` dentro de los paréntesis cuadrados `[]`, por ejemplo `[...catchAll]`, y tienen una indefinida cantidad de segmentos en la ruta, y no correspondan a una ruta ya definida.
Esta es una ruta que captura **todos** los segmentos que sigan a un punto determinado del path.
Reciben una prop que es un array con los segmentos como un array ordenado de strings.

Por ejemplo, `src/pages/docs/[...slug].tsx` crea rutas como `/docs/tema-1`, `/docs/carpeta/tema-2`, `/docs/carpeta/subcarpeta/tema-3`, etc., donde `slug` es un array que contiene **todos** los segmentos después de `/docs/`.

Haga click [en este enlace](/pizzas/vegana/pesto/con-aceitunas "enlace que muestra qué captura la ruta catch-all usando `vegana` y `pesto` como parámetros") para ver qué captura la ruta catch-all. Puede probar cambiando los parámetros en la URL.

###### ¿Cuándo usar rutas catch-all?

- -> Documentación o blogs con muchísimas rutas anidadas: No creamos un archivo por cada carpeta → Una sola ruta catch-all controla todas.
- -> CMS o Markdown donde cada archivo define su propia estructura: La ruta catch-all puede mapear directamente la estructura del contenido.
- -> Proyectos multilenguaje: Con un solo archivo capturás la ruta completa.

```md
/docs/es/setup
/docs/en/setup
/docs/fr/setup
/docs/es/guia/avanzado/nav
```

- Sitios donde las URLs pueden cambiar o ser generadas por usuarios.

---

##### Rutas grupales

Estas rutas permiten agrupar rutas de manera lógica sin afectar la estructura de la URL.
Se definen creando carpetas con nombres entre paréntesis `()`, por ejemplo `(admin)`, dentro de `src/pages`.
Para este proyecto se crearon dos rutas grupales de ejemplo, que están dentro de la carpeta `src/pages/(grupales)`:

- -> `src/pages/(grupales)/grupalEstatica.tsx` crea la ruta `/grupalEstatica`. Mírela en [este enlace](/grupalEstatica "enlace a ruta grupal estática").
- -> `src/pages/(grupales)/grupalCliente.tsx` crea la ruta `/grupalCliente`. Mírela en [este enlace](/grupalCliente "enlace a ruta grupal con componente cliente").

Las rutas grupales son útiles para organizar aplicaciones complejas donde ciertas páginas comparten layouts, middlewares o configuraciones comunes, sin que esto afecte las URLs públicas del sitio. Puede visitar la documentación oficial de Waku para más detalles sobre rutas grupales [aquí](https://waku.gg/#group-routes "Enlace a documentación oficial sobre rutas grupales").

---

##### Rutas ignoradas

Las siguientes carpetas son ignoradas por el enrutador de Waku y no se convierten en rutas:

- -> `_components`.
- -> `_hooks`.

Cualquier archivo o carpeta dentro de ellas, será excluida del enrutamiento.
Veamos este ejemplo de la documentación oficial:

```tsx
pages/
├── about.tsx
├── _components/
│   ├── header.tsx   // ignorada
│   ├── footer.tsx   // ignorada
│   ├── ...          // ignorada
```

---

#### Layouts

Los layouts se crean con el nombre distintivo `_layout.tsx` y funcionan como "plantillas" que envuelven a las rutas y sus subrutas.
Aceptan un prop `children` que representa el contenido de la ruta que se está renderizando dentro del layout. Esta prop es de tipo `ReactNode`.
Aunque no es obligatorio tener un layout, suelen ser muy útiles para definir estructuras comunes como headers, footers, estados globales, proveedores globales, y más.

Este proyecto utiliza un layout general (`src/pages/_layout.tsx`) que envuelve todas las páginas, y otro layout específico para las rutas dentro de `src/pages/gatos` (`src/pages/gatos/_layout.tsx`).

##### Root Layout

Este es un layout particular. Se define en `src/pages/`, es decir `src/pages/_layout.tsx`, y envuelve todas las páginas de la aplicación.

##### Otros Layouts

Podemos crear layouts específicos para rutas o grupos de rutas específicas, creando un archivo `_layout.tsx` dentro de la carpeta de la ruta. Acá un ejemplo de la documentación oficial de un layout para una ruta de blogs:

```tsx
// ./src/pages/blog/_layout.tsx
import { Sidebar } from "../../components/sidebar";

// Crear un layout específico para la ruta /blog
export default async function BlogLayout({ children }) {
  return (
    <div className="flex">
      <div>{children}</div>
      <Sidebar />
    </div>
  );
}

export const getConfig = async () => {
  return {
    render: "static",
  } as const;
};
```

#### Elemento _Root_ / Elemeto _Raíz_

Los atributos de los elementos `<html>`, `<head>` o `<body>` se pueden personalizar con la API del elemento Raíz/Root.
Para esto podemos crear un archivo `src/pages/_root.tsx`. Este archivo es opcional y nos permite definir atributos globales para el documento HTML. Recibe una prop `children` que representa el contenido de la página, y es de tipo `ReactNode`.

Acá el código del elemento raíz de este proyecto (`src/pages/_root.tsx`):

```tsx
import type { ReactNode } from "react";
import "../styles.css";

export default async function RootElement({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="es" className="min-h-screen">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/imagenes/waku.webp" />
        <meta name="description" content="Aprende Waku en en español" />
        <meta name="keywords" content="Waku, aprendizaje, tutorial" />
        <meta name="author" content="Ariel GonzAgüero" />
        <meta name="robots" content="index, follow" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Waku - en español" />
        <meta property="og:description" content="Aprende Waku en en español" />
        <meta property="og:image" content="/imagenes/waku.webp" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Waku - en español" />
        <meta name="twitter:description" content="Aprende Waku en en español" />
        <meta name="twitter:image" content="/imagenes/waku.webp" />
        <meta name="publisher" content="Gato Rojo Lab" />
      </head>
      <body data-version="1.0" className="min-h-screen">
        {children}
      </body>
    </html>
  );
}

export const getConfig = async () => {
  return {
    render: "static",
  } as const;
};
```

Este archivo se definieron metadatos globales para el sitio, muy útil para SEO y redes sociales.

#### Slices

Los slices son componentes reutilizables definidos en `src/pages/_slices`. Permiten crear páginas ensamblando componentes como componentes normales de React, a la vez que se especifican patrones de renderizado alternativos.
Cada _slice_ tiene un ID, que es igual al nombre del archivo sin la extensión `.tsx`.
Cada _slice_ exporta un componente React por defecto y una función `getConfig` para definir el renderizado (SSG o SSR).
Para usar un _slice_ en una página, se debe importar el componente `Slice` desde 'waku' y utilizarlo pasando el ID del _slice_ como prop `id`.

Acá el código de dos slices que se usan en la ruta `/paginaSeis` → [ver página aquí](/paginaSeis "enlace a la página que usa los slices"):

```tsx
// ./src/pages/_slices/seis.tsx

export default function SliceSeis() {
  return (
    <section className="flex flex-col justify-center items-center mt-10">
      <p>¿Qué tal 6 slices de pizza con hongo ostra?</p>
      <p>🍕🍕🍕🍕🍕🍕</p>
      <p className="text-3xl">😸</p>
    </section>
  );
}

export const getConfig = () => {
  return {
    render: "static", // por default es 'static', pero igual podemos especificarlo
  };
};
```

```tsx
// ./src/pages/_slices/mil/seiscientos.tsx
export default function SliceSeiscientos() {
  return (
    <section className="flex flex-col justify-center items-center mt-10">
      <p>¿Qué tal 600 slices, pero de una mini pizza?</p>
      <p>🍕 x 600</p>
      <p className="text-3xl">🙀</p>
    </section>
  );
}

export const getConfig = () => {
  return {
    render: "static",
  };
};
```

Y acá el código de la página que usa estos slices (`src/pages/paginaSeis.tsx`):

```tsx
// ./src/pages/paginaSeis.tsx
import { Slice } from "waku";

export default function PaginaSeis() {
  return (
    <div>
      <Slice id="seis" />
      <Slice id="mil/seiscientos" />
    </div>
  );
}

// como usamos 'static' debemos definir los slices que usaremos
export const getConfig = () => {
  return {
    render: "dynamic",
    slices: ["seis", "mil/seiscientos"],
  };
};
```

##### ¿En qué se diferencian los _slices_ de los componentes normales de React?

- -> Los _slices_ se definen en una ubicación específica (`src/pages/_slices`) y tienen una convención de nombres. Los componentes normales de React pueden estar en cualquier parte del proyecto, normalmente en `src/components`.
- -> Los _slices_ se renderizan por su ID, sin necesidad de importarlos. Los componentes normales se importan y usan directamente.
- -> Siempre hay que definir en la página que usa los _slices_ cuáles serán estos mediante la propiedad `slices` en `getConfig`.

Según sus necesidades y preferencias, puede optar por usar _slices_ para ciertas partes de su aplicación y componentes normales para otras, o combinarlos según lo requiera su proyecto.

##### Lazy Slices

Los lazy slices son una variante que nos permite usar _slices_ sin necesidad de definirlos en la propiedad `slices` de `getConfig`, es decir sin que se incluyan automáticamente en el HTML estático generado durante el build (SSG), sino que pueden llamarse por separado cuando se necesiten. Acá el enlace a esta sección en la documentación oficial de Waku: [Lazy Slices](https://waku.gg/#lazy-slices "Enlace a documentación oficial sobre lazy slices").
