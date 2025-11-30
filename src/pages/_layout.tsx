import Header from '../components/Header'
import Footer from '../components/Footer'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex flex-col min-h-screen w-full text-white text-lg bg-zinc-900 cursor-default">
      <Header />
      <main className="flex flex-col flex-1 w-full">
        {children}
      </main>
      <Footer />
    </section>
  )
}

export const getConfig = async () => {
  return {
    render: 'static',
  } as const
}
