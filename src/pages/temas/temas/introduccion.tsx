import BotonesAvance from '../../../components/BotonesAvance';
import RenderTemaData from '../../../components/RenderTemaData';

export default function Intro() {

  const data = {
    titulo: "0-Introducción",
    autor: "Ariel",
    fecha: "27-11-2025",
    tags: ["waku", "framework", "react", "introducción"]
  };

  return (
    <>
      <RenderTemaData data={data} />

      <section className='tema'>
        <h3>¿Qué es y por qué Waku?</h3>
        <p> Waku <span className='italic'>( わく wah-ku )</span> es un framework minimalista para React creado por Daishi Kato, y siginifica literalmente <strong>Framework</strong> en japonés.</p>

        <p>Está pensado para proyecto pequeños a medianos, como sitios web (¡como este!), e-commerce ligero, aplicaciones web, blogs, portfolios, entre otros.</p>
        <p>Waku facilita muchísimo el aprovechar las ventajas del renderizado en el servidor (SSR), la generación de sitios estáticos (SSG), React Server Components, acciones en el servidor, y más, sin la complejidad de frameworks más grandes como Next.js o Remix.</p>

        <p>Para esta guía usaremos `pnpm` como gestor de paquetes, Tailwind CSS para estilos y Netlify para desplegar. Sin embargo, Waku es agnóstico a estas herramientas, y se puede usar npm, yarn, otros frameworks de CSS, y otros servicios de despliegue.</p>

        <BotonesAvance
          rutaSiguiente="/temas/temas/primerospasos"
          rutaAnterior="/temas"
          textoSiguiente="1-Primeros Pasos"
          textoAnterior="Volver"
        />
      </section>
    </>
  )
}