"use client";

import { useState } from "react";
import type { ReactElement } from "react";
import EjemploComponenteShared from "./EjemploComponenteShared";

export default function EjemploComponenteCliente() {
  const [gatos, setGatos] = useState<ReactElement[]>([]);

  /**
   * Genera un elemento de imagen de un gato.
   * @returns {JSX.Element} Un elemento img que muestra un ícono de un gato rojo que mueve su cabeza.
   */
  function generarImgGato(): ReactElement {
    return (
      <img
        src="/imagenes/gato-cliente.webp"
        alt="ícono de un gato color rojo que mueve su cabeza."
        className="size-20 rounded-full"
        key={gatos.length}
      />
    );
  }

  /**
   * Agrega un nuevo gato a la lista de gatos.
   */
  function agregarGatos() {
    const imgGato = generarImgGato();
    setGatos([...gatos, imgGato]);
  }

  return (
    <section className="p-6 border border-gray-300 rounded-lg max-w-2xl">
      <h2 className="text-2xl font-bold mb-4">Client Component</h2>
      <p className="mb-4">
        Este componente se ejecuta en el cliente, y agrega un gato cada vez que
        se presiona el botón 'Incrementar gatos'.
      </p>
      <button
        onClick={agregarGatos}
        className="px-4 py-2 bg-amber-300 text-black cursor-pointer rounded"
      >
        Incrementar gatos
      </button>
      <p className="mt-4">Gatos:</p>
      <div className="flex flex-wrap gap-2 my-6">
        {gatos}
      </div>
      <EjemploComponenteShared />
    </section>
  );
}
