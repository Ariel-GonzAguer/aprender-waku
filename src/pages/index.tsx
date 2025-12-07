
export default async function HomePage() {
  return (
    <>
      <meta name="keywords" content="Waku, aprendizaje, tutorial" />

      <section id='página-inicial' className="flex flex-col justify-center items-center text-center text-balance flex-1 w-full">
        <h1 className="text-4xl font-bold my-6">Waku en español</h1>
        <p className="mb-4">Esta es la primera guía en español para aprender el framework minimalista, React-First, basado en React Server Componentes <span className="font-bold">Waku</span>.</p>
        <p className="mb-4">Basada en la documentación oficial (<a href="https://waku.gg/" target="_blank" rel="noopener noreferrer" className="font-bold text-amber-300">https://waku.gg/</a>) esta proyecto nace del deseo de aprender Waku y la impresionante deficiencia de varios modelos de IA para crear una guía decente.</p>
        <p className="mb-4">Este sitio web está desarrollado con Waku. Puede visitar el repositorio acá → <a href="https://github.com/Ariel-GonzAguer/aprender-waku" target="_blank" rel="noopener noreferrer" className="font-bold text-amber-300">Repositorio en Github</a>.</p>
        <img src="/imagenes/waku.webp" alt="ícono de Waku" className="mt-4" title="Logo de Waku" />
      </section>
    </>

  )
}

export const getConfig = async () => {
  return {
    render: 'static',
  } as const
}
