
export default async function HomePage() {
  return (
    <section id='página-inicial' className="flex flex-col justify-center items-center text-center text-balance
    ">
      <h1 className="text-3xl my-6">Waku en español</h1>
      <p>Esta es la primera guía para aprender el framework minimalista, basado en React Server Componentes <span className="font-bold">Waku</span>, en español.</p>
      <p>Esta guía nace a partir del deseo de aprender Waku y la impresionante deficiencia de varios modelos de IA para crear una guía basandose en la documentación oficial → <a href="https://waku.gg/" target="_blank" rel="noopener noreferrer" className="font-bold">https://waku.gg/</a>.</p>
      <p>Este sitio web está desarrollado con Waku, y explica cómo recrearlo. Puede visitar el repositorio acá → <a href="https://github.com/Ariel-GonzAguer/aprender-waku" target="_blank" rel="noopener noreferrer" className="font-bold">Repositorio en Github</a>.</p>
      <p>Estas son las librerías/tecnologías usadas en este proyecto, además de Waku y React:</p>
      <ul>
        <li>Front-matter</li>
        <li>React-markdown</li>
        <li>Remark-gfm</li>
        <li>Tailwind</li>
        <li>OpenAI SDK</li>
        <li> JSON Placeholder</li>
      </ul>
    </section>

  )
}

export const getConfig = async () => {
  return {
    render: 'static',
  } as const
}