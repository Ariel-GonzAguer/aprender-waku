import BotonesAvance from '../../../components/BotonesAvance';
import CodeBlock from '../../../components/CodeBlock';
import RenderTemaData from "../../../components/RenderTemaData";

export default function StaticAssets() {

  const data = {
    titulo: "8-Static Assets",
    autor: "Ariel",
    fecha: "7-12-2025",
    tags: ["waku", "guía", "static assets"]
  };

  const codigo = {
    gato: `//src/pages/temas/[slug].tsx
    // ... hay código arriba
<img
  aria-live="polite"
  src="/loaders/OrangeCat_SVG.svg"
  alt="Imagen de carga que muestra un gatito rojo girando."
/>
// ... hay código abajo
    `,
  }

  return (
    <>
      <RenderTemaData data={data} />
      <section className='tema'>
        <h3>Introducción</h3>

        <p>Elementos como imágenes, fuentes y otros archivos estáticos se pueden almacenar en la carpeta `public` en la raíz del proyecto, y se puede acceder a esta carpeta mediante `/` ruta relativa desde el navegador.</p>

        <p>Por ejemplo, acá accedemos al loader del gatito rojo que está en `public/loaders/OrangeCat_SVG.svg`:</p>
        <CodeBlock>
          {codigo.gato}
        </CodeBlock>

        <BotonesAvance
          rutaSiguiente="/temas/temas/sistemadearchivos"
          rutaAnterior="/temas/temas/estilos"
          textoSiguiente="9-Sistema de Archivos"
          textoAnterior="7-Estilos"
        />
      </section>
    </>
  )
}