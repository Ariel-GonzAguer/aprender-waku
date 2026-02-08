import BotonesAvance from '../../../components/BotonesAvance';
import CodeBlock from '../../../components/CodeBlock';
import { Link } from 'waku';
import RenderTemaData from "../../../components/RenderTemaData";

export default function ManejoDeEstado() {

  const data = {
    titulo: "12-Manejo de estado",
    autor: "Ariel",
    fecha: "30-11-2025",
    tags: ["waku", "guía", "manejo de estado"]
  };

  const codigo = {
    pnpmZustand: `pnpm add zustand`,
    pnpmJotai: `pnpm add jotai`,
    zustandStore: `// src/stores/zustand/useZustandStore.ts
"use client";
    
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
    
// importar y agregar tipos correspondientes
interface ZustandStore {
  gatos: number;
  incrementarGatos: () => void;
  decrementarGatos: () => string;
  reiniciarStore: () => void;
}
    
const useZustandStore = create<ZustandStore>()(
  //cambiar nombre
  persist(
    immer((set) => ({
      // estados
      gatos: 0,

      // acciones
      incrementarGatos: () =>
        set((state: any) => {
          state.gatos += 1;
        }),

      decrementarGatos: () =>
        "No se puede decrementar gatos ¿Por qué querría hacer eso? 🐱",

      reiniciarStore: () =>
        set(() => ({
          gatos: 0,
        })),
    })),
    { name: "zustand-gatos-storage" } //Este es el nombre del local storage → cambiar nombre
  )
);
    
export default useZustandStore;
`,
    zustandCliente: `// src/components/Zustand.client.tsx
"use client";

import useZustandStore from "../stores/zustand/useZustandStore";
import { useState, useEffect } from "react";

export default function Zustand() {
  const { gatos, incrementarGatos, decrementarGatos, reiniciarStore } = useZustandStore();
  const [localGatos, setLocalGatos] = useState('');

  useEffect(() => {
    if (gatos === 0) setLocalGatos('');
    for (let i = 0; i < gatos; i++) {
      setLocalGatos(localGatos + '🐱');
    }
  }, [gatos]);

  return (
    <section className="flex flex-col justify-center items-center mt-6">
      <h2 className="text-3xl font-bold">Manejo de Estado con Zustand</h2>
      <p className="my-4">Número de gatos en la store de Zustand: {gatos} {localGatos.length > 0 ? localGatos : ''}</p>
      <button
        className="bg-amber-300 hover:bg-red-600 hover:text-white transition-colors ease-in-out cursor-pointer text-black font-bold py-2 px-4 rounded mb-6"
        onClick={incrementarGatos}
      >
        Incrementar Gatos
      </button>
      <button
        className="bg-red-600 hover:bg-amber-300 hover:text-black transition-colors ease-in-out cursor-pointer text-white font-bold py-2 px-4 rounded"
        onClick={() => alert(decrementarGatos())}
      >
        Decrementar Gatos
      </button>
      <button
        className="bg-pink-300 hover:bg-gray-700 text-black hover:text-white transition-colors ease-in-out cursor-pointer font-bold py-2 px-4 rounded mt-6"
        onClick={reiniciarStore}
      >
        Reiniciar Store
      </button>
    </section>
  );
}; 
`,
    jotaiStore: `// src/stores/jotai/jotaiAtoms.ts
import { atom } from 'jotai'

export const colorAtom = atom('rojizo')

export const tamañoAtom = atom('mediano')

export const actividadesAtom = atom(['dormir', 'comer', 'dormir después de comer'])

export const amigosAtom = atom([
  {
    nombre: 'Gandalf',
    color: 'gris',
    pelea: true
  },
  {
    nombre: 'Campanita',
    color: 'calico',
    pelea: false
  }
]) 
`,
    jotaiCliente: `// src/components/Jotai.tsx
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
};
`,

  };

  return (
    <>
      <RenderTemaData data={data} />

      <section className='tema'>

        <h3>Introducción</h3>
        <p>La guía oficial recomienda usar <a href="https://jotai.org">Jotai</a> -Desarrollada también por Daishi Kato- para el manejo del estado global, pero también indica que Waku es compatible con todas las librerías de manejo de estado, como por ejemplo <a href="https://zustand-demo.pmnd.rs/">Zustand</a> a o <a href="https://valtio.dev/">Valtio</a> -ambas mantenidas también por Daishi Kato 🔥-.</p>

        <p>En esta sección veremos un par ejemplos básicos con Zustand y Jotai.</p>

        <h4>Zustand</h4>

        <p>Zustand es una librería de manejo de estado muy sencilla y liviana. Es mi favorita. Para usarla en Waku, primero debemos instalarla:</p>

        <CodeBlock>
          {codigo.pnpmZustand}
        </CodeBlock>

        <p>Luego debemos crear una tienda/store para nuestro estado global. Para este proyecto tenemos `src/stores/zustand/useZustandStore.ts`, que se ve así:</p>

        <CodeBlock>
          {codigo.zustandStore}
        </CodeBlock>

        <p>Vamos a usar persistencia en el almacenamiento local (local storage) para que el estado se mantenga entre recargas de la página, para ello usamos el middleware `persist`. También usamos el middleware `immer` para poder mutar el estado directamente.</p>

        <p>Acá el códido del Componente de Cliente que usa esta store:</p>

        <CodeBlock>
          {codigo.zustandCliente}
        </CodeBlock>

        <h4>Jotai</h4>

        <p>Jotai es otra librería de manejo de estado muy sencilla y liviana. Para usarla en Waku, primero debemos instalarla:</p>

        <CodeBlock>
          {codigo.pnpmJotai}
        </CodeBlock>

        <p>Luego debemos crear unos átomos para nuestro estado global. Para este proyecto tenemos `src/stores/jotai/jotaiAtoms.ts`, que se ve así:</p>

        <CodeBlock>
          {codigo.jotaiStore}
        </CodeBlock>

        <p>Acá el códido del Componente de Cliente que usa estos átomos:</p>

        <CodeBlock>
          {codigo.jotaiCliente}
        </CodeBlock>

        <p>Visite el siguiente → <Link to="/manejodeestado">enlace</Link> para ver en acción ambas librerías.</p>

        <BotonesAvance
          rutaSiguiente="/temas/temas/variablesdeentorno"
          rutaAnterior="/temas/temas/mutaciones"
          textoSiguiente="13-Variables de Entorno"
          textoAnterior="11-Mutaciones"
        />

      </section>
    </>
  )
}