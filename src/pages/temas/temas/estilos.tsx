
import BotonesAvance from '../../../components/BotonesAvance';
import RenderTemaData from "../../../components/RenderTemaData";

export default function Estilos() {

  const data = {
    titulo: "7-Estilos",
    autor: "Ariel",
    fecha: "7-12-2025",
    tags: ["waku", "guía", "estilos", "css", "diseño", "tailwind"]
  };

  return (
    <>
      <RenderTemaData data={data} />

      <section className='tema'>

        <h3>Introducción</h3>

        <p> Por default, Waku viene con Tailwind CSS preconfigurado, lo que facilita iniciar proyectos rápidamente.</p>

        <h4>Estilos globales</h4>

        <p>Para agregar estilos globales, podemos agregarlos en el archivo `src/styles.css`, o bien crear un nuevo archivo CSS en `src/estilos/index.css`, e importarlo a nuestro layout principal.</p>
        <p>Para este proyecto se usa `src/styles.css`, y se importa a `src/pages/_root.tsx`.</p>

        <BotonesAvance
          rutaSiguiente="/temas/temas/staticassets"
          rutaAnterior="/temas/temas/metadata"
          textoSiguiente="8-Static Assets"
          textoAnterior="6-Metadata"
        />

      </section>
    </>
  )
}