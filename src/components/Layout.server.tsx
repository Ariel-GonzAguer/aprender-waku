import Header from './Header.server'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>DevBlog - Artículos técnicos</title>
        <style>{`
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; }
          main { max-width: 800px; margin: 2rem auto; padding: 0 1rem; }
          a { color: #0066cc; }
        `}</style>
      </head>
      <body>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  )
}
