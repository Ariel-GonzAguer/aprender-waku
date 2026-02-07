import BotonesAvance from '../../../components/BotonesAvance';
import CodeBlock from '../../../components/CodeBlock';

export default function PrimerosPasos() {

  const data = {
    titulo: "1-Primeros Pasos",
    autor: "Ariel",
    fecha: "28-11-2025",
    tags: ["waku", "framework", "react", "primeros pasos"]
  };

  return (
    <>
      <>
        <title>{data.titulo}</title>
        <meta name="author" content={data.autor} />
        <meta name="keywords" content={data.tags.join(", ")} />
        <meta name="date" content={data.fecha} />
      </>

      <section className='tema'>
        <h2>{data.titulo}</h2>
        <p className='italic mb-3'>por {data.autor} - {data.fecha}</p>
        <hr />

        <h3>Comenzar un nuevo proyecto con Waku</h3>

        <p>Comenzar un nuevo proyecto con Waku es sencillo. Antes de empezar, hay que asegurarse de tener Node.js en alguna de estas versiones: `^24.0.0` or `^22.12.0` or `^20.19.0`.</p>
        <p>En la terminal ejecutamos el siguiente comando para crear un nuevo proyecto:</p>
        <CodeBlock lang="bash">
          pnpm create waku@latest
        </ CodeBlock>

        <p> Nos pedirá un nombre para el proyecto; podemos escribir el que queramos, por ejemplo `portafolio-waku`, y después empezará a instalar las dependencias necesarias. </p>
        <p> Esto creará una estrucura básica de un proyecto Waku, que se mira así: </p>
        <img src="/imagenes/estructura-base-waku.webp" alt="Estructura base de Waku" className='m-[0_auto]' />

        <p>Luego, navegamos al directorio del proyecto y arrancamos el servidor de desarrollo con:</p>
        <CodeBlock lang="bash">
          cd portafolio-waku && pnpm dev
        </ CodeBlock>

        <p>Esto abrirá el proyecto en `localhost:3000`, donde podremos ver la página de inicio por defecto de Waku.</p>

        <p>¡Y eso es todo! Ya tenemos un proyecto Waku corriendo localmente y listo para ser personalizado y desarrollado según nuestras necesidades.</p>

        <BotonesAvance
          rutaSiguiente="/temas/temas/renderizado"
          rutaAnterior="/temas/temas/introduccion"
          textoSiguiente="2-Renderizado"
          textoAnterior="0-Introducción"
        />
      </section>
    </>
  )
}