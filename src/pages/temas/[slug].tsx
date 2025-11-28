import type { PageProps } from 'waku/router';
import { getTemaBySlug } from '../../lib/utils';
import MarkdownRenderer from '../../components/MarkdownRenderer.server';
import { Link } from 'waku/router/client';

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
            <Link to="/" className="text-blue-600 underline">Volver al inicio</Link>
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <head>
        <title>{tema.titulo}</title>
      </head>
      <div className='max-w-[85%] m-[0_auto]'>
      <MarkdownRenderer markdown={tema.contenido} />
      </div>
    </>
  );
}

export const getConfig = async () => {
  return {
    render: 'dynamic',
  } as const;
};
