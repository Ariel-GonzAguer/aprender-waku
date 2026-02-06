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
