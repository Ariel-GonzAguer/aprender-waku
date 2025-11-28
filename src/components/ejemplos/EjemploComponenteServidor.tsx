// server component

export default async function EjemploComponenteServidor() {
  async function fetchPosts() {
    const productoUno = await fetch(
      "https://jsonplaceholder.typicode.com/posts/1"
    );
    return productoUno.json();
  }

  return (
    <div>
      <h2>Componente de Servidor</h2>
      <p>El siguiente dato es el título del post 1 de JSONPlaceholder:</p>
      <code>
        {JSON.stringify((await fetchPosts()).title, null, 2)}
      </code>
    </div>
  );
}

export const getConfig = async () => {
  return {
    render: "dynamic",
  } as const;
};
