/**
 * Obtiene los datos de un Pokémon específico por su ID.
 *
 * Realiza una consulta a la PokéAPI para obtener la información completa del Pokémon
 * y la transforma en un objeto con propiedades útiles incluyendo generación y región.
 *
 * @param {number} id - El ID del Pokémon a obtener (basado en la PokéDex nacional)
 * @returns {Promise<Record<string, any> | null>} Una promesa que se resuelve con un objeto
 * contiendo los datos del Pokémon:
 * - `nombre`: Nombre del Pokémon
 * - `tipos`: Array de tipos del Pokémon
 * - `imagen`: URL de la imagen frontal del Pokémon
 * - `id`: ID del Pokémon
 * - `fullStats`: Array completo de estadísticas del Pokémon
 * - `peso`: Peso del Pokémon en kilogramos
 * - `altura`: Altura del Pokémon en metros
 * - `generacion`: Generación a la que pertenece (primera a octava)
 * - `region`: Región asociada al Pokémon (kanto, johto, hoenn, sinnoh, unova, kalos, alola, galar)
 *
 * @throws {Error} Si la solicitud a la PokéAPI falla o el Pokémon no existe
 *
 * @example
 * const pokemon = await getPokemonByID(1);
 * console.log(pokemon.nombre); // "bulbasaur"
 * console.log(pokemon.generacion); // "primera"
 */
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
