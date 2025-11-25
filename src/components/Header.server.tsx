export default function Header() {
  return (
    <header style={{ padding: '1rem', backgroundColor: '#f0f0f0', borderBottom: '1px solid #ccc' }}>
      <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <h1 style={{ margin: 0 }}>
          <a href="/" style={{ textDecoration: 'none', color: '#000' }}>
            📝 DevBlog
          </a>
        </h1>
        <a href="/">Posts</a>
        <a href="/about">About</a>
      </nav>
    </header>
  )
}
