export default async function GrupalLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex flex-col justify-center items-center mt-10">
      <main className="flex flex-col justify-center items-center flex-1 w-full">
        <p>Este elemento p se muestra en todas la rutas agrupadas en (grupales)</p>
        {children}
        <img src="/imagenes/gato-cliente.webp" alt="Imagen de un gato" className="w-2xs" />
        <p>Ese gatito también se muestra en todas las páginas del grupales.
        </p>
      </main>
    </section>
  )
}

export const getConfig = async () => {
  return {
    render: 'static',
  } as const
}
