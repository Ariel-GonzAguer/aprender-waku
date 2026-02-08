import { getPokemonByID } from '../../lib/pokemones';

export default async function LazySeis() {

  const pokemon = await getPokemonByID(133); // Eevee
  if (!pokemon) {
    return <p>Pokémon no encontrado</p>;
  }

  return (
    <section>
      <p className="m-1!">Este slice carga data de un pokemon de manera asíncrona.</p>
      <p className="m-1!">Nombre: {pokemon.nombre}</p>
      <p className="m-1!">ID: {pokemon.id}</p>
      <img src={pokemon.imagen} alt="imagen del pokemon Eevee." />
    </section>
  )
}

export const getConfig = () => {
  return {
    render: 'dynamic',
  };
};
