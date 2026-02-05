
export default async function HomePage() {
  return (
    <>
      <meta name="keywords" content="Waku, aprendizaje, tutorial" />

      <section id='página-inicial' className="flex flex-col justify-center items-center text-center text-balance flex-1 w-full">
        <h1 className="text-5xl font-bold my-6">Waku en español</h1>
        <p className="mb-4">Esta es la primera guía en español para aprender el framework minimalista, React-First, basado en React Server Componentes: <a href="https://wakujs.gg/" target="_blank" rel="noopener noreferrer" className="font-bold text-red-600 text-3xl hover:text-amber-300 transition-all duration-300"> <br />
          Waku</a>.</p>
        <p className="mb-4">Puede visitar el repositorio de este sitio web acá → <a href="https://github.com/Ariel-GonzAguer/aprender-waku" target="_blank" rel="noopener noreferrer" className="font-bold text-amber-300 hover:text-red-600 transition-all duration-300">Repositorio en Github</a>.</p>
        <img src="/imagenes/waku.webp" alt="ícono de Waku" className="mt-4" />
        <p>Nota: esta guía cubre la versión 1.0.0-alpha.3 de Waku.</p>
      </section>
    </>

  )
}

export const getConfig = async () => {
  return {
    render: 'static',
  } as const
}
