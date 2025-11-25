import Header from '../components/Header.server'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className='flex flex-col justify-center items-center max-h-dvh'>
      <Header />
      <main className='flex-1'>
        {children}
      </main>
      <footer style={{ backgroundColor: '#f0f0f0', padding: '1rem', marginTop: '2rem', textAlign: 'center' }}>
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