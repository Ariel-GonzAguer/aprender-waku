import BotonesAvance from '../../../components/BotonesAvance';
import CodeBlock from '../../../components/CodeBlock';
import RenderTemaData from "../../../components/RenderTemaData";

export default function ManejoDeErrores() {
  const data = {
    titulo: "5-Manejo de errores",
    autor: "Ariel",
    fecha: "5-12-2025",
    tags: ["waku", "guía", "manejo de errores", "errores"]
  };

  const codigo = {
    reactErrorBoundary: `pnpm add react-error-boundary`,
    errorBoundaryEjemplo: `import * as React from 'react'
import ReactDOM from 'react-dom'
import { ErrorBoundary } from 'react-error-boundary'

function ErrorFallback({ error }) {
	return (
		<div role="alert">
			<p>Something went wrong:</p>
			<pre style={{ color: 'red' }}>{error.message}</pre>
		</div>
	)
}

function Greeting({ subject }) {
	return <div>Hello {subject.toUpperCase()}</div>
}

function Farewell({ subject }) {
	return <div>Goodbye {subject.toUpperCase()}</div>
}

function App() {
	return (
		<div>
			<ErrorBoundary FallbackComponent={ErrorFallback}>
				<Greeting />
				<Farewell />
			</ErrorBoundary>
		</div>
	)
};
  `,

  };

  return (
    <>
      <RenderTemaData data={data} />

      <section className='tema'>
        <h3>Introducción</h3>

        <p>Waku nos da un `error boundary` (límite de errores) por defecto para manejar errores en nuestras aplicaciones, aunque también nos permite personalizar este comportamiento si lo necesitamos, colocando un componente `ErrorBoundary` en cualquier parte, usando librerías externas, como `react-error-boundary`, o implementando nuestro propio límite de errores.</p>

        <p>Cuando se generan errores desde Server Components o funciones del servidor, estos se reproducen automáticamente en el navegador. Esto permite que los límites de error más cercanos los detecten y gestionen, incluso si se originaron en el servidor.</p>

        <p>Los límites de error gestionan errores inesperados como <strong>último recurso</strong>. Para condiciones de error esperadas (como validación o fallos de red), trátelas explícitamente en la lógica de su aplicación.</p>

        <p>En producción, los errores del servidor se ofuscan automáticamente en el cliente para evitar revelar información interna del servidor. Los mensajes de error detallados y los seguimientos de pila <strong>solo son visibles en desarrollo</strong>.</p>

        <p>Si personaliza el Elemento Raíz , debería añadir su propio límite de error en los componentes correspondientes, no en el elemento raíz, ya que el límite de error raíz predeterminado de Waku está incluido en el elemento raíz predeterminado.</p>

        <h4>react-error-boundary</h4>

        <p>Para usar la librería `react-error-boundary`, primero debemos instalarla:</p>
        <CodeBlock lang='bash'>
          {codigo.reactErrorBoundary}
        </CodeBlock>

        <p>Algo crucial a tener en cuenta es que los límites de error solo funcionan en Componentes de Cliente. Por lo tanto, debemos asegurarnos de que el componente donde implementamos el límite de error sea un Componente de Cliente.</p>

        <p>Acá un ejemplo de cómo usar `react-error-boundary` tomado de <a href="https://kentcdodds.com/blog/use-react-error-boundary-to-handle-errors-in-react">Kent C. Dodds</a>:</p>

        <CodeBlock>
          {codigo.errorBoundaryEjemplo}
        </CodeBlock>

        <BotonesAvance
          rutaSiguiente="/temas/temas/metadata"
          rutaAnterior="/temas/temas/manejodeerrores"
          textoSiguiente="6-Meta Data"
          textoAnterior="5-Manejo de errores"
        />
      </section>
    </>
  )
}