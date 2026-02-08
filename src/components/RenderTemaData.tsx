export default function RenderTemaData({ data }: { data: Record<string, any> }) {

  return (
      <>
        <title>{data.titulo}</title>
        <meta name="author" content={data.autor} />
        <meta name="keywords" content={data.tags.join(", ")} />
        <meta name="date" content={data.fecha} />
      </>
  )
}

export const getConfig = async () => {
  return {
    render: "static",
  } as const;
};
