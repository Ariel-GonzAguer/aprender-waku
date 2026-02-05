import { Link } from 'waku';

export default function BotonesAvance({ rutaSiguiente, rutaAnterior, textoSiguiente, textoAnterior }: { rutaSiguiente: string, rutaAnterior: string, textoSiguiente: string, textoAnterior: string }) {

  return (
    <div className='mt-6'>
      <Link className='border-2 border-white rounded p-2 mr-2 text-white bg-zinc-900 hover:bg-white hover:text-black transition-all duration-300' to={rutaAnterior}>← {textoAnterior}</Link>
      <Link className='border-2 border-white rounded p-2 text-white bg-zinc-900 hover:bg-white hover:text-black transition-all duration-300' to={rutaSiguiente}>{textoSiguiente} →</Link>
    </div>
  )
}