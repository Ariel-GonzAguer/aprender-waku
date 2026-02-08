import BotonesAvance from '../../../components/BotonesAvance';
import CodeBlock from '../../../components/CodeBlock';
import RenderTemaData from "../../../components/RenderTemaData";

export default function Metadata() {

  const data = {
    titulo: "6-Metadata",
    autor: "Ariel",
    fecha: "7-12-2025",
    tags: ["waku", "guía", "meta-data"]
  };

  const codigo = {
    metadataRoot: `// src/pages/_root.tsx
<meta charSet="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<link rel="icon" href="/imagenes/waku.webp" />
<meta name="description" content="Aprende Waku en en español" />
<meta name="robots" content="index, follow" />
// Esta metadata se aplica a toda la aplicación, pero puede ser sobreescrita por metadata definida en cada página o layout. Por ejemplo, en cada tema definimos metadata específica para ese tema.
    `,
    metadataTema: `// src/pages/temas/temas/metadata.tsx
<>
  <title>{data.titulo}</title>
  <meta name="author" content={data.autor} />
  <meta name="keywords" content={data.tags.join(", ")} />
  <meta name="date" content={data.fecha} />
</>
// Para mostrar esta metada en cada tema, cree un componente llamado RenderTemaData que recibe un objeto con la metadata y lo renderiza, y luego lo uso en cada tema, por ejemplo:
// <RenderTemaData data={data} />
    `,
  }

  return (
    <>
      <RenderTemaData data={data} />

      <section className='tema'>
        <h3>Introducción</h3>
        <p>Waku eleva (hace hoisting) cualquier metadata (title, meta tags, etc.) al head del documento HTML generado, por lo que agregar meta tags es tan sencillo como incluirlos en cualquier layout o página.</p>

        <p>En este proyecto, definimos metadata en dos lugares:</p>
        <ul>
          <li>→ En el Elemento Root `src/pages/_root.tsx` definimos la mayoría de las meta tags.</li>
          <li>→ En cada tema definimos metadata específica.</li>
        </ul>

        <CodeBlock>
          {codigo.metadataRoot}
        </CodeBlock>

        <CodeBlock>
          {codigo.metadataTema}
        </CodeBlock>

        <BotonesAvance
          rutaSiguiente="/temas/temas/estilos"
          rutaAnterior="/temas/temas/manejodeerrores"
          textoSiguiente="7-Estilos"
          textoAnterior="5-Manejo de errores"
        />
      </section>
    </>
  )
}
