import ServerComponentConPrivate from "../../components/ejemplos/ServerComponenteConPrivate";

export default function PaginaConImagenPrivada() {

  return (
    <section className="flex flex-col justify-center items-center text-center mb-10">
      <p className="my-6">Server Component que usa imagen de `./private`</p>
      <ServerComponentConPrivate />
    </section>
  )
}

export const getConfig = async () => {
  return {
    render: "static",
  } as const;
}
