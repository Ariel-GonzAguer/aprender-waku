'use client';

import { useState, useEffect } from "react";

export default function Mutaciones() {
  const [post1, setPost1] = useState<unknown>(null);
  const [catchAllResponse, setCatchAllResponse] = useState<unknown>(null);

  // Función para manejar el endpoint GET
  async function getPost1(id: number) {
    const response = await fetch(`/api/jsonPlaceholderPosts?id=${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const text = await response.text();
    let data: any;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }
    alert(`GET response: ${JSON.stringify(data)}`);
    return data;
  };

  // Función para manejar el endpoint DELETE
  async function deletePost(id: number) {
    const response = await fetch(`/api/jsonPlaceholderPosts?id=${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.status === 204) {
      alert('DELETE response: 204 No Content. El post fue eliminado correctamente.');
      return { success: true, status: 204 };
    }

    const text = await response.text();
    let data: any;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }
    alert(`DELETE response: ${JSON.stringify(data)}. El post fue eliminado correctamente.`);
    return data;
  };

  // Función para manejar el endpoint POST
  async function createPost() {
    const post = {
      title: 'Post Felino',
      body: 'Hay un gato llamado Sundae de Caramelo, y es un muy bueno.',
      userId: 123
    };

    const response = await fetch(`/api/jsonPlaceholderPosts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(post),
    });
    const text = await response.text();
    let data: any;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }
    alert(`POST response: ${JSON.stringify(data)}`);
    return data;
  };

  // Función para manejar el endpoint PUT
  async function updatePost(id: number, updatedPost: any) {
    const response = await fetch(`/api/jsonPlaceholderPosts?id=${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedPost),
    });
    const text = await response.text();
    let data: any;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }
    alert(`PUT response: ${JSON.stringify(data)}`);
    return data;
  };

  // función para manejar endpoint catch all
  async function handleCatchAll() {
    const response = await fetch(`/api/otroEndpoint`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const text = await response.text();
    let data: any;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }
    setCatchAllResponse(data);
    alert(`Catch-All response: ${JSON.stringify(data)}`);
    return data;
  };

  // Cargar el post 1 al montar el componente
  useEffect(() => {
    getPost1(1).then(data => setPost1(data));
  }, []);

  return (
    <section className="flex flex-col justify-center items-center text-center mb-10">
      <h2 className="text-4xl mb-6 font-extrabold">Esta página muestra es un Client Component, y muestra el uso de mutaciones con API endpoints</h2>
      <p>Este es el post 1: {post1 ? JSON.stringify(post1) : 'Cargando...'} </p>
      <span>- - - - - -</span>

      <p>Presionando el siguiente botón, eliminamos el post 11 de JSONPlaceholder</p>
      <button
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        onClick={async () => {
          const deletedPost = await deletePost(11);
          alert(`Post eliminado: ${JSON.stringify(deletedPost)}`);
        }}
      >
        Eliminar Post 11
      </button>
      <span>- - - - - -</span>
      <p>Ahora con el siguiente botón creamos un nuevo post con el siguiente body: <br />
        title: Post Felino, body: Hay un gato llamado Sundae de Caramelo, y es un muy bueno., userId: 123</p>
      <button
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        onClick={async () => {
          const newPost = await createPost();
          alert(`Post creado: ${JSON.stringify(newPost)}`);
        }}
      >
        Crear nuevo Post
      </button>
      <span>- - - - - -</span>
      <p>Con el siguiente botón hacemos un PUT al elemento 1</p>
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={async () => {
          const updatedPost = await updatePost(1, { title: 'Post Actualizado', body: 'El contenido ha sido actualizado.', userId: 1 });
          alert(`Post actualizado: ${JSON.stringify(updatedPost)}`);
        }}
      >
        Actualizar Post 1
      </button>
      <span>- - - - - -</span>
      <p>Finalmente, el siguiente botón hace una petición al endpoint catch-all</p>
      <button
        className="mt-4 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        onClick={async () => {
          const response = await handleCatchAll();
          alert(`Respuesta Catch-All: ${JSON.stringify(response)}`);
        }}
      >
        Llamar endpoint Catch-All
      </button>
      <p className="mt-4">Respuesta Catch-All: {catchAllResponse ? JSON.stringify(catchAllResponse) : 'Esperando acción'}</p>
    </section>
  )
}
