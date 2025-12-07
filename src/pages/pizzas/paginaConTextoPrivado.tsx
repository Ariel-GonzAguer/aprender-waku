import ServerComponentConPrivate from "../../components/ejemplos/ServerComponenteConPrivate";
import ClientComponenteConPrivate from "../../components/ejemplos/ClientComponenteConPrivate";
import ClientBoundary from "../../components/ClientBoundary";

export default function PaginaConImagenPrivada() {

  return (
    <section className="flex flex-col justify-center items-center text-center mb-10">
      <p className="my-6">Server Component que usa imagen de `./private`</p>
      <ServerComponentConPrivate />
      <p className="my-6 text-amber-300 font-extrabold text-3xl">- - - - - - </p>
      <p className="my-6">Client Component que usa imagen de `./private`</p>
      <ClientBoundary texto="Error capturado con react-error-boundary en Client Component">
        <ClientComponenteConPrivate />
      </ClientBoundary>
    </section>
  )
}

export const getConfig = async () => {
  return {
    render: "static",
  } as const;
}
