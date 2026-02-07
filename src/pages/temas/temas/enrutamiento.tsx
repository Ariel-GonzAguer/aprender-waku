

// ```tsx

// ```

// ---

// #### Layouts

// Los layouts se crean con el nombre distintivo `_layout.tsx` y funcionan como "plantillas" que envuelven a las rutas y sus subrutas.
// Aceptan un prop `children` que representa el contenido de la ruta que se está renderizando dentro del layout. Esta prop es de tipo `ReactNode`.
// Aunque no es obligatorio tener un layout, suelen ser muy útiles para definir estructuras comunes como headers, footers, estados globales, proveedores globales, y más.

// Este proyecto utiliza un layout general (`src/pages/_layout.tsx`) que envuelve todas las páginas, y otro layout específico para las rutas dentro de `src/pages/gatos` (`src/pages/gatos/_layout.tsx`).

// ##### Root Layout

// Este es un layout particular. Se define en `src/pages/`, es decir `src/pages/_layout.tsx`, y envuelve todas las páginas de la aplicación.

// ##### Otros Layouts

// Podemos crear layouts específicos para rutas o grupos de rutas específicas, creando un archivo `_layout.tsx` dentro de la carpeta de la ruta. Acá un ejemplo de la documentación oficial de un layout para una ruta de blogs:

// ```tsx
// // ./src/pages/blog/_layout.tsx
// import { Sidebar } from "../../components/sidebar";

// // Crear un layout específico para la ruta /blog
// export default async function BlogLayout({ children }) {
//   return (
//     <div className="flex">
//       <div>{children}</div>
//       <Sidebar />
//     </div>
//   );
// }

// export const getConfig = async () => {
//   return {
//     render: "static",
//   } as const;
// };
// ```

// #### Elemento _Root_ / Elemeto _Raíz_

// Los atributos de los elementos `<html>`, `<head>` o `<body>` se pueden personalizar con la API del elemento Raíz/Root.
// Para esto podemos crear un archivo `src/pages/_root.tsx`. Este archivo es opcional y nos permite definir atributos globales para el documento HTML. Recibe una prop `children` que representa el contenido de la página, y es de tipo `ReactNode`.

// Acá el código del elemento raíz de este proyecto (`src/pages/_root.tsx`):

// ```tsx
// import type { ReactNode } from "react";
// import "../styles.css";

// export default async function RootElement({
//   children,
// }: {
//   children: ReactNode;
// }) {
//   return (
//     <html lang="es" className="min-h-screen">
//       <head>
//         <meta charSet="utf-8" />
//         <meta name="viewport" content="width=device-width, initial-scale=1" />
//         <link rel="icon" href="/imagenes/waku.webp" />
//         <meta name="description" content="Aprende Waku en en español" />
//         <meta name="keywords" content="Waku, aprendizaje, tutorial" />
//         <meta name="author" content="Ariel GonzAgüero" />
//         <meta name="robots" content="index, follow" />
//         <meta property="og:type" content="website" />
//         <meta property="og:title" content="Waku - en español" />
//         <meta property="og:description" content="Aprende Waku en en español" />
//         <meta property="og:image" content="/imagenes/waku.webp" />
//         <meta name="twitter:card" content="summary_large_image" />
//         <meta name="twitter:title" content="Waku - en español" />
//         <meta name="twitter:description" content="Aprende Waku en en español" />
//         <meta name="twitter:image" content="/imagenes/waku.webp" />
//         <meta name="publisher" content="Gato Rojo Lab" />
//       </head>
//       <body data-version="1.0" className="min-h-screen">
//         {children}
//       </body>
//     </html>
//   );
// }

// export const getConfig = async () => {
//   return {
//     render: "static",
//   } as const;
// };
// ```

// Este archivo se definieron metadatos globales para el sitio, muy útil para SEO y redes sociales.

// #### Slices

