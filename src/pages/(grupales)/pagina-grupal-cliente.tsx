"use client";

import { useEffect, useState } from "react";

export default function GrupalClientePage() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    alert("Esta ruta es un Client Component, pues usa useEffect");
    const update = () => setIsOnline(navigator.onLine);
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, [isOnline]);

  return (
    <section
      className="flex flex-col justify-center items-center mt-10 text-2xl"
    >
      <h2 className="text-red-300 mb-6">¡Hola desde la página Grupal Cliente!</h2>
      <p className="mb-10">
        Esta es otra página creada para el ejercicio grupal, y es un Client
        Component.
      </p>
      <p>Usa <code>useEffect</code>, <code>useState</code> y <code>navigator.onLine (API del navegador)</code>.</p>
      <p>
        Estado de conexión: {isOnline ? "En línea" : "Desconectado"}
      </p>
    </section>
  );
}
