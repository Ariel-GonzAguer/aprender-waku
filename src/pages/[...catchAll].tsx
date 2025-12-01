import type { PageProps } from 'waku/router';

export default async function CatchAllRoute({
  catchAll,
}: PageProps<'/app/[...catchAll]'>) {
  return (
    <div>
      <h1>Rutas dinámicas</h1>

      <p>Segmentos capturados:</p>
      <pre>{JSON.stringify(catchAll, null, 2)}</pre>
    </div>
  );
}

export const getConfig = async () => {
  return {
    render: 'dynamic',
  } as const;
};
