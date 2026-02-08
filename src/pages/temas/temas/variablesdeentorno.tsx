
// [Siguiente: 14-despliegue →](/temas/14-despliegue)

// [← Volver](/temas/12-manejo-de-estado)
import BotonesAvance from '../../../components/BotonesAvance';
import CodeBlock from '../../../components/CodeBlock';
import { Link } from 'waku';
import RenderTemaData from "../../../components/RenderTemaData";

export default function VariablesDeEntorno() {

  const data = {
    titulo: "13-variables-de-entorno",
    autor: "Ariel",
    fecha: "30-11-2025",
    tags: ["waku", "guía", "variables de entorno"],
  };

  const codigo = {
    server: `import { getEnv } from 'waku';

export const ServerComponent = async () => {
  const secretKey = getEnv('SECRET_KEY');

  return <>{/* ...*/}</>;
};`,
    client: `// client components can only access public variables
'use client';

export const ClientComponent = () => {
  const publicStatement = import.meta.env.WAKU_PUBLIC_HELLO;

  return <>{/* ...*/}</>;
};`,
    node: `// Server Component
export const ServerComponent = async () => {
 const secretKey = process.env.SECRET_KEY;

   return <>{/* ...*/}</>;
};`,
  };

  return (
    <>
      <RenderTemaData data={data} />

      <section className='tema'>
        <h3>Introducción</h3>

        <p>Es <strong>muy importante</strong> distinguir las variables de entorno que deben mantenerse en secreto, de aquellas que pueden hacerse públicas sin problema.</p>

        <h4>Variables de entorno privadas</h4>
        <p>Por defecto, <strong>todas</strong> las variables de entorno se consideran privadas y solo son accesibles en los Server Components, que se renderizan exclusivamente en un entorno seguro. Sin embargo, se debe tener cuidado de no pasar la variable como `prop` a ningún Client Component. Estas variables debemos almacenarlas en un archivo `.env.local` o `.env` en la raíz del proyecto.</p>

        <h4>Variables de entorno públicas</h4>
        <p>Para definir variables de entorno públicas, debemos usar el prefijo `WAKU_PUBLIC_`. Esto hace que estas variables se puedan acceder en entornos del cliente(navegador) mediante Client Components.</p>
        <p>Estarán disponibles/presentes como texto sin formato en el paquete de JavaScript de producción que se envía a los navegadores.</p>

        <h4>Runtime Agnóstico (recomendado)</h4>
        <p>Las variables de entorno están disponibles en el servidor a través de la función `getEnv` de Waku y en el cliente a través de `import.meta.env`.</p>

        <p>Veamos los siguientes ejemplos de la documentación oficial:</p>
        <CodeBlock>
          {codigo.server}
        </CodeBlock>

        <CodeBlock>
          {codigo.client}
        </CodeBlock>

        <h4>Node.js</h4>
        <p>En entornos `Node.js`, se puede utilizar `process.env` para compatibilidad.</p>

        <CodeBlock>
          {codigo.node}
        </CodeBlock>

        <BotonesAvance
          rutaSiguiente="/temas/temas/despliegue"
          rutaAnterior="/temas/temas/manejodeestado"
          textoSiguiente="14-Despliegue"
          textoAnterior="12-Manejo de estado"
        />
      </section>
    </>
  )
};
