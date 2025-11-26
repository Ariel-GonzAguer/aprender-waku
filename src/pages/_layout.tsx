import Header from '../components/Header.server'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex flex-col h-full w-full bg-zinc-900 text-white">
      <Header />

      <main className="flex-1 w-full">
        {children}
      </main>

      <footer className='bg-gray-400 text-black w-full'>
        <p>© 2025 DevBlog. Hecho con Waku.</p>
      </footer>
    </section>
  )
}

export const getConfig = async () => {
  return {
    render: 'static',
  } as const
}