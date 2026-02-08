export default function RenderTemaData({ data }: { data: Record<string, any> }) {

  return (
    <>
      <title>{data.titulo}</title>
      <meta name="author" content={data.autor} />
      <meta name="keywords" content={data.tags.join(", ")} />
      <meta name="date" content={data.fecha} />

      <div className="text-center">

      <h2>{data.titulo}</h2>
      <p className='italic mb-3'>por {data.autor}</p>
      <p>última actualización: {data.fecha}</p>
      <hr />
      </div>

    </>
  )
}

export const getConfig = async () => {
  return {
    render: "static",
  } as const;
};
