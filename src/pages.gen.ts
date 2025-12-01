// deno-fmt-ignore-file
// biome-ignore format: generated types do not need formatting
// prettier-ignore
import type { PathsForPages, GetConfigResponse } from 'waku/router';

// prettier-ignore
import type { getConfig as File_AcercaDe_getConfig } from './pages/acercaDe';
// prettier-ignore
import type { getConfig as File_EjemplosSlug_getConfig } from './pages/ejemplos/[slug]';
// prettier-ignore
import type { getConfig as File_GatosSlugIndex_getConfig } from './pages/gatos/[slug]/index';
// prettier-ignore
import type { getConfig as File_Index_getConfig } from './pages/index';
// prettier-ignore
import type { getConfig as File_PizzasSlug_getConfig } from './pages/pizzas/[...slug]';
// prettier-ignore
import type { getConfig as File_PokemonesGeneracionRegionId_getConfig } from './pages/pokemones/[generacion]/[region]/[id]';
// prettier-ignore
import type { getConfig as File_TemasSlug_getConfig } from './pages/temas/[slug]';
// prettier-ignore
import type { getConfig as File_Root_getConfig } from './pages/_root';

// prettier-ignore
type Page =
| { path: '/grupalCliente'; render: 'dynamic' }
| { path: '/grupalEstatica'; render: 'dynamic' }
| ({ path: '/acercaDe' } & GetConfigResponse<typeof File_AcercaDe_getConfig>)
| ({ path: '/ejemplos/[slug]' } & GetConfigResponse<typeof File_EjemplosSlug_getConfig>)
| ({ path: '/gatos/[slug]' } & GetConfigResponse<typeof File_GatosSlugIndex_getConfig>)
| ({ path: '/' } & GetConfigResponse<typeof File_Index_getConfig>)
| ({ path: '/pizzas/[...slug]' } & GetConfigResponse<typeof File_PizzasSlug_getConfig>)
| ({ path: '/pokemones/[generacion]/[region]/[id]' } & GetConfigResponse<typeof File_PokemonesGeneracionRegionId_getConfig>)
| { path: '/temas'; render: 'dynamic' }
| ({ path: '/temas/[slug]' } & GetConfigResponse<typeof File_TemasSlug_getConfig>)
| ({ path: '/_root' } & GetConfigResponse<typeof File_Root_getConfig>);

// prettier-ignore
declare module 'waku/router' {
  interface RouteConfig {
    paths: PathsForPages<Page>;
  }
  interface CreatePagesConfig {
    pages: Page;
  }
}
