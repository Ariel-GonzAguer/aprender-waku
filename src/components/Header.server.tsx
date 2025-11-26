import { Link } from "waku"
export default function Header() {

  return (
    <header className="bg-black text-white h-10 flex items-center justify-center">
      <nav className="flex gap-8 items-center justify-center">
        <h1 className="m-0">
          <Link to="/" className="no-underline text-white">
            📝 DevBlog
          </Link>
        </h1>
        <Link to="/">Posts</Link>
        <Link to="/about">About</Link>
      </nav>
    </header>
  )
}
