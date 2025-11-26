import { Link } from "waku"
export default function Header() {

  return (
    <header className="bg-black text-white h-10 flex items-center justify-center">
      <nav className="w-full flex items-center justify-between gap-10 px-4 max-w-4xl mx-auto">
        <Link to="/">Posts</Link>
        <Link to="/about">About</Link>
      </nav>
    </header>
  )
}
