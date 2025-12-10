'use client';

import { useRouter } from 'waku';

export default function Router() {
  const { path, query } = useRouter();
  const router = useRouter();

  return (
    <section className='flex flex-col justify-center items-center my-10 text-xl'>
      <p className='mb-6'>Ruta actual: {path}</p>
      <p className='mb-6'>Parámetros de consulta: {JSON.stringify(query)}</p>

      <button className='text-black py-5 px-4 mb-4 border-2 border-red-600 bg-amber-400 rounded' onClick={() => router.push('/temas/4-navegacion')}>Ir al tema 4-navegación</button>
      <button className='text-black py-5 px-4 border-2 border-red-600 bg-amber-400 rounded' onClick={() => { alert('Recargando...'); router.reload() }}>Recargar</button>
    </section>
  )
}
