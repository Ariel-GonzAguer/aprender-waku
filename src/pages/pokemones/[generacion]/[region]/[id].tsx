import type { PageProps } from 'waku/router';
import { getPokemonByID } from '../../../../lib/pokemones';

/**
 * Ruta segmentada anidada dinámica con validación: /pokemones/[generacion]/[region]/[id]
 * 
 * Ejemplos de uso válidos:
 * - /pokemones/primera/kanto/25 → Pikachu (Gen 1, Kanto)
 * - /pokemones/segunda/johto/152 → Chikorita (Gen 2, Johto)
 * - /pokemones/tercera/hoenn/252 → Treecko (Gen 3, Hoenn)
 * 
 * Ejemplos de rutas inválidas:
 * - /pokemones/primera/kanto/560 → Error: Emboar es de Gen 5, Unova
 * - /pokemones/segunda/hoenn/25 → Error: Pikachu es de Gen 1, Kanto
 * 
 * Los segmentos deben coincidir con los datos reales del Pokémon.
 */

export default async function PokemonDetailPage({
  generacion,
  region,
  id
}: PageProps<"/pokemones/[generacion]/[region]/[id]">) {

  const pokemon = await getPokemonByID(Number(id));

  // Si no se encuentra el Pokémon
  if (!pokemon) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold text-red-600">Pokémon no encontrado</h1>
        <p className="text-gray-600">No existe un Pokémon con el ID: {id}</p>
      </div>
    );
  }

  // Validar que la generación y región coincidan
  if (pokemon.generacion !== generacion || pokemon.region !== region) {
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <div className="bg-red-50 border-2 border-red-500 rounded-lg p-6">
          <h1 className="text-3xl font-bold text-red-600 mb-4">
            Pokémon no corresponde a esta ruta
          </h1>

          <div className="bg-white rounded p-4 mb-4">
            <p className="text-lg font-semibold text-gray-800 mb-2">
              {pokemon.nombre.charAt(0).toUpperCase() + pokemon.nombre.slice(1)} (#{pokemon.id})
            </p>
            <img
              src={pokemon.imagen}
              alt={pokemon.nombre}
              className="w-32 h-32 mx-auto"
            />
          </div>

          <div className="space-y-2 text-sm  text-black">
            <div className="flex justify-between p-2 bg-red-100 rounded">
              <span className="font-semibold">Generación en URL:</span>
              <span className="capitalize">{generacion}</span>
            </div>
            <div className="flex justify-between p-2 bg-green-100 rounded">
              <span className="font-semibold">Generación real:</span>
              <span className="capitalize">{pokemon.generacion}</span>
            </div>
            <div className="flex justify-between p-2 bg-red-100 rounded">
              <span className="font-semibold">Región en URL:</span>
              <span className="capitalize">{region}</span>
            </div>
            <div className="flex justify-between p-2 bg-green-100 rounded">
              <span className="font-semibold">Región real:</span>
              <span className="capitalize">{pokemon.region}</span>
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded">
            <p className="text-sm text-blue-800">
              <strong>Sugerencia:</strong> Intenta con la ruta correcta:
            </p>
            <p className="text-sm text-blue-600 font-mono mt-1">
              /pokemones/{pokemon.generacion}/{pokemon.region}/{pokemon.id}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Si todo es correcto, mostrar la card del Pokémon
  const primerTipo = pokemon.tipos[0] || 'desconocido';

  return (
    <div className="max-w-5xl mx-auto p-8">
      {/* Breadcrumb contextual */}
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
        <span>Pokédex</span>
        <span>›</span>
        <span className="font-semibold text-blue-600 capitalize">{pokemon.generacion} Generación</span>
        <span>›</span>
        <span className="font-semibold text-green-600 capitalize">{pokemon.region}</span>
        <span>›</span>
        <span className="font-semibold text-black capitalize">{pokemon.nombre}</span>
      </nav>

      {/* Indicador de éxito */}
      <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
        <p className="text-green-700 font-semibold">Ruta válida</p>
        <p className="text-sm text-green-600">
          Este Pokémon corresponde correctamente a {pokemon.generacion} generación, región {pokemon.region}.
        </p>
      </div>

      {/* Card principal */}
      <div className="bg-white rounded-lg shadow-xl p-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Columna izquierda: Imagen */}
          <div>
            <div className="flex justify-center mb-4">
              <div className="text-center">
                <img
                  src={pokemon.imagen}
                  alt={pokemon.nombre}
                  className='w-64 h-64 object-contain bg-linear-to-br from-blue-50 to-purple-50 rounded-lg shadow-md'
                />
              </div>
            </div>
          </div>

          {/* Columna derecha: Información */}
          <div>
            <h1 className="text-4xl font-bold capitalize mb-4 text-black">{pokemon.nombre}</h1>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-gray-600">Pokédex Nacional</span>
                <span className="text-xl font-bold text-black">#{pokemon.id}</span>
              </div>

              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-gray-600">Tipos</span>
                <div className="flex gap-2">
                  {pokemon.tipos.map((tipo: string) => (
                    <span key={tipo} className="px-3 py-1 bg-blue-100 text-blue-800 rounded capitalize font-semibold">
                      {tipo}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-gray-600">Altura</span>
                <span className="text-lg font-semibold text-black">{pokemon.altura}m</span>
              </div>

              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-gray-600">Peso</span>
                <span className="text-lg font-semibold text-black">{pokemon.peso}kg</span>
              </div>
            </div>

            {/* Información contextual de generación y región */}
            <div className="bg-linear-to-r from-blue-50 to-green-50 rounded-lg p-4 space-y-3">
              <div>
                <p className="text-sm text-gray-500 mb-1">Generación</p>
                <p className="font-semibold text-black capitalize">{pokemon.generacion}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Región</p>
                <p className="font-semibold text-black capitalize">{pokemon.region}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4 text-black">Estadísticas Base</h2>
          <div className="space-y-3">
            {pokemon.fullStats.map((stat: any) => (
              <div key={stat.stat.name}>
                <div className="flex justify-between mb-1">
                  <span className="font-semibold capitalize text-sm text-gray-700">
                    {stat.stat.name.replace('-', ' ')}
                  </span>
                  <span className="text-sm font-bold text-black">{stat.base_stat}</span>
                </div>
                <div className="w-full bg-gray-200 rounded h-4">
                  <div
                    className="bg-linear-to-r from-black to-red-600 h-4 rounded transition-all"
                    style={{ width: `${Math.min(stat.base_stat / 2.5, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export const getConfig = async () => {
  return {
    render: 'dynamic',
  } as const;
};
