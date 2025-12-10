---
titulo: "11-mutaciones"
autor: "Ariel"
fecha: "7-12-2025"
tags: ["waku", "guía", "mutaciones"]
---

Mutar data se puede hacer de dos formas:

- -> Con Server Actions.
- -> Con API endpoints.

#### API endpoints

Para crear un API endpoint, creamos un archivo dentro de la carpeta `src/pages/api` y exportamos funciones que correspondan a los métodos HTTP que queramos manejar `GET`, `HEAD`, `POST`, `PUT`, `DELETE`, `CONNECT`, `OPTIONS`, `TRACE`, or `PATCH`.
El nombre del archivo determina la ruta del endpoint, y cada función recibe un objeto estándar `Request` y debe devolver un objeto estándar `Response`.

Acá un ejemplo de un endpoint que maneja varios métodos HTTP con los posts de JSONPlaceholder:

```tsx
// src/pages/api/jsonPlaceholderPosts.ts
const urlJsonPlaceholder = "https://jsonplaceholder.typicode.com/posts";

export async function GET(request: Request): Promise<Response> {
  try {
    // primero probamos con el parámetro de consulta `id` (por ejemplo, /api/jsonPlaceholderPosts?id=1)
    const url = new URL(request.url);
    const idParam = url.searchParams.get("id");

    const id =
      idParam ??
      (await (async () => {
        try {
          const body = await request.json();
          return body?.id;
        } catch {
          return undefined;
        }
      })());

    if (!id) {
      // si no hay id -> devolver la lista completa
      const response = await fetch(urlJsonPlaceholder);
      const posts = await response.json();
      return new Response(JSON.stringify(posts), {
        headers: { "Content-Type": "application/json" },
      });
    }

    const response = await fetch(`${urlJsonPlaceholder}/${id}`);
    const posts = await response.json();

    return new Response(JSON.stringify(posts), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("GET error proxy:", error);
    return new Response(JSON.stringify({ error: "Error fetching posts" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function POST(request: Request): Promise<Response> {
  try {
    const newPost = await request.json();
    const response = await fetch(urlJsonPlaceholder, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPost),
    });
    const createdPost = await response.json();

    return new Response(JSON.stringify(createdPost), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error creating post" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

export async function PUT(request: Request): Promise<Response> {
  try {
    // le damos preferencia al id del parámetro de consulta (/api/jsonPlaceholderPosts?id=1) en lugar del cuerpo
    const url = new URL(request.url);
    const idParam = url.searchParams.get("id");

    const updatedPost = await request.json();
    const id = idParam ?? updatedPost?.id;
    if (!id) {
      return new Response(JSON.stringify({ error: "Missing id for update" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const response = await fetch(`${urlJsonPlaceholder}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedPost),
    });
    const post = await response.json();

    return new Response(JSON.stringify(post), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("PUT error proxy:", error);
    return new Response(JSON.stringify({ error: "Error updating post" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function DELETE(request: Request): Promise<Response> {
  try {
    // acepramos el id  aceptamos el id del parámetro de consulta primero (por ejemplo, /api/jsonPlaceholderPosts?id=1) si no hay id ahí, intentamos con el cuerpo JSON
    const url = new URL(request.url);
    const idParam = url.searchParams.get("id");

    let id: string | null = idParam;
    if (!id) {
      try {
        const body = await request.json();
        // ensure we keep `null` instead of `undefined` to match type
        id = body?.id ?? null;
      } catch (err) {
        id = null;
      }
    }

    if (!id) {
      return new Response(JSON.stringify({ error: "Missing id for delete" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    await fetch(`${urlJsonPlaceholder}/${id}`, {
      method: "DELETE",
    });

    return new Response(null, {
      status: 204,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error deleting post" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
```

Podemos acceder a los endpoints debemos usar el siguiente patrón:
`/api/nombreDelArchivoSinExtension`, por ejemplo: `/api/jsonPlaceholderPosts`.
Para usar estos endpoints en Client Components, usamos la función `fetch` estándar de JavaScript.
Acá el código de la página `/mutaciones` que usa el endpoint anterior para hacer mutaciones:

```tsx
// src/pages/mutaciones/index.tsx
"use client";

import { useState, useEffect } from "react";

export default function Mutaciones() {
  const [post1, setPost1] = useState<unknown>(null);
  const [catchAllResponse, setCatchAllResponse] = useState<unknown>(null);

  // Función para manejar el endpoint GET
  async function getPost1(id: number) {
    const response = await fetch(`/api/jsonPlaceholderPosts?id=${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
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
  }

  // Función para manejar el endpoint DELETE
  async function deletePost(id: number) {
    const response = await fetch(`/api/jsonPlaceholderPosts?id=${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status === 204) {
      alert(
        "DELETE response: 204 No Content. El post fue eliminado correctamente."
      );
      return { success: true, status: 204 };
    }

    const text = await response.text();
    let data: any;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }
    alert(
      `DELETE response: ${JSON.stringify(
        data
      )}. El post fue eliminado correctamente.`
    );
    return data;
  }

  // Función para manejar el endpoint POST
  async function createPost() {
    const post = {
      title: "Post Felino",
      body: "Hay un gato llamado Sundae de Caramelo, y es un muy bueno.",
      userId: 123,
    };

    const response = await fetch(`/api/jsonPlaceholderPosts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
  }

  // Función para manejar el endpoint PUT
  async function updatePost(id: number, updatedPost: any) {
    const response = await fetch(`/api/jsonPlaceholderPosts?id=${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
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
  }

  // función para manejar endpoint catch all
  async function handleCatchAll() {
    const response = await fetch(`/api/otroEndpoint`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
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
  }

  // Cargar el post 1 al montar el componente
  useEffect(() => {
    getPost1(1).then((data) => setPost1(data));
  }, []);

  return (
    <section className="flex flex-col justify-center items-center text-center mb-10">
      <h2 className="text-4xl mb-6 font-extrabold">
        Esta página muestra es un Client Component, y muestra el uso de
        mutaciones con API endpoints
      </h2>
      <p>Este es el post 1: {post1 ? JSON.stringify(post1) : "Cargando..."} </p>
      <span>- - - - - -</span>

      <p>
        Presionando el siguiente botón, eliminamos el post 11 de JSONPlaceholder
      </p>
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
      <p>
        Ahora con el siguiente botón creamos un nuevo post con el siguiente
        body: <br />
        title: Post Felino, body: Hay un gato llamado Sundae de Caramelo, y es un
        muy bueno., userId: 123
      </p>
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
          const updatedPost = await updatePost(1, {
            title: "Post Actualizado",
            body: "El contenido ha sido actualizado.",
            userId: 1,
          });
          alert(`Post actualizado: ${JSON.stringify(updatedPost)}`);
        }}
      >
        Actualizar Post 1
      </button>
      <span>- - - - - -</span>
      <p>
        Finalmente, el siguiente botón hace una petición al endpoint catch-all
      </p>
      <button
        className="mt-4 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        onClick={async () => {
          const response = await handleCatchAll();
          alert(`Respuesta Catch-All: ${JSON.stringify(response)}`);
        }}
      >
        Llamar endpoint Catch-All
      </button>
      <p className="mt-4">
        Respuesta Catch-All:{" "}
        {catchAllResponse
          ? JSON.stringify(catchAllResponse)
          : "Esperando acción"}
      </p>
    </section>
  );
}
```

Puede visitar la página siguiente este enlace → [/mutaciones](/mutaciones) y probar los botones para ver las mutaciones en acción.

Alternativamente, podemos crear un endpoint "catch-all" que responda a todos las solicitudes.

```tsx
// src/pages/api/otroEndpoint.ts
export default function handler(request: Request): Response {
  return Response.json(
    { message: "Endpoint Catch-All " + request.method },
    { status: 200 }
  );
}
```

##### Configurando API routes

Las rutas API son dinámicas de forma predeterminada, pero si se usarán para crear un recurso estático, como un documento XML, puede exportar una función getConfig que devuelva un objeto de configuración con la propiedad de representación establecida en 'estática'. Acá el ejemplo de la documentación oficial:

```tsx
// ./src/pages/api/rss.xml.ts

export const GET = async () => {
  const rssFeed = generateRSSFeed(items);

  return new Response(rssFeed, {
    headers: {
      'Content-Type': 'application/rss+xml',
    },
  });
};

export const getConfig = async () => {
  return {
    render: 'static',
  } as const;
};

const items = [
  {
    title: `Announcing API routes`,
    description: `Easily add public API endpoints to your Waku projects.`
    pubDate: `Tue, 1 Apr 2025 00:00:00 GMT`,
    link: `https://waku.gg/blog/api-routes`,
  },
  // ...
];

const generateRSSFeed = (items) => {
  const itemsXML = items
    .map(
      (item) => `
        <item>
          <title>${item.title}</title>
          <link>${item.link}</link>
          <pubDate>${item.pubDate}</pubDate>
          <description>${item.description}</description>
        </item>
      `,
    )
    .join('');

  return `
    <?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
      <atom:link href="https://waku.gg/api/rss.xml" rel="self" type="application/rss+xml" />
      <title>Waku</title>
      <link>https://waku.gg</link>
      <description>The minimal React framework</description>
      ${itemsXML}
    </channel>
    </rss>
  `;
};
```

#### Server Actions

Las Server Actions (acciones del servidor) nos permiten definir y ejecutar **de manera segura** funciones, sin la necesidad de crear API endpoints explícitos. Por ejemplo, podemos hacer un `POST` con una Server Action con solo un fetch estándar de JavaScript.

##### Definiendo y protegiendo Actions/Acciones

La directiva `"use server"` marca una función asíncrona como una Server Action. Waku automáticamente crea una referencia de la acción, que es pasada como `prop` o importada a Client Components.

Si la directiva la colocamos en la primera línea del archivo, todas las funciones exportadas en ese archivo serán Server Actions. Si la directiva la colocamos **al incio del cuerpo de la función**, solo esa función será una Server Action.

**Importante:**

- -> Hay que tener cuidado de donde usar esta directiva, para no crear sin querer 'endpoints' que no deberían existir. Los 'endpoints' creados por server actions **no están protegidos** a menos que agregue su propia lógica de autenticación y autorización dentro del cuerpo de la función.
- -> La directiva `"use server"` **no tiene relación** con la directiva `"use client"`. No marca un componente como servidor y no debe colocarse al principio de los componentes de servidor.
- -> Se sugiere colocar las en la carpetas `src/actions` o `src/server/actions`.

##### Creando y consumiendo una Server Action

Al crear una Server Action "en línea" dentro de un Server Component, se puede pasar como `prop` a un Client Component.
Acá el ejemplo de una Server Action que obtiene una imagen aleatoria de un gato desde una API externa:

```tsx
// src/actions/randomCatAPI.ts

export async function fetchRandomCat(): Promise<string | null> {
  "use server";
  try {
    const response = await fetch("https://api.thecatapi.com/v1/images/search");
    const data = await response.json();
    console.log("Random cat data:", data);
    return data[0].url;
  } catch (error) {
    console.error("Error fetching random cat:", error);
    return null;
  }
}
```

Nótese que la directiva `"use server"` está al inicio del cuerpo de la función `fetchRandomCat`, por lo que solo esa función es una Server Action. El `console.log` se mostrará en la consola del servidor, no en la del navegador.

Acá el Client Component que consume la Server Action anterior:

```tsx
// src/components/ClientComponentConServerAction.tsx
"use client";

import { useState } from "react";

export default function ClientComponentConServerAction({
  funcionRandomCat,
}: {
  funcionRandomCat: () => Promise<string | null>;
}) {
  const [catImg, setCatImg] = useState<string | null>(null);

  async function handleFetchCat() {
    const catData = await funcionRandomCat();
    setCatImg(catData);
  }

  return (
    <section>
      <button
        className="bg-amber-300 hover:bg-red-600 text-black font-bold py-2 px-4 rounded cursor-pointer"
        onClick={handleFetchCat}
      >
        Fetch Random Cat
      </button>
      {catImg ? (
        <div>
          <img src={catImg} alt="Random Cat" />
        </div>
      ) : (
        <p className="mt-6">Aún no se ha obtenido una imagen de gato.</p>
      )}
    </section>
  );
}
```

En este componente, la función `funcionRandomCat` es pasada como `prop`.

Y esta es la página (con getConfig 'static') que usa el Client Component anterior, pasando la Server Action como `prop`:

```tsx
// src/pages/mutaciones/client-component-con-server-action.tsx
import ClientComponentConServerAction from "../../components/ClientComponentConServerAction";
import { fetchRandomCat } from "../../actions/randomCatAPI";

export default function RutaDeClientComponentConServerAction() {
  return (
    <section className="flex flex-col justify-center items-center text-center mt-6 mb-10">
      <h2 className="mb-10">
        Esta ruta muestra el uso de un Client Component con una Server Action
        pasada como prop
      </h2>
      <ClientComponentConServerAction funcionRandomCat={fetchRandomCat} />
    </section>
  );
}

export const getConfig = async () => {
  return {
    render: "static",
  } as const;
};
```

Para ver el resultado visite esta ruta → [Ver resultado de Client Component con Server Action](/mutaciones/client-component-con-server-action) y presione el botón "Fetch Random Cat". Nótese en este caso que la Server Action se importa directamente en el Server Component y se pasa como `prop` al Client Component.

##### Invocando Server Actions

Podemos usar/invocar Server Actions a través de _handlers_ de eventos como `onClick` o `onSubmit` (como vimos en el ejemplos anterior con el botón **Fetch Random Cat** ) o con el hook `useEffect`, según las condiciones que queramos.

También se pueden invocar mediante una prop `action` en elementos nativos `<form>`. En este caso, la Server Action recibirá automáticamente un parámetro de `FormData` con todos los valores de los campos del formulario, **incluiyendo los ocultos**.
Veamos los ejemplos de la documentación oficial:

```tsx
// ./src/actions/send-message.ts
"use server";

import db from "some-db";

export async function sendMessage(formData: FormData) {
  const message = formData.get("message");

  await db.messages.create(message);
}
```

```tsx
// ./src/components/create-todo-button.tsx
"use client";

import { sendMessage } from "../actions/send-message";

export const ContactForm = () => {
  return (
    <form action={sendMessage}>
      <textarea name="message" rows={4} />
      <input type="hidden" name="secret-message" value="This too!" />
      <button type="submit">Send message</button>
    </form>
  );
};
```

Si necesitamos pasar argumentos adicionales a la acción del formulario, más allá de sus campos nativos, podemos usar el método `bind` para crear una acción de servidor **extendida** con los argumentos adicionales.

```tsx
// ./src/components/create-todo-button.tsx
"use client";

import { sendMessage } from "../actions/send-message";

export const ContactForm = ({ author = "guest" }) => {
  const sendMessageWithAuthor = sendMessage.bind(null, author);

  return (
    <form action={sendMessageWithAuthor}>
      <textarea name="message" rows={4} />
      <button type="submit">Send message</button>
    </form>
  );
};
```

La documetación oficial sugiere (o eso interpreto 😸) usar Server Actions, ya que se integran con varias funcionalidades de React, como los hooks `useTransition`, `useActionState` y `useOptimistic`. Waku es un (meta)framework **_React First_**.
El uso de una Server Action o un API endpoint depende de las necesidades específicas de la aplicación y de nuestras preferencias desarrollando.

[Siguiente: 12-manejoDeEstado →](/temas/12-manejoDeEstado)

[← Volver](/temas/10-dataFetching)
