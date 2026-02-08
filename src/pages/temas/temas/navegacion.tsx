import BotonesAvance from '../../../components/BotonesAvance';
import CodeBlock from '../../../components/CodeBlock';
import { Link } from 'waku';
import RenderTemaData from "../../../components/RenderTemaData";

export default function Navegacion() {

  const data = {
    titulo: "4-Navegación",
    autor: "Ariel",
    fecha: "4-12-2025",
    tags: ["waku", "guía", "navegación", "link", "router", "useRouter"]
  };

  const codigo = {
    link: `// src/components/Header.tsx
import { Link } from "waku"
export default function Header() {

  return (
    <header className="bg-black text-white h-10 flex items-center justify-center">
      <nav className="w-full flex items-center justify-between gap-10 px-4 max-w-4xl mx-auto">
        <Link to="/temas" className="hover:text-amber-300! transition-all duration-300">Temas</Link>
        <Link to="/" className="hover:text-amber-300! transition-all duration-300">Inicio</Link>
        <Link to="/acerca-de" className="hover:text-amber-300! transition-all duration-300">Acerca De</Link>
      </nav>
    </header>
  )
};
    `,
    useRouter: `// src/components/Router.tsx
"use client";

import { useRouter } from "waku";

export default function Router() {
  const { path, query } = useRouter();
  const router = useRouter();

  return (
    <section
      className="flex flex-col justify-center items-center my-10 text-xl"
    >
      <p className="mb-6">Ruta actual: {path}</p>
      <p className="mb-6">Parámetros de consulta: {JSON.stringify(query)}</p>

      <button
        className="text-black py-5 px-4 mb-4 border-2 border-red-600 bg-amber-400 rounded"
        onClick={() => router.push("/temas/4-navegacion")}
      >
        Ir al tema 4-navegación
      </button>
      <button
        className="text-black py-5 px-4 border-2 border-red-600 bg-amber-400 rounded"
        onClick={() => {
          alert("Recargando...");
          router.reload();
        }}
      >
        Recargar
      </button>
    </section>
  );
};
    `

  }

  return (
    <>
      <RenderTemaData data={data} />
      
      <section className='tema'>
        <h3>Link</h3>

        <p>Este es el componente que debemos usar para crear enlaces de navegación interna. Acepta una prop `to` que indica la ruta a la que se quiere navegar, y que se obtiene automáticamente antes de la navegación.</p>

        <p>En este proyecto, podemos ver el uso de `{"<Link>"}` en el header para navegar entre las diferentes páginas:</p>
        <CodeBlock>
          {codigo.link}
        </CodeBlock>

        <h3>useRouter</h3>

        <p>El hook `useRouter` se puede usar para inspeccionar la ruta actual y realizar navegaciones programáticas.</p>

        <h4>Propiedades del router</h4>

        <p>El objeto router tiene dos propiedades relacionadas a la ruta actual:</p>

        <ul>
          <li><code>path</code>: tipo <code>string</code>.</li>
          <li><code>query</code>: tipo <code>string</code>.</li>
        </ul>

        <h4>Métodos del router</h4>

        <p>El objeto enrutador también contiene varios métodos para la navegación programática:</p>

        <ul>
          <li>→ <code>router.push(to: string)</code> - Navegar a la ruta proporcionada</li>
          <li>→ <code>router.prefetch(to: string)</code> - Precargar la ruta proporcionada</li>
          <li>→ <code>router.replace(to: string)</code> - Reemplazar la entrada actual del historial</li>
          <li>→ <code>router.reload()</code> - Recargar la ruta actual</li>
          <li>→ <code>router.back()</code> - Navegar a la entrada anterior en el historial de sesiones</li>
          <li>→ <code>router.forward()</code> - Navegar a la siguiente entrada en el historial de sesiones</li>
        </ul>

        <p>Acá un ejemplo de uso de `useRouter`, donde vemos `path`, `query`, `router.push()` y `router.reload()`:</p>
        <CodeBlock>
          {codigo.useRouter}
        </CodeBlock>

        <p>Puede ver la página que usa este componente aquí acá → <Link to='/router?sundae-de-caramelo'>página que usa el componente Router</Link>.</p>

        <p>Nota: al ser un hook, solo podemos usarlo en Componentes de Cliente.</p>

        <BotonesAvance
          rutaSiguiente="/temas/temas/manejodeerrores"
          rutaAnterior="/temas/temas/enrutamiento"
          textoSiguiente="5-Manejo de errores"
          textoAnterior="3-Enrutamiento"
        />
      </section>
    </>
  )
}