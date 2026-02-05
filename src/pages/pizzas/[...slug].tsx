import type { PageProps } from 'waku/router';

// Create dashboard page
export default async function Pizzas({
  slug,
}: PageProps<'/pizzas/[...slug]'>) {
  return (
    <section className='flex flex-col justify-center items-center mt-10 text-3xl'>
      <h2 className='text-amber-300 mb-6'>Esta es una ruta `catch-all`.</h2>
      <p className='mb-10'> Abajo se muestran los segmentos capturados.</p>
      <p>segmentos:</p>
      <p>{slug.join('/')}</p>
    </section>
  );
}

export const getConfig = async () => {
  return {
    render: 'dynamic',
  } as const;
};  
