import ServerComponentConPrivate from "../../components/ejemplos/servercomponenteconprivate";

export default function PaginaConTextoPrivado() {

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
