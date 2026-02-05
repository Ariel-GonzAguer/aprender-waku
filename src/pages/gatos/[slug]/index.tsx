/**
 * Este componente de página muestra el funcionamiento de una ruta segmentada/dinámica.
 * Cada gato tiene su propia página accesible mediante su slug.
 * El componente obtiene el slug desde las props de la página y utiliza
 * la función getGatoBySlug para obtener los detalles del gato correspondiente.
 * Si el gato no se encuentra, muestra un mensaje de "Gato no encontrado".
 */

import type { PageProps } from "waku/router";
import { getGatoBySlug } from "../../../lib/gatos";

export default async function GatoDetalle(
  { slug, path }: PageProps<"/gatos/[slug]">
) {
  const gato = getGatoBySlug(slug);

  if (!gato) {
    return (
      <div>
        <h1>Gato no encontrado</h1>
      </div>
    );
  }

  return (
    <section className="flex flex-col justify-center items-center my-10 text-xl">
      <p className="mb-2 text-amber-300">Nombre del michi</p>
      <p className="mb-6">{gato.nombre}</p>
      <p className="mb-6">Edad: {gato.edad}</p>
      <p className="mb-6">Color: {gato.color}</p>
      <p className="mb-6">slug: {gato.slug}</p>
      <p className="mb-2">Mejor amiga de {gato.nombre}:</p>
      <img src={gato.mejorAmigo} alt={`Mejor amigo de ${gato.nombre}`} className="mb-6" />
      <p>path:{path}</p>
    </section>
  );
}

export const getConfig = async () => {
  return {
    render: "static",
    staticPaths: ['sundae', 'luna', 'timi', 'onigiri'],
  } as const;
}
