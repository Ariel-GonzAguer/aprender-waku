import { Link } from "waku";

export default function () {

  return (
    <section id="temas" className="m-[0_auto] p-8 w-[90%] text-center">
      <p className="mb-10 text-xl">
        En cada tema encontrará la explicación correspondiente, con ejemplos de
        este mismo sitio web, y más.
      </p>
      <ul className="md:grid grid-cols-4 gap-4">
        <li className="my-4"><Link to='/temas/temas/introduccion'>0-Introducción</Link></li>
        <li className="my-4"><Link to='/temas/temas/primerospasos'>1-Primeros Pasos</Link></li>
        <li className="my-4"><Link to='/temas/temas/renderizado'>2-Renderizado</Link></li>
        <li className="my-4"><Link to='/temas/temas/enrutamiento'>3-Enrutamiento</Link></li>
        <li className="my-4"><Link to='/temas/temas/navegacion'>4-Navegación</Link></li>
        <li className="my-4"><Link to='/temas/temas/manejoerrores'>5-Manejo de errores</Link></li>
        <li className="my-4"><Link to='/temas/temas/metadata'>6-Metadata</Link></li>
        <li className="my-4"><Link to='/temas/temas/estilos'>7-Estilos</Link></li>
        <li className="my-4"><Link to='/temas/temas/staticassets'>8-Static Assets</Link></li>
        <li className="my-4"><Link to='/temas/temas/sistemadearchivos'>9-Sistema de archivos</Link></li>
        <li className="my-4"><Link to='/temas/temas/datafetching'>10-Data Fetching</Link></li>
        <li className="my-4"><Link to='/temas/temas/mutaciones'>11-Mutaciones</Link></li>
        <li className="my-4"><Link to='/temas/temas/manejodeestado'>12-Manejo de estado</Link></li>
        <li className="my-4"><Link to='/temas/temas/variablesdeentorno'>13-Variables de entorno</Link></li>
        <li className="my-4"><Link to='/temas/temas/despliegue'>14-Despliegue</Link></li>
        <li className="my-4"><Link to='/temas/temas/cspdynamico'>15-CSP Dinámico</Link></li>
        <li className="my-4"><Link to='/temas/temas/pwa'>16-PWA</Link></li>
      </ul>
    </section>
  );
};
