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
import type { getConfig as File_ManejoDeEstadoIndex_getConfig } from './pages/manejoDeEstado/index';
// prettier-ignore
import type { getConfig as File_MutacionesClientComponentConServerAction_getConfig } from './pages/mutaciones/client-component-con-server-action';
// prettier-ignore
import type { getConfig as File_PaginaSeis_getConfig } from './pages/paginaSeis';
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
| ({ path: '/manejoDeEstado' } & GetConfigResponse<typeof File_ManejoDeEstadoIndex_getConfig>)
| ({ path: '/mutaciones/client-component-con-server-action' } & GetConfigResponse<typeof File_MutacionesClientComponentConServerAction_getConfig>)
| { path: '/mutaciones'; render: 'static' }
| ({ path: '/paginaSeis' } & GetConfigResponse<typeof File_PaginaSeis_getConfig>)
| ({ path: '/pizzas/paginaConTextoPrivado' } & GetConfigResponse<typeof File_PizzasPaginaConTextoPrivado_getConfig>)
| ({ path: '/pizzas/[...slug]' } & GetConfigResponse<typeof File_PizzasSlug_getConfig>)
| ({ path: '/pokemones/[generacion]/[region]/[id]' } & GetConfigResponse<typeof File_PokemonesGeneracionRegionId_getConfig>)
| { path: '/router'; render: 'static' }
| { path: '/temas'; render: 'static' }
| { path: '/temas/temas/DataFetching-10'; render: 'static' }
| { path: '/temas/temas/Despliegue-14'; render: 'static' }
| { path: '/temas/temas/enrutamiento'; render: 'static' }
| { path: '/temas/temas/Estilos-7'; render: 'static' }
| { path: '/temas/temas/introduccion'; render: 'static' }
| { path: '/temas/temas/ManejoDeErrores-5'; render: 'static' }
| { path: '/temas/temas/ManejoDeEstado-12'; render: 'static' }
| { path: '/temas/temas/Metadata-6'; render: 'static' }
| { path: '/temas/temas/Mutaciones-11'; render: 'static' }
| { path: '/temas/temas/Navegacion-4'; render: 'static' }
| { path: '/temas/temas/primerospasos'; render: 'static' }
| { path: '/temas/temas/PWA-16'; render: 'static' }
| { path: '/temas/temas/renderizado'; render: 'static' }
| { path: '/temas/temas/Seguridad-15'; render: 'static' }
| { path: '/temas/temas/SistemaDeArchivos-9'; render: 'static' }
| { path: '/temas/temas/StaticAssets-8'; render: 'static' }
| { path: '/temas/temas/VariablesDeEntorno-13'; render: 'static' }
| ({ path: '/temas/[slug]' } & GetConfigResponse<typeof File_TemasSlug_getConfig>)
| ({ path: '/_root' } & GetConfigResponse<typeof File_Root_getConfig>)
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
