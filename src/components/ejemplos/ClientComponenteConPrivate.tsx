'use client';

import fs from 'fs';

import { useState } from "react";

export default function ClientComponentConPrivate() {
  const textoPrivado = fs.readFileSync('../../private/texto-privado.md', 'utf-8');
  const [textoP,] = useState<string>(textoPrivado);

  function handleTextoPrivado() {
    if (textoP) {
      return (
        <p>{textoP}</p>
      )
    } else {
      return <p>No se pudo cargar el texto privado.</p>;
    }
  }

  return (
    <section>
      {handleTextoPrivado()}
    </section>
  )
}
