
export default async function HomePage() {
  return (
    <section id='página-inicial' className="flex flex-col justify-center items-center text-center text-balance flex-1 w-full">
      <h1 className="text-4xl font-bold my-6">Waku en español</h1>
      <p className="mb-4">Esta es la primera guía en español para aprender el framework minimalista, React-First, basado en React Server Componentes <span className="font-bold">Waku</span>.</p>
      <p className="mb-4">Basada en la documentación oficial (<a href="https://waku.gg/" target="_blank" rel="noopener noreferrer" className="font-bold text-amber-300">https://waku.gg/</a>) esta proyecto nace del deseo de aprender Waku y la impresionante deficiencia de varios modelos de IA.</p>
      <p className="mb-4">Este sitio web está desarrollado con Waku y explica cómo está hecho. Puede visitar el repositorio acá → <a href="https://github.com/Ariel-GonzAguer/aprender-waku" target="_blank" rel="noopener noreferrer" className="font-bold text-amber-300">Repositorio en Github</a>.</p>
      <img src="/imagenes/waku.webp" alt="ícono de Waku" className="mt-4" />
      <p className="pb-6">Cada tema en esta guía se definió por el nivel de header en la documentación oficial, tomando 15 elementos h2 de la misma. <br /> Tómese en cuenta que el sitio web tiene 19 elementos h2, y de los 15 tomados no en todos se profundizará de igual manera. Para mayor información puede visitar la documentación oficial.</p>
    </section>

  )
}

export const getConfig = async () => {
  return {
    render: 'static',
  } as const
}