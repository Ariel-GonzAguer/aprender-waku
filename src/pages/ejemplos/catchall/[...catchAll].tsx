import type { PageProps } from 'waku/router';

/**
 * Ejemplo de ruta catch-all (captura todos los segmentos)
 * 
 * Ruta: /ejemplos/catchall/[...catchAll]
 * 
 * Captura todos los segmentos de URL después de /ejemplos/catchall/
 * 
 * Ejemplos:
 * - /ejemplos/catchall/uno → catchAll = ["uno"]
 * - /ejemplos/catchall/uno/dos → catchAll = ["uno", "dos"]
 * - /ejemplos/catchall/uno/dos/tres → catchAll = ["uno", "dos", "tres"]
 */

export default async function CatchAllExample({
  catchAll,
}: PageProps<'/ejemplos/catchall/[...catchAll]'>) {
  const segmentos = Array.isArray(catchAll) ? catchAll : [catchAll];
  const rutaCompleta = segmentos.join('/');

  return (
    <section className='flex flex-col justify-center items-center mt-10 max-w-4xl mx-auto p-8'>
      <div className='bg-purple-900 rounded-lg shadow-xl p-8 w-full'>
        <h1 className='text-4xl font-bold mb-6 text-purple-200'>
          Ejemplo de Ruta Catch-All
        </h1>
        
        <p className='text-lg mb-6 text-gray-200'>
          Esta ruta captura <strong>todos los segmentos</strong> después de{' '}
          <code className='bg-purple-950 px-2 py-1 rounded'>/ejemplos/catchall/</code>
        </p>

        <div className='bg-purple-950 rounded-lg p-6 mb-6'>
          <h2 className='text-2xl font-semibold mb-4 text-purple-300'>
            Información de la Ruta
          </h2>
          
          <div className='space-y-3 text-sm'>
            <div className='flex gap-3'>
              <span className='font-semibold text-purple-400 min-w-[140px]'>
                URL completa:
              </span>
              <code className='bg-black px-3 py-1 rounded flex-1 text-green-400'>
                /ejemplos/catchall/{rutaCompleta || '(vacío)'}
              </code>
            </div>

            <div className='flex gap-3'>
              <span className='font-semibold text-purple-400 min-w-[140px]'>
                Total segmentos:
              </span>
              <span className='text-white'>{segmentos.length}</span>
            </div>

            <div className='flex gap-3'>
              <span className='font-semibold text-purple-400 min-w-[140px]'>
                Patrón de archivo:
              </span>
              <code className='text-yellow-300'>[...catchAll].tsx</code>
            </div>
          </div>
        </div>

        <div className='mb-6'>
          <h2 className='text-2xl font-semibold mb-4 text-purple-300'>
            Segmentos Capturados
          </h2>
          
          {segmentos.length > 0 ? (
            <div className='space-y-2'>
              {segmentos.map((segmento, index) => (
                <div
                  key={index}
                  className='flex items-center gap-4 bg-purple-800 p-4 rounded-lg'
                >
                  <span className='bg-purple-600 text-white px-3 py-1 rounded-full font-bold min-w-10 text-center'>
                    {index}
                  </span>
                  <span className='font-mono text-lg text-purple-100'>
                    {segmento}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className='bg-yellow-900 border-l-4 border-yellow-500 p-4 rounded text-yellow-200'>
              <p className='mb-2'>
                ⚠️ No hay segmentos capturados. Intenta agregar partes a la URL:
              </p>
              <code className='text-sm text-yellow-300 block'>
                /ejemplos/catchall/primer/segundo/tercer/segmento
              </code>
            </div>
          )}
        </div>

        <div className='bg-black rounded-lg p-4 mb-6'>
          <p className='text-sm text-gray-400 mb-2'>Datos capturados (JSON):</p>
          <pre className='text-pink-200 text-sm overflow-x-auto'>
            {JSON.stringify(catchAll, null, 2)}
          </pre>
        </div>

        <div className='bg-blue-900 border-l-4 border-blue-400 p-4 rounded'>
          <p className='text-blue-200 font-semibold mb-2'>💡 Casos de uso:</p>
          <ul className='text-sm text-blue-100 space-y-1 list-disc list-inside'>
            <li>Sistemas de archivos virtuales</li>
            <li>Documentación con rutas anidadas arbitrarias</li>
            <li>Breadcrumbs dinámicos</li>
            <li>Rutas de categorías infinitas</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export const getConfig = async () => {
  return {
    render: 'dynamic',
  } as const;
};
