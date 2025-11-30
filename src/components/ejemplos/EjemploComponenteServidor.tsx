export default async function EjemploComponenteServidor() {

  /**
   * Hace fetch a un post de JSONPlaceholder.
   * @returns {Promise<any>} Una promesa que resuelve con los datos del post.
   */
  async function fetchPosts(): Promise<any> {
    const postUno = await fetch(
      "https://jsonplaceholder.typicode.com/posts/1"
    );
    return postUno.json().then((data) => data.title);
  }

  return (
    <section title="Ejemplo de Server Component" className="p-6 border border-gray-300 rounded-lg mb-6">
      <h2 className="text-2xl font-bold mb-4">Server Component</h2>
      <p className="mb-6">El siguiente dato es el título del post 1 de JSONPlaceholder:</p>
      <code>
        {await fetchPosts()}
      </code>
      
    </section>
  );
}

export const getConfig = async () => {
  return {
    render: "dynamic",
  } as const;
};
