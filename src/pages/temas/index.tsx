'use client'
import { useContentCollection } from "../../hooks/useContentCollection"
import { Link } from "waku"

export default function () {
  const temas = useContentCollection()
  
  // Extraer número inicial del título o path para ordenar correctamente
  const getInitialNumber = (titleOrPath: string): number => {
    // Extraer el nombre del archivo si es un path
    const filename = titleOrPath.includes('/') 
      ? titleOrPath.split('/').pop() || '' 
      : titleOrPath;
    
    // Buscar número al inicio del nombre o título
    const match = filename.match(/^(\d+)/);
    return match?.[1] ? parseInt(match[1], 10) : Infinity;
  };

  // Crear una copia y ordenar usando el número inicial
  // Solo ordena si hay datos disponibles
  const temasordenados = temas.length > 0 
    ? [...temas].sort((a, b) => {
        const titleA = a.attributes.titulo || a.path || '';
        const titleB = b.attributes.titulo || b.path || '';
        
        const numA = getInitialNumber(titleA);
        const numB = getInitialNumber(titleB);
        
        // Si ambos tienen número inicial, comparar números
        if (numA !== Infinity && numB !== Infinity) {
          return numA - numB;
        }
        
        // Si uno no tiene número, comparar alfabéticamente
        return titleA.localeCompare(titleB, undefined, { sensitivity: 'base' });
      })
    : temas;
  
  return (
    <section id="temas" className="m-[0_auto] p-8 w-[90%] text-center">
      <p className="mb-10">En cada tema encontrará la explicación correspondiente, con ejemplos de este mismo sitio web, y más.</p>
      <ul className="flex flex-wrap gap-8 justify-center items-center-center">
        {temasordenados.map((tema) => (
          <li key={tema.path} className="mb-4">
            <Link to={`/temas/${tema.path.split('/').pop()?.replace('.md', '')}`} className="text-blue-500 underline">
              {tema.attributes.titulo || tema.path.split('/').pop()?.replace('.md', '')}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
