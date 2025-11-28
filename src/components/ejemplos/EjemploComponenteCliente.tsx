"use client";

import { useState } from "react";

export default function EjemploComponenteCliente() {
  const [contador, setContador] = useState(0);
  return (
    <div className="p-6 border border-gray-300 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Ejemplo de Componente Cliente</h2>
      <p className="mb-4">
        Este es un ejemplo de un componente que se ejecuta en el cliente.
      </p>
      <button
        onClick={() => setContador(contador + 1)}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Incrementar contador
      </button>
      <p className="mt-4">Contador: {contador}</p>
    </div>
  );
}
