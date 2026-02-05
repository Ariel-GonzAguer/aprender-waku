import type { ComponentType, LazyExoticComponent } from "react";
import { lazy } from "react";

type TemaModule = { default: ComponentType };

// Vite expone cada tema como una función que hace el dynamic import.
const temaModules = import.meta.glob<TemaModule>("../temas/*.tsx");

/**
 * Devuelve el componente del tema de forma lazy para usar con Suspense.
 */
export function getComponentBySlug(slug: string): LazyExoticComponent<ComponentType> | null {
  const key = `../temas/${slug}.tsx`;
  const loader = temaModules[key];

  if (!loader) return null;

  return lazy(async () => ({ default: (await loader()).default }));
}
