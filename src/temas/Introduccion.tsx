import BotonesAvance from '../components/BotonesAvance';

export default function Intro() {

  const data = {
    titulo: "0-Introducción",
    autor: "Ariel",
    fecha: "27-11-2025",
    tags: ["waku", "framework", "react", "introducción"]
  };

  return (
    <>
      <>
        <title>{data.titulo}</title>
        <meta name="author" content={data.autor} />
        <meta name="keywords" content={data.tags.join(", ")} />
        <meta name="date" content={data.fecha} />
      </>

      <section className='text-center my-6'>
        <h2 className='text-4xl font-bold mb-3'>{data.titulo}</h2>
        <p className='italic mb-3'>por {data.autor} - {data.fecha}</p>
        <hr />

        <h3 className='text-3xl text-amber-300 my-6'>¿Qué es y por qué Waku?</h3>
        <p> Waku <span className='italic'>( わく wah-ku )</span> es un framework minimalista para React creado por Daishi Kato, y siginifica literalmente <strong>Framework</strong> en japonés.</p>

        <p>Está pensado para proyecto pequeños a medianos, como sitios web (¡como este!), e-commerce ligero, aplicaciones web, blogs, portfolios, entre otros.</p>
        <p>Waku facilita muchísimo el aprovechar las ventajas del renderizado en el servidor (SSR), la generación de sitios estáticos (SSG), React Server Components, acciones en el servidor, y más, sin la complejidad de frameworks más grandes como Next.js o Remix.</p>

        <p>Para esta guía usaremos `pnpm` como gestor de paquetes, Tailwind CSS para estilos y Netlify para desplegar. Sin embargo, Waku es agnóstico a estas herramientas, y se puede usar npm, yarn, otros frameworks de CSS, y otros servicios de despliegue.</p>

        <BotonesAvance rutaSiguiente="/temas/PrimerosPasos" rutaAnterior="/temas" textoSiguiente="1-Primeros Pasos" textoAnterior="Volver" />
      </section>
    </>
  )
}