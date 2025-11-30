import { Link } from "waku"
export default function Header() {

  return (
    <header className="bg-black text-white h-10 flex items-center justify-center">
      <nav className="w-full flex items-center justify-between gap-10 px-4 max-w-4xl mx-auto">
        <Link to="/temas" title="Temas">Temas</Link>
        <Link to="/" title="Inicio">Inicio</Link>
        <Link to="/about" title="Acerca De">Acerca De</Link>
      </nav>
    </header>
  )
}
