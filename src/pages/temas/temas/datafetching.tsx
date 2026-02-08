// [Siguiente: 11-mutaciones →](/temas/11-mutaciones)

// [← Volver](/temas/9-sistema-de-archivos)

import BotonesAvance from '../../../components/BotonesAvance';
import CodeBlock from '../../../components/CodeBlock';
import RenderTemaData from "../../../components/RenderTemaData";

export default function DataFetching() {

  const data = {
    titulo: "10-Data Fetching",
    autor: "Ariel",
    fecha: "7-12-2025",
    tags: ["waku", "guía", "data fetching"]
  };

  const codigo = {
    slug: `// src/pages/temas/[slug].tsx
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
        <p aria-live="polite">Lo sentimos, el tema que busca no existe.</p>
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
`

  };


  return (
    <>
      <RenderTemaData data={data} />

      <section className='tema'>

        <h3>Del lado del servidor (Server Side)</h3>
        <p>Todos los patrones de Data Fetching (Fetch directo, Componentes aislados con `Suspense`, islas, etc.) son soportados en Waku.</p>

        <p>En este proyecto podemos ver un ejemplo de Data Fetching directo en un Server Component en el archivo `src/pages/temas/[slug].tsx`:</p>

        <CodeBlock>
          {codigo.slug}
        </CodeBlock>

        <h3>Del lado del cliente (Client Side)</h3>

        <p>Para mejorar la UX se recomienda hacer Data Fetching en el servidor, pero aún así, cualquier librería de Data Fetching del lado del cliente (SWR, React Query, Apollo Client, etc.) o la clásica Fetch API puede ser utilizada en Waku sin problemas.</p>

        <BotonesAvance
          rutaSiguiente="/temas/temas/mutaciones"
          rutaAnterior="/temas/temas/sistemadearchivos"
          textoSiguiente="11-Mutaciones"
          textoAnterior="9-Sistema de Archivos"
        />
      </section>
    </>
  )
};
