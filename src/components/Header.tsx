import { Link } from "waku"
export default function Header() {

  return (
    <header className="bg-black text-white h-10 flex items-center justify-center">
      <nav className="w-full flex items-center justify-between gap-10 px-4 max-w-4xl mx-auto">
        <Link to="/temas" className="hover:text-amber-300! transition-all duration-300">Temas</Link>
        <Link to="/" className="hover:text-amber-300! transition-all duration-300">Inicio</Link>
        <Link to="/acerca-de" className="hover:text-amber-300! transition-all duration-300">Acerca De</Link>
      </nav>
    </header>
  )
}
