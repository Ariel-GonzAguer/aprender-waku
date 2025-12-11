'use client';

import { useAtomValue, useSetAtom } from 'jotai'
import { amigosAtom, actividadesAtom, colorAtom, tamañoAtom } from '../stores/jotai/jotaiAtoms';

export default function Jotai() {

  const color = useAtomValue(colorAtom);
  const tamaño = useAtomValue(tamañoAtom);
  const actividades = useAtomValue(actividadesAtom);
  const amigos = useAtomValue(amigosAtom);

  return (
    <section className="flex flex-col justify-center items-center mt-6 ">
      <h2 className="text-3xl font-bold mb-4">Manejo de Estado con Jotai</h2>
      <p>La siguiente descripción (lo que está en rojo) se crea a base de 'atoms' de Jotai.</p>
      <p>Hay un gato <span className='text-red-600'>{color}</span> llamado Sundae de Caramelo, que es de tamaño <span className='text-red-600'>{tamaño}</span> y le gusta: </p>
      <ul className="list-disc list-inside">
        {actividades.map((actividad, index) => (
          <li key={index}><span className='text-red-600'>{actividad}</span></li>
        ))}
      </ul>
      <p className='mt-6'>Sus amigos son:</p>
      <ul className="list-disc list-inside">
        {amigos.map((amigo, index) => (
          <li key={index}><span className='text-red-600'>{amigo.nombre}</span> que es de color <span className='text-red-600'>{amigo.color}</span> y {amigo.pelea ? 'le gusta pelear' : 'no le gusta pelear'}</li>
        ))}
      </ul>

      <p className='mt-6 mb-2'>Este es Sundae de Caramelo:</p>
      <img src="/imagenes/sundae_1.webp" alt="foto de un lindo gato rojo llamado Sundae de Caramelo" />
    </section>
  )
}