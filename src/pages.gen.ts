// deno-fmt-ignore-file
// biome-ignore format: generated types do not need formatting
// prettier-ignore
import type { PathsForPages, GetConfigResponse } from 'waku/router';

// prettier-ignore
import type { getConfig as File_AcercaDe_getConfig } from './pages/acerca-de';
// prettier-ignore
import type { getConfig as File_EjemplosComponenteservidor_getConfig } from './pages/ejemplos/componenteservidor';
// prettier-ignore
import type { getConfig as File_GatosSlugIndex_getConfig } from './pages/gatos/[slug]/index';
// prettier-ignore
import type { getConfig as File_Index_getConfig } from './pages/index';
// prettier-ignore
import type { getConfig as File_ManejodeestadoIndex_getConfig } from './pages/manejodeestado/index';
// prettier-ignore
import type { getConfig as File_MutacionesActions_getConfig } from './pages/mutaciones/actions';
// prettier-ignore
import type { getConfig as File_Paginaseis_getConfig } from './pages/paginaseis';
// prettier-ignore
import type { getConfig as File_PizzasPaginaConTextoPrivado_getConfig } from './pages/pizzas/paginaConTextoPrivado';
// prettier-ignore
import type { getConfig as File_PizzasSlug_getConfig } from './pages/pizzas/[...slug]';
// prettier-ignore
import type { getConfig as File_PokemonesGeneracionRegionId_getConfig } from './pages/pokemones/[generacion]/[region]/[id]';
// prettier-ignore
import type { getConfig as File_TemasSlug_getConfig } from './pages/temas/[slug]';
// prettier-ignore
import type { getConfig as File_Root_getConfig } from './pages/_root';
// prettier-ignore
import type { getConfig as File_SlicesLazyseis_getConfig } from './pages/_slices/lazyseis';
// prettier-ignore
import type { getConfig as File_SlicesMilSeiscientos_getConfig } from './pages/_slices/mil/seiscientos';
// prettier-ignore
import type { getConfig as File_SlicesSeis_getConfig } from './pages/_slices/seis';

// prettier-ignore
type Page =
| { path: '/pagina-grupal-cliente'; render: 'static' }
| { path: '/pagina-grupal-estatica'; render: 'static' }
| ({ path: '/acerca-de' } & GetConfigResponse<typeof File_AcercaDe_getConfig>)
| { path: '/ejemplos/componentecliente'; render: 'static' }
| ({ path: '/ejemplos/componenteservidor' } & GetConfigResponse<typeof File_EjemplosComponenteservidor_getConfig>)
| { path: '/ejemplos/componenteshared'; render: 'static' }
| ({ path: '/gatos/[slug]' } & GetConfigResponse<typeof File_GatosSlugIndex_getConfig>)
| ({ path: '/' } & GetConfigResponse<typeof File_Index_getConfig>)
| ({ path: '/manejodeestado' } & GetConfigResponse<typeof File_ManejodeestadoIndex_getConfig>)
| ({ path: '/mutaciones/actions' } & GetConfigResponse<typeof File_MutacionesActions_getConfig>)
| { path: '/mutaciones'; render: 'static' }
| ({ path: '/paginaseis' } & GetConfigResponse<typeof File_Paginaseis_getConfig>)
| ({ path: '/pizzas/paginaConTextoPrivado' } & GetConfigResponse<typeof File_PizzasPaginaConTextoPrivado_getConfig>)
| ({ path: '/pizzas/[...slug]' } & GetConfigResponse<typeof File_PizzasSlug_getConfig>)
| ({ path: '/pokemones/[generacion]/[region]/[id]' } & GetConfigResponse<typeof File_PokemonesGeneracionRegionId_getConfig>)
| { path: '/router'; render: 'static' }
| { path: '/temas'; render: 'static' }
| { path: '/temas/temas/cspdinamico'; render: 'static' }
| { path: '/temas/temas/datafetching'; render: 'static' }
| { path: '/temas/temas/despliegue'; render: 'static' }
| { path: '/temas/temas/enrutamiento'; render: 'static' }
| { path: '/temas/temas/estilos'; render: 'static' }
| { path: '/temas/temas/introduccion'; render: 'static' }
| { path: '/temas/temas/manejodeerrores'; render: 'static' }
| { path: '/temas/temas/manejodeestado'; render: 'static' }
| { path: '/temas/temas/metadata'; render: 'static' }
| { path: '/temas/temas/mutaciones'; render: 'static' }
| { path: '/temas/temas/navegacion'; render: 'static' }
| { path: '/temas/temas/primerospasos'; render: 'static' }
| { path: '/temas/temas/pwa'; render: 'static' }
| { path: '/temas/temas/renderizado'; render: 'static' }
| { path: '/temas/temas/sistemadearchivos'; render: 'static' }
| { path: '/temas/temas/staticassets'; render: 'static' }
| { path: '/temas/temas/variablesdeentorno'; render: 'static' }
| ({ path: '/temas/[slug]' } & GetConfigResponse<typeof File_TemasSlug_getConfig>)
| ({ path: '/_root' } & GetConfigResponse<typeof File_Root_getConfig>)
| ({ path: '/_slices/lazyseis' } & GetConfigResponse<typeof File_SlicesLazyseis_getConfig>)
| ({ path: '/_slices/mil/seiscientos' } & GetConfigResponse<typeof File_SlicesMilSeiscientos_getConfig>)
| ({ path: '/_slices/seis' } & GetConfigResponse<typeof File_SlicesSeis_getConfig>);

// prettier-ignore
declare module 'waku/router' {
  interface RouteConfig {
    paths: PathsForPages<Page>;
  }
  interface CreatePagesConfig {
    pages: Page;
  }
}
