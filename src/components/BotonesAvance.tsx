import { Link } from 'waku';

export default function BotonesAvance({ rutaSiguiente, rutaAnterior, textoSiguiente, textoAnterior }: { rutaSiguiente: string, rutaAnterior: string, textoSiguiente: string, textoAnterior: string }) {

  const clase = 'border-2 border-white rounded p-2 text-white! bg-zinc-900! hover:bg-white! hover:text-black! transition-all duration-300';

  return (
    <div className='mt-6'>
      <Link className={clase + ' mr-2'} to={rutaAnterior}>← {textoAnterior}</Link>
      <Link className={clase} to={rutaSiguiente}>{textoSiguiente} →</Link>
    </div>
  )
}