// Los slices son componentes reutilizables definidos en `src/pages/_slices`. Permiten crear páginas ensamblando componentes como componentes normales de React, a la vez que se especifican patrones de renderizado alternativos.
// Cada _slice_ tiene un ID, que es igual al nombre del archivo sin la extensión `.tsx`.
// Cada _slice_ exporta un componente React por defecto y una función `getConfig` para definir el renderizado (SSG o SSR).
// Para usar un _slice_ en una página, se debe importar el componente `Slice` desde 'waku' y utilizarlo pasando el ID del _slice_ como prop `id`.

// Acá el código de dos slices que se usan en la ruta `/paginaSeis` → [ver página aquí](/paginaSeis "enlace a la página que usa los slices"):

// ```tsx
// // ./src/pages/_slices/seis.tsx

// export default function SliceSeis() {
//   return (
//     <section className="flex flex-col justify-center items-center mt-10">
//       <p>¿Qué tal 6 slices de pizza con hongo ostra?</p>
//       <p>🍕🍕🍕🍕🍕🍕</p>
//       <p className="text-3xl">😸</p>
//     </section>
//   );
// }

// export const getConfig = () => {
//   return {
//     render: "static", // por default es 'static', pero igual podemos especificarlo
//   };
// };
// ```

// ```tsx
// // ./src/pages/_slices/mil/seiscientos.tsx
// export default function SliceSeiscientos() {
//   return (
//     <section className="flex flex-col justify-center items-center mt-10">
//       <p>¿Qué tal 600 slices, pero de una mini pizza?</p>
//       <p>🍕 x 600</p>
//       <p className="text-3xl">🙀</p>
//     </section>
//   );
// }

// export const getConfig = () => {
//   return {
//     render: "static",
//   };
// };
// ```

// Y acá el código de la página que usa estos slices (`src/pages/paginaSeis.tsx`):

// ```tsx
// // ./src/pages/paginaSeis.tsx
// import { Slice } from "waku";

// export default function PaginaSeis() {
//   return (
//     <div>
//       <Slice id="seis" />
//       <Slice id="mil/seiscientos" />
//     </div>
//   );
// }

// // como usamos 'static' debemos definir los slices que usaremos
// export const getConfig = () => {
//   return {
//     render: "dynamic",
//     slices: ["seis", "mil/seiscientos"],
//   };
// };
// ```

// ##### ¿En qué se diferencian los _slices_ de los componentes normales de React?

// - -> Los _slices_ se definen en una ubicación específica (`src/pages/_slices`) y tienen una convención de nombres. Los componentes normales de React pueden estar en cualquier parte del proyecto, normalmente en `src/components`.
// - -> Los _slices_ se renderizan por su ID, sin necesidad de importarlos. Los componentes normales se importan y usan directamente.
// - -> Siempre hay que definir en la página que usa los _slices_ cuáles serán estos mediante la propiedad `slices` en `getConfig`.

// Según sus necesidades y preferencias, puede optar por usar _slices_ para ciertas partes de su aplicación y componentes normales para otras, o combinarlos según lo requiera su proyecto.

// ##### Lazy Slices

// Los lazy slices son una variante que nos permite usar _slices_ sin necesidad de definirlos en la propiedad `slices` de `getConfig`, es decir sin que se incluyan automáticamente en el HTML estático generado durante el build (SSG), sino que pueden llamarse por separado cuando se necesiten. Acá el enlace a esta sección en la documentación oficial de Waku: [Lazy Slices](https://waku.gg/#lazy-slices "Enlace a documentación oficial sobre lazy slices").

// [Siguiente: 4-navegacion →](/temas/4-navegacion)

// [← Volver](/temas/2-renderizado)

import BotonesAvance from '../../../components/BotonesAvance';
import CodeBlock from '../../../components/CodeBlock';
import { Link } from 'waku';

