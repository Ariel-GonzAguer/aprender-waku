'use client';

import { useAtomValue, useSetAtom } from 'jotai'
import { amigosAtom, actividadesAtom, colorAtom, tamañoAtom } from '../stores/jotai/jotaiAtoms';

export default function Jotai() {

  const color = useAtomValue(colorAtom);
  const tamaño = useAtomValue(tamañoAtom);
  const actividades = useAtomValue(actividadesAtom);
  const amigos = useAtomValue(amigosAtom);
  const setAmigos = useSetAtom(amigosAtom);

  function agregarAmigoFelino(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const nombre = formData.get('nombre');
    const color = formData.get('color');
    const pelea = formData.get('pelea') === 'on' ? true : false;
    if (typeof nombre === 'string' && typeof color === 'string') {
      const nuevoAmigo = { nombre, color, pelea };
      setAmigos([...amigos, nuevoAmigo]);
      event.currentTarget.reset();
    }
  }

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

      <form onSubmit={agregarAmigoFelino} className="mt-6 flex flex-col justify-center items-center">
        <h3 className="text-xl font-bold mb-2">Agregar un nuevo amigo felino</h3>
        <label htmlFor="nombre" className="mb-2 mr-4">Nombre:</label>
        <input type="text" name="nombre" required className='bg-white text-black' />

        <label htmlFor="color" className="mb-2"> Color: </label>
        <input type="text" name="color" required className='bg-white text-black' />

        <fieldset>
          <legend>¿Le gusta pelear?</legend>
          <label htmlFor="si-pelea">Sí</label>
          <input type="radio" id="si-pelea" name="pelea" />
          <label htmlFor="no-pelea" className="ml-4">No</label>
          <input type="radio" id="no-pelea" name="pelea" defaultChecked />
        </fieldset>

        <button type="submit" className="bg-amber-300 px-4 py-2 rounded cursor-pointer text-black hover:scale-110 transition-all duration-300 ease-in-out">Agregar Amigo</button>
      </form>
    </section>
  )
}