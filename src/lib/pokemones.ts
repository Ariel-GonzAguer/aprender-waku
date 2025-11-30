"use server";

export async function getPokemonByID(
  id: number
): Promise<Record<string, any> | null> {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  const pokemon = await response.json();
  const objetoPokemon = {
    nombre: pokemon.name,
    tipos: pokemon.types.map((typeInfo: any) => typeInfo.type.name),
    imagen: pokemon.sprites.front_default,
    id: pokemon.id,
    fullStats: pokemon.stats,
    peso: pokemon.weight / 10,
    altura: pokemon.height / 10,
    generacion:
      id <= 151
        ? "primera"
        : id <= 251
        ? "segunda"
        : id <= 386
        ? "tercera"
        : id <= 493
        ? "cuarta"
        : id <= 649
        ? "quinta"
        : id <= 721
        ? "sexta"
        : id <= 809
        ? "séptima"
        : "octava",
    region:
      id <= 151
        ? "kanto"
        : id <= 251
        ? "johto"
        : id <= 386
        ? "hoenn"
        : id <= 493
        ? "sinnoh"
        : id <= 649
        ? "unova"
        : id <= 721
        ? "kalos"
        : id <= 809
        ? "alola"
        : "galar",
  };
  console.log("Fetched Pokémon:", objetoPokemon);
  return objetoPokemon;
}
