export default function EjemploNoAsyncServerComponent() {

  function getData() {
    return "Este texto proviene de un Server Component que no usa async.";
  }

  return (
    <section className="p-4 my-6 bg-cyan-300 text-black rounded-lg">
      {getData()}
    </section>
  )
}

export const getConfig = async () => {
  return {
    render: "static",
  } as const;
}