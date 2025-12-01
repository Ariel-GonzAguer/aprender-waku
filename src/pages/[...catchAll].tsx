import type { PageProps } from 'waku/router';

export default async function CatchAllRoute({
  catchAll,
}: PageProps<'/[...catchAll]'>) {
  return (
    <section title='Ruta ...catch all' className='flex flex-col justify-center items-center mt-10 text-xl'>
      <h1>Rutas dinámicas</h1>

      <p>Segmentos capturados:</p>
      <pre className='text-pink-200'>{JSON.stringify(catchAll, null, 2)}</pre>
    </section>
  );
}

export const getConfig = async () => {
  return {
    render: 'dynamic',
  } as const;
};
