import type { ComponentType, LazyExoticComponent } from "react";
import { lazy } from "react";

type TemaModule = { default: ComponentType };

// Vite expone cada tema como una función que hace el dynamic import.
const temaModules = import.meta.glob<TemaModule>("../temas/temas/*.tsx");
const ejemplosModules = import.meta.glob<TemaModule>("../../ejemplos/*.tsx");

/**
 * Devuelve el componente del tema de forma lazy para usar con Suspense.
 */
export function getComponentBySlug({
  slug,
  modulo,
}: {
  slug: string;
  modulo: "temas" | "ejemplos";
}): LazyExoticComponent<ComponentType> | null {
  let key: string | undefined;

  if (modulo === "ejemplos") {
    key = `../../ejemplos/${slug}.tsx`;
  } else if ( modulo === "temas") {
    key = `../temas/temas/${slug}.tsx`;
  }
  
  if (!key || !modulo) return null;
  
  const loader = temaModules[key] || ejemplosModules[key];

  if (!loader) return null;

  return lazy(async () => ({ default: (await loader()).default }));
}
