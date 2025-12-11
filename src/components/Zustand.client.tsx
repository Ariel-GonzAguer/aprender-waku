"use client";

import useZustandStore from "../stores/zustand/useZustandStore";
import { useState, useEffect } from "react";

export default function Zustand() {
  const { gatos, incrementarGatos, decrementarGatos, reiniciarStore } = useZustandStore();
  const [localGatos, setLocalGatos] = useState('');

  useEffect(() => {
    for (let i = 0; i < gatos; i++) {
      setLocalGatos(localGatos + '🐱');
      if (gatos === 0) {
        setLocalGatos('');
      }
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
}