export default function Enrutamiento() {

  const data = {
    titulo: "3-Enrutamiento",
    autor: "Ariel",
    fecha: "7-2-2026",
    tags: ["waku", "enrutamiento", "rutas", "guía"]
  };

  const codigo = {
    layout: `// src/pages/_layout.tsx    

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
 `,

    slug: ` // src/pages/temas/[slug].tsx

 import type { PageProps } from 'waku/router';
 import { Suspense } from 'react';
 import { getComponentBySlug } from '../../utils/getComponentBySlug';
 import { getStaticPaths } from '../../utils/getStaticPaths';
 
 export default async function PostDetail({ slug }: PageProps<'/temas/[slug]'>) {
   const Componente = getComponentBySlug({slug, modulo: "temas"});
 
   if (!Componente) {
     return (
       <section aria-label='Tema no encontrado' className='flex flex-col justify-center items-center mt-25'>
         <h1 aria-live="polite">Tema no encontrado</h1>
         <p aria-live="polite">Lo sentimos, el tema que buscas no existe.</p>
       </section>
     );
   }
 
   return (
     <Suspense fallback={
       <section aria-label='Cargando tema...' className='flex flex-col justify-center items-center mt-25'>
         <p aria-live="polite">Cargando contenido del tema...</p>
         <img aria-live='polite' src="/loaders/OrangeCat_SVG.svg" alt="Imagen de carga que muestra un gatito rojo girando." />
       </section>}
     >
       <div className='max-w-[85%] m-[0_auto] break-normal'>
         {Componente && <Componente />}
       </div>
     </Suspense>
   );
 }
 
 export const getConfig = async () => {
   return {
     render: 'static',
     staticPaths: await getStaticPaths(),
   } as const;
 };
 `,

    index: `// src/pages/index.tsx
 
export default async function HomePage() {
  return (
    <>
      <meta name="keywords" content="Waku, aprendizaje, tutorial" />

      <section id='página-inicial' className="flex flex-col justify-center items-center text-center text-balance flex-1 w-full">
        <h1 className="text-5xl font-bold my-6">Waku en español</h1>
        <p className="mb-4">Esta es la primera guía en español para aprender el framework minimalista, React-First, basado en React Server Componentes: <a href="https://wakujs.gg/" target="_blank" rel="noopener noreferrer" className="font-bold text-red-600 text-3xl hover:text-amber-300 transition-all duration-300"> <br />
          Waku</a>.</p>
        <p className="mb-4">Puede visitar el repositorio de este sitio web acá → <a href="https://github.com/Ariel-GonzAguer/aprender-waku" target="_blank" rel="noopener noreferrer" className="font-bold text-amber-300 hover:text-red-600 transition-all duration-300">Repositorio en Github</a>.</p>
        <img src="/imagenes/waku.webp" alt="ícono de Waku" className="mt-4" />
        <p>Nota: esta guía cubre la versión 1.0.0-alpha.3 de Waku.</p>
      </section>
    </>

  )
}

export const getConfig = async () => {
  return {
    render: 'static',
  } as const
}
 `,
    libGatos: `// src/lib/gatos.ts
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
};
`,
    slugGatos: `// src/pages/gatos/[slug].tsx
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
        alt={"Mejor amigo de " + gato.nombre}
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
,
`,
    libPokemon: `// src/lib/pokemon.ts
/**
 * Obtiene los datos de un Pokémon específico por su ID.
 *
 * Realiza una consulta a la PokéAPI para obtener la información completa del Pokémon
 * y la transforma en un objeto con propiedades útiles incluyendo generación y región.
 *
 * @param {number} id - El ID del Pokémon a obtener (basado en la PokéDex nacional)
 * @returns {Promise<Record<string, any> | null>} Una promesa que se resuelve con un objeto
 * contiendo los datos del Pokémon:
 * - 'nombre': Nombre del Pokémon
 * - 'tipos': Array de tipos del Pokémon
 * - 'imagen': URL de la imagen frontal del Pokémon
 * - 'id': ID del Pokémon
 * - 'fullStats': Array completo de estadísticas del Pokémon
 * - 'peso': Peso del Pokémon en kilogramos
 * - 'altura': Altura del Pokémon en metros
 * - 'generacion': Generación a la que pertenece (primera a octava)
 * - 'region': Región asociada al Pokémon (kanto, johto, hoenn, sinnoh, unova, kalos, alola, galar)
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
  const response = await fetch(\`https://pokeapi.co/api/v2/pokemon/\${id}\`);
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
  console.log("Pokémon encontrado:", objetoPokemon);
  return objetoPokemon;
};
`,
    slugPokemon: `// src/pages/pokemones/[generacion]/[region]/[id].tsx
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
                    style={{ width: \`\${Math.min(stat.base_stat / 2.5, 100)}%\` }}
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
`,
    ejemploWaku: `// ./src/pages/shop/[category]/[product].tsx
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
`,

  }

  return (
    <>
      <>
        <title>{data.titulo}</title>
        <meta name="author" content={data.autor} />
        <meta name="keywords" content={data.tags.join(", ")} />
        <meta name="date" content={data.fecha} />
      </>

      <section className='tema'>
        <h2>{data.titulo}</h2>
        <p className='italic mb-3'>por {data.autor} - {data.fecha}</p>
        <p><strong>Nota: Esta es la sección más extensa de la guía.</strong></p>
        <hr />

        <h3>Introducción</h3>
        <p>Lo primero: Los componentes de página deben escribirse con letra minúscula para evitar errores al generarse las URL.</p>

        <p>Desde la versión 1.0.0 Waku nos da dos formas de definir rutas.</p>
        <ul>
          <li>→ Basada en archivos/carpetas.</li>
          <li>→ Basada en configuración.</li>
        </ul>

        <p>En esta guía nos centraremos en el enrutamiento basado en archivos. Para más info sobre el enrutamiento basado en configuración, ver <a href="https://waku.gg/#routing" rel="noopener noreferrer" target="_blank">esta sección de la documentación oficial</a> y seleccionar la opción de Config-Based.</p>

        <p>Cada archivo `.tsx` dentro de la carpeta `src/pages` se convertirá una ruta de nuestra aplicación. Así de fácil. Por ejemplo: `src/pages/gatos.tsx` → será la ruta `/gatos`. `src/pages/acercade.tsx` → será la ruta `/acercade`.</p>
        <p>Cada ruta puede tener su propio layout, o podemos usar uno común para varias o todas las rutas.</p>
        <p>Acá un ejemplo del layout general para este proyecto:</p>

        <CodeBlock>
          {codigo.layout}
        </CodeBlock>

        <p>Nótese que el layout importa dos Server Components, para el header y el footer, que se renderizan estáticamente (SSG).</p>
        <p> El layout toma una prop `children` que representa el contenido de cada página que se muestra dentro del layout, el contenido puede ser estático o dinámico, con Client Components y Server Components.</p>
        <p>Este layout puede usarse tanto en rutas estáticas como dinámicas.</p>

        <p>Acá podemos ver el código para la ruta de la página de inicio:</p>

        <CodeBlock>
          {codigo.index}
        </CodeBlock>

        <p>El archivo `index.tsx` representa la página principal o raíz de la aplicación siempre, y su ruta será `/`.</p>

        <h3>Páginas</h3>

        <p>Las páginas se encargan de renderizar una sola ruta, ya sea básica, segmentada, dinámica o "catch-all", basadas en la estructura de archivos dentro de `src/pages`, siguiendo las convenciones indicadas a continuación. Además, todos los componentes de página reciben automáticamente dos props: `path` (string) y `query` (string).</p>

        <h4>Rutas básicas (Single Routes)</h4>

        <p>Estas rutas se pueden crear de dos formas:</p>

        <ul>
          <li>→ Creando un archivo `.tsx` dentro de `src/pages` con el nombre de la ruta. Por ejemplo, `src/pages/gatos.tsx` crea la ruta `/gatos`.</li>
          <li>→ Creando una carpeta dentro de `src/pages` con el nombre de la ruta, y dentro de esa carpeta un archivo `index.tsx`. Por ejemplo, `src/pages/temas-felinos/index.tsx` crea la ruta `/temas-felinos`.</li>
        </ul>

        <h4>Rutas segmentadas (Segmented Routes)</h4>

        <p>Estas rutas (que también podríamos llamar rutas dinámicas) se definen creando archivos o carpetas con nombres entre parentesis cuadrados `[ ]`, que representan un segmento dinámico de la ruta. Por ejemplo:</p>

        <ul>
          <li>→ `src/pages/temas/temas/[slug].tsx` crea rutas como `/temas/temas/enrutamiento`, `/temas/temas/metadata`, etc., donde `slug` es un parámetro dinámico que puede tomar cualquier valor.</li>
          <li>→ `src/pages/gatos/[slug]/index.tsx` crea rutas como `/gatos/rojizo/index`, `/gatos/vaca/index`, etc.</li>
        </ul>

        <p>Este tipo de componente necesita importar el tipo `PageProps` desde `waku` para tipar las props que recibe.<br />
          También puede decidir si es SSG o SSR mediante `getConfig`. Si se elige SSG, es necesario agregar la propiedad `staticPaths` en `getConfig`, el cual es un array con las rutas que se desean prerenderizar estáticamente.
        </p>

        <p>Para trabajar con el valor dinámico `slug` por lo general se utiliza alguna función que obtenga los datos desde algún lugar (archivos en el repo, base de datos, API, etc.) y retorne el valor correspondiente.</p>

        <p>Por ejemplo, para este proyecto se creó un archivo `src/lib/gatos.ts` con un array de objetos con data de gatos, y una función para obtener la data de un gato por su slug. Esta función se importa en el componente de ruta dinámica (`src/pages/gatos/[slug]/index.tsx`) para obtener la data del gato correspondiente al slug de la ruta.</p>


        <p>Acá el código del archivo con la data de gatos y la función para obtener la data por slug (`src/lib/gatos.ts`):</p>
        <CodeBlock>
          {codigo.libGatos}
        </CodeBlock>

        <p>Acá el código del componente de ruta dinámica para cada gato:</p>
        <CodeBlock>
          {codigo.slugGatos}
        </CodeBlock>

        <h4>Rutas segmentadas anidadas (Nested Segmented Routes)</h4>

        <p>Las rutas pueden tener multiples segmentos, por ejemplo `/pokemones/[generacion]/[region]/[id]`, que se define creando, en este ejemplo, una carpeta `pokemones` dentro de `src/pages`, y dentro de esa carpeta otra llamada `[generacion]`, y dentro de esta otra llamada `[region]`, y dentro de esta otra carpeta un archivo `[id].tsx`.</p>

        <p>Pruebe con las siguientes rutas para ver el resultado:</p>
        <ul>
          <li><Link to="/pokemones/primera/kanto/4">→ /pokemones/primera/kanto/4</Link> </li>
          <li><Link to="/pokemones/segunda/johto/133">→ /pokemones/segunda/johto/133</Link></li>
          <li><Link to="/pokemones/primera/kanto/133">→ /pokemones/primera/kanto/133</Link></li>
        </ul>

        <p>Acá el código del archivo que nos retorna la data de los pokemones:</p>
        <CodeBlock>
          {codigo.libPokemon}
        </CodeBlock>

        <p>Y acá el código del componente de ruta segmentada anidada para cada Pokémon:</p>
        <CodeBlock>
          {codigo.slugPokemon}
        </CodeBlock>

        <p>Notemos que en esta ruta `getConfig` tiene su propiedad `render` definida como `dynamic`, esto hará que la página se renderice de forma dinámica en cada solicitud, lo que va a ejecutar una función en el servidor para obtener los datos en cada petición. Esto es importante tenerlo en cuenta en la plataforma donde se despliega la aplicación. Por ejemplo, en Netlify, esto ejecutaría una función serverless.</p>

        <p>Ahora, si queremos usar SSG en rutas segmentadas anidadas, debemos definir la propiedad `staticPaths` en `getConfig`, que ahora será un array con los arrays de segmentos.</p>
        <p>Acá este ejemplo de la documentación oficial de Waku:</p>
        <CodeBlock>
          {codigo.ejemploWaku}
        </CodeBlock>

        <h4>Rutas catch-all (Catch-All Routes)</h4>

        <p>También son conocidas como rutas "wildcard", son definidas creando un archivo o carpeta usando tres puntos `...` dentro de los paréntesis cuadrados `[]`, por ejemplo `[...catchAll]`, y tienen una indefinida cantidad de segmentos en la ruta, y no correspondan a una ruta ya definida.</p>
        <p>Esta es una ruta que captura **todos** los segmentos que sigan a un punto determinado del path.</p>
        <p>Reciben una prop que es un array con los segmentos como un array ordenado de strings.</p>

        <p>Por ejemplo, `src/pages/docs/[...slug].tsx` crea rutas como `/docs/tema-1`, `/docs/carpeta/tema-2`, `/docs/carpeta/subcarpeta/tema-3`, etc., donde `slug` es un array que contiene **todos** los segmentos después de `/docs/`.</p>

        <p>Haga click <Link to="/pizzas/vegana/pesto/con-aceitunas">en este enlace</Link> para ver qué captura la ruta catch-all. Puede probar cambiando los parámetros en la URL.</p>

        <h5>¿Cuándo usar rutas catch-all?</h5>
        <ul>
          <li>→ Documentación o blogs con muchísimas rutas anidadas: No creamos un archivo por cada carpeta. Una sola ruta catch-all controla todas.</li>
          <li>→ CMS o Markdown donde cada archivo define su propia estructura: La ruta catch-all puede mapear directamente la estructura del contenido.</li>
          <li>→ Proyectos multilenguaje: Con un solo archivo capturas la ruta completa: <br />
            ▬ /docs/es/setup<br />
            ▬ /docs/fr/setup<br />
            ▬ /docs/en/setup<br />
          </li>
          <li>→ Sitios donde las URLs pueden cambiar o ser generadas por las personas usuarias.</li>
        </ul>

        <h4>Rutas grupales</h4>

        <p>Estas rutas permiten agrupar rutas de manera lógica sin afectar la estructura de la URL.</p>
        <p>Se definen creando carpetas con nombres entre paréntesis `({" "})`, por ejemplo `(admin)`, dentro de `src/pages`.</p>
        <p>Para este proyecto se crearon dos rutas grupales de ejemplo, que están dentro de la carpeta `src/pages/(grupales)`:</p>

        <ul>
          <li>→ `src/pages/(grupales)/pagina-grupal-estatica.tsx` crea la ruta `/pagina-grupal-estatica`. Vea la ruta siguiendo <Link to="/pagina-grupal-estatica">este enlace</Link>.</li>
          <li>→ `src/pages/(grupales)/pagina-grupal-cliente.tsx` crea la ruta `/pagina-grupal-cliente`. Vea la ruta siguiendo <Link to="/pagina-grupal-cliente">este enlace</Link>.</li>
        </ul>

        <p>Las rutas grupales son útiles para organizar aplicaciones complejas donde ciertas páginas comparten layouts, middlewares o configuraciones comunes, sin que esto afecte las URLs públicas del sitio. Puede visitar la documentación oficial de Waku para más detalles sobre rutas grupales <a href="https://waku.gg/#group-routes" title="Enlace a documentación oficial sobre rutas grupales" target="_blank" rel="noopener noreferrer">acá</a>.</p>

        <h4>Rutas ignoradas</h4>

        <p>Las siguientes carpetas son ignoradas por el enrutador de Waku y no se convierten en rutas:</p>

        <ul>
          <li>→ `_components`</li>
          <li>→ `_hooks`</li>
        </ul>


        <p>Cualquier archivo o carpeta dentro de ellas, será excluida del enrutamiento.</p>
        <p>Veamos este ejemplo de la documentación oficial:</p>
        <div className='m-[0_auto] self-center'>
          <p className='text-left'>
            pages/ <br />
            ├── about.tsx <br />
            ├── _components/ <br />
            │   ├── header.tsx   // ignorada <br />
            │   ├── footer.tsx   // ignorada <br />
            │   ├── ...          // ignorada <br />
          </p>
        </div>

        <BotonesAvance
          rutaSiguiente="/temas/temas/navegacion"
          rutaAnterior="/temas/temas/renderizado"
          textoSiguiente="4-Navegación"
          textoAnterior="2-Renderizado"
        />
      </section>
    </>
  )
}