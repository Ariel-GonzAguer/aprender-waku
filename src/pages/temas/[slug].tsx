import type { PageProps } from 'waku/router';
import { getTemaBySlug } from '../../lib/utils';
import MarkdownRenderer from '../../components/MarkdownRenderer.server';
import { Suspense } from 'react';

export default async function PostDetail({ slug }: PageProps<'/temas/[slug]'>) {
  const tema = await getTemaBySlug(slug);

  if (!tema) {
    return (
      <>
        <head>
          <title>Tema no encontrado</title>
        </head>
        <div className="p-8">
          <h1>Tema no encontrado</h1>
          <p>El tema <code>{slug}</code> no existe.</p>
          <p>
            <a href="/" className="text-blue-600 underline">Volver al inicio</a>
          </p>
        </div>
      </>
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
        <MarkdownRenderer markdown={tema.contenido} />
      </div>
    </Suspense>
  );
}

export const getConfig = async () => {
  return {
    render: 'static',
    staticPaths: ['0-intro', '1-primerosPasos', '2-renderizado', '3-enrutamiento', '4-navegacion', '5-manejoDeErrores', '6-meta-data', '7-estilos','8-staticAssets', '9-sistemaDeArchivos', '10-dataFetching', '11-mutaciones', '12-manejoDeEstado', '13-variablesDeEntorno', '14-despliegue']
  } as const;
};
