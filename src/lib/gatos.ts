export const gatos = [
  { slug: "sundae", nombre: "Sundae", edad: 3, color: "naranja", mejorAmigo: "/imagenes/ardilla-amiga.webp" },
  { slug: "luna", nombre: "Luna", edad: 2, color: "gris", mejorAmigo: "/imagenes/caballo-amigo.webp" },
  { slug: "timi", nombre: "Timi", edad: 5, color: "vaca", mejorAmigo: "/imagenes/pato-amigo.webp" },
];

export function getGatoBySlug(slug: string) {
  return gatos.find((gato) => gato.slug === slug);
}
