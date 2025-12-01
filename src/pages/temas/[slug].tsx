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
    <Suspense fallback={<div className='flex flex-col justify-center items-center mt-25'>Cargando contenido del tema...</div>}>
      <div className='max-w-[85%] m-[0_auto]'>
      <MarkdownRenderer markdown={tema.contenido} />
      </div>
    </Suspense>
  );
}

export const getConfig = async () => {
  return {
    render: 'dynamic',
  } as const;
};
