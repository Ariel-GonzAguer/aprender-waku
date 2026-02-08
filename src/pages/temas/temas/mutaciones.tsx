// [Siguiente: 12-manejo-de-estado →](/temas/12-manejo-de-estado)

// [← Volver](/temas/10-data-fetching)

import BotonesAvance from '../../../components/BotonesAvance';
import CodeBlock from '../../../components/CodeBlock';
import { Link } from 'waku';
import RenderTemaData from "../../../components/RenderTemaData";

export default function Mutaciones() {

  const data = {
    titulo: "11-Mutaciones",
    autor: "Ariel",
    fecha: "7-12-2025",
    tags: ["waku", "guía", "mutaciones"]
  };

  const codigo = {
    getJsonPlaceholder: `// src/pages/_api/getJsonPlaceholder.ts
const urlJsonPlaceholder = "https://jsonplaceholder.typicode.com/posts";

export async function GET(request: Request): Promise<Response> {
  try {
    const response = await fetch(\`\${urlJsonPlaceholder}/1\`, {
      method: "GET",
    });
    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
    });
  } catch (error) {
    console.error("GET error proxy:", error);
    return new Response(JSON.stringify({ error: "Error fetching post" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
    });
  }
};
`,
    deleteJsonPlaceholder: `// src/pages/_api/deleteJsonPlaceholder.ts
const urlJsonPlaceholder = "https://jsonplaceholder.typicode.com/posts";

export async function DELETE(request: Request): Promise<Response> {
  try {
    const response = await fetch(\`\${urlJsonPlaceholder}/1\`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(\`API error: \${response.status}\`);
    }
    return new Response(JSON.stringify({ message: "Post 1 eliminado" }), {
      headers: { "Content-Type": "application/json; charset=UTF-8" },
    });
  } catch (error) {
    console.error("DELETE error proxy:", error);
    return new Response(JSON.stringify({ error: "Error deleting post" }), {
      status: 500,
      headers: { "Content-Type": "application/json; charset=UTF-8" },
    });
  }
};
`,
    createJsonPlaceholder: `// src/pages/_api/createJsonPlaceholder.ts
    const urlJsonPlaceholder = "https://jsonplaceholder.typicode.com/posts";

export async function POST(request: Request): Promise<Response> {
  try {
    const newPost = {
      title: "Post Felino",
      body: "Hay un gato llamado Sundae de Caramelo, y es un muy bueno.",
      userId: 606,
    };

    const response = await fetch(urlJsonPlaceholder, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=UTF-8" },
      body: JSON.stringify(newPost),
    });
    if (!response.ok) {
      throw new Error(\`API error: \${response.status}\`);
    }
    const createdPost = await response.json();
    return new Response(JSON.stringify(createdPost), {
      headers: { "Content-Type": "application/json; charset=UTF-8" },
    });
  } catch (error) {
    console.error("POST error proxy:", error);
    return new Response(JSON.stringify({ error: "Error creating post" }), {
      status: 500,
      headers: { "Content-Type": "application/json; charset=UTF-8" },
    });
  }
};
`,
    rutaMutaciones: `// src/pages/mutaciones/index.tsx
'use client';

import { useState, useEffect } from "react";

export default function Mutaciones() {
  const [post1, setPost1] = useState<unknown>(null);
  const [catchAllResponse, setCatchAllResponse] = useState<unknown>(null);

  // Función para manejar el endpoint GET
  async function getPost1() {
    const response = await fetch(\`/getJsonPlaceholder\`,
      { method: 'GET', headers: { 'Content-Type': 'application/json; charset=utf-8' } }
    );
    const text = await response.text();
    let data;
    try {
      data = text ? JSON.parse(text) : null;
    } catch (error) {
      data = error instanceof Error ? error.message : text;
    }
    return data;
  };

  // Función para manejar el endpoint DELETE
  async function deletePost1() {
    const response = await fetch(\`/deleteJsonPlaceholder\`,
      { method: 'DELETE', headers: { 'Content-Type': 'application/json; charset=utf-8' } }
    );
    if (response.status === 204) {
      return { success: true, status: 204 };
    }

    const text = await response.text();
    let data;
    try {
      data = text ? JSON.parse(text) : null;
    } catch (error) {
      data = error instanceof Error ? error.message : text;
    }
    return data;
  };

  // Función para manejar el endpoint POST
  async function createPost() {
    const response = await fetch(\`/createJsonPlaceholder\`,
      { method: 'POST', headers: { 'Content-Type': 'application/json; charset=utf-8' } });
    const text = await response.text();
    let data: any;
    try {
      data = text ? JSON.parse(text) : null;
    } catch (error) {
      data = error instanceof Error ? error.message : text;
    }
    return data;
  };

  // función para manejar endpoint catch all
  async function handleCatchAll() {
    const response = await fetch(\`/otroEndpoint\`, {
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
    alert(\`Catch-All response: \${JSON.stringify(data)}\`);
    return data;
  };

  // Cargar el post 1 al montar el componente
  useEffect(() => {
    getPost1().then(data => setPost1(data));
  }, []);

  return (
    <section className="flex flex-col justify-center items-center text-center mb-10">
      <h2 className="text-4xl mb-6 font-extrabold">Esta página renderiza un Client Component, y muestra el uso de mutaciones con API endpoints</h2>
      <p>Este es el post 1 de JSONPlaceholder:</p>
      <pre className="bg-gray-700 p-4 rounded mt-4 mb-4 w-3/4 text-left overflow-x-auto">
        {post1 ? JSON.stringify(post1, null, 2) : 'Cargando...'}
      </pre>
      <span>- - - - - -</span>

      <p>Presionando el siguiente botón, eliminamos el post 11 de JSONPlaceholder</p>
      <button
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        onClick={async () => {
          const deletedPost = await deletePost1();
          alert(\`Post eliminado: \${JSON.stringify(deletedPost)}\`);
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
          alert(\`Post creado: \${JSON.stringify(newPost)}\`);
        }}
      >
        Crear nuevo Post
      </button>
      <span>- - - - - -</span>
      <p>Finalmente, el siguiente botón hace una petición al endpoint catch-all</p>
      <button
        className="mt-4 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        onClick={async () => {
          const response = await handleCatchAll();
          alert(\`Respuesta Catch-All: \${JSON.stringify(response)}\`);
        }}
      >
        Llamar endpoint Catch-All
      </button>
      <p className="mt-4">Respuesta Catch-All: {catchAllResponse ? JSON.stringify(catchAllResponse) : 'Esperando acción'}</p>
    </section>
  )
}; 
`,
    catchAllEndpoint: `// src/pages/_api/otroEndpoint.ts
export default function handler(request: Request): Response {
  return Response.json(
    { message: "Endpoint Catch-All " + request.method },
    { status: 200 }
  );
};
`,
    ejemploConfig: `// ./src/pages/_api/rss.xml.ts

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
`,
    action: `// src/actions/randomCatAPI.ts

"use server";

export async function fetchRandomCat(): Promise<string | null> {
  try {
    const response = await fetch("https://api.thecatapi.com/v1/images/search");
    const data = await response.json();
    console.log("Random cat data:", data);
    return data[0].url;
  } catch (error) {
    console.error("Error fetching random cat:", error);
    return null;
  }
};
`,
    componenteClienteConAction: `// src/components/ClientComponentConServerAction.tsx
'use client';

import { useState } from 'react';

export default function ClientComponentConServerAction({ funcionRandomCat }: { funcionRandomCat: () => Promise<string | null> }) {

  const [catImg, setCatImg] = useState<string | null>(null);

  async function handleFetchCat() {
    const catData = await funcionRandomCat();
    setCatImg(catData);
  }

  return (
    <section>
      <button
        className="bg-amber-300 hover:bg-red-600 text-black font-bold py-2 px-4 rounded cursor-pointer mb-6"
        onClick={handleFetchCat}
      >
        Fetch Random Cat
      </button>
      {catImg ? (
        <div>
          <img src={catImg} alt="Random Cat" />
        </div>
      ) : (
        <p className='mt-6'>Aún no se ha obtenido una imagen de gato.</p>
      )}
    </section>
  )
};
`,
    paginaConComponenteClienteConAction: ` // src/pages/mutaciones/actions.tsx
import ClientComponentConServerAction from '../../components/ClientComponentConServerAction';
import { fetchRandomCat } from '../../actions/randomCatAPI';

export default function RutaDeClientComponentConServerAction() {

  return (
    <section className="flex flex-col justify-center items-center text-center mt-6 mb-10">
      <h2 className='mb-10'>Esta ruta muestra el uso de un Client Component con una Server Action pasada como prop</h2>
      <ClientComponentConServerAction funcionRandomCat={fetchRandomCat} />
    </section>
  )
}

export const getConfig = async () => {
  return {
    render: "static",
  } as const;
};
`,
  };

  return (
    <>
      <RenderTemaData data={data} />

      <section className="tema">
        <h3>Introducción</h3>
        <p>Mutar data se puede hacer de dos formas:</p>
        <ul>
          <li>→ Con Server Actions.</li>
          <li>→ Con API endpoints</li>
        </ul>

        <h4>API endpoints</h4>

        <p>Para crear un API endpoint, creamos un archivo dentro de la carpeta `src/pages/_api` y exportamos funciones que correspondan a los métodos HTTP que queramos manejar `GET`, `HEAD`, `POST`, `PUT`, `DELETE`, `CONNECT`, `OPTIONS`, `TRACE`, or `PATCH`.</p>

        <p>El nombre del archivo determina la ruta del endpoint, y cada función recibe un objeto (web) estándar `Request` y debe devolver un objeto (web) estándar `Response`.</p>

        <p>Acá código de tres endpoints que se usan en este proyecto:</p>
        <CodeBlock>
          {codigo.getJsonPlaceholder}
        </CodeBlock>
        <CodeBlock>
          {codigo.deleteJsonPlaceholder}
        </CodeBlock>
        <CodeBlock>
          {codigo.createJsonPlaceholder}
        </CodeBlock>

        <p>Para acceder a los endpoints debemos usar el siguiente patrón:<br />
          archivo `/_api/nombreDelArchivo.tsx` → `/getJsonPlaceholder`.</p>

        <p>Para usar estos endpoints en Client Components, usamos la función `fetch` estándar de JavaScript.</p>

        <p>Alternativamente, podemos crear un endpoint "catch-all" que responda a todos las solicitudes:</p>

        <CodeBlock>
          {codigo.catchAllEndpoint}
        </CodeBlock>

        <p>En este caso, el endpoint responderá a todas las solicitudes que no coincidan con ningún otro endpoint definido en `src/pages/_api`.</p>

        <p>Acá el código de la página para `/mutaciones` que usa los endpoints anteriores para hacer mutaciones:</p>
        <CodeBlock>
          {codigo.rutaMutaciones}
        </CodeBlock>

        <p>Puede ver la página siguiendo este enlace → <Link to="/mutaciones">/mutaciones</Link> y probar los botones para ver las mutaciones en acción.</p>

        <h5>Configurando API routes</h5>

        <p>Las rutas API son dinámicas de forma predeterminada, pero si se usarán para crear un recurso estático, como un documento XML, puede exportar la función getConfig que devuelva un objeto con `render: "static"`.</p>

        <p>Acá el ejemplo de la documentación oficial:</p>

        <CodeBlock>
          {codigo.ejemploConfig}
        </CodeBlock>

        <h4>Server Actions</h4>
        <p>Las Server Actions (acciones del servidor) nos permiten definir y ejecutar <strong>de manera segura</strong> funciones en el servidor, sin la necesidad de crear API endpoints explícitos. Por ejemplo, podemos hacer un `POST` con una Server Action con solo un fetch estándar de JavaScript.</p>

        <h5>Definiendo y protegiendo Actions/Acciones</h5>

        <p>La directiva `"use server"` marca una función asíncrona como una Server Action. Waku automáticamente crea una referencia de la acción, que es pasada como `prop` o importada a Client Components.</p>

        <p>Si la directiva la colocamos en la primera línea del archivo, todas las funciones exportadas en ese archivo serán Server Actions. Si la directiva la colocamos <strong>al incio del cuerpo de la función</strong>, solo esa función será una Server Action.</p>

        <p>Importante:</p>
        <ul>
          <li>→ Hay que tener cuidado de donde usar esta directiva, para no crear sin querer 'endpoints' que no deberían existir. Los 'endpoints' creados por server actions <strong>no están protegidos</strong> a menos que agregue su propia lógica de autenticación y autorización dentro del cuerpo de la función.</li>
          <li>→ La directiva `"use server"` <strong>no tiene relación</strong> con la directiva `"use client"`. No marca un componente como servidor y no debe colocarse al principio de los Componentes de Servidor.</li>
          <li>→ Se sugiere colocar las actions en la carpetas `src/actions` o `src/server/actions`.</li>
        </ul>

        <h5>Creando y consumiendo una Server Action</h5>

        <p>Al crear una Server Action "en línea" dentro de un Server Component, se puede pasar como `prop` a un Client Component.</p>
        <p>Acá el ejemplo de una Server Action que obtiene una imagen aleatoria de un gato desde una API externa:</p>

        <CodeBlock>
          {codigo.action}
        </CodeBlock>

        <p>Nótese que la directiva `"use server"` está al inicio del del archivo, por lo que toda la función es una Server Action. El `console.log` se mostrará en la consola del servidor, no en la del navegador.</p>

        <p>Acá el Client Component que consume la Server Action anterior:</p>
        <CodeBlock>
          {codigo.componenteClienteConAction}
        </CodeBlock>

        <p>En este componente, la función `funcionRandomCat` es pasada como `prop`.</p>

        <p>Acá la página que renderiza ese Componente de Cliente:</p>

        <CodeBlock>
          {codigo.paginaConComponenteClienteConAction}
        </CodeBlock>

        <p>Para ver el resultado visite  → <Link to="/mutaciones/actions">esta ruta</Link> y presione el botón "Fetch Random Cat". Nótese en este caso que la Server Action se importa directamente en el Server Component y se pasa como `prop` al Client Component.</p>

        <h5>Invocando Server Actions</h5>

        <p>Podemos usar/invocar Server Actions a través de handlers de eventos como `onClick` o `onSubmit` (como vimos en el ejemplos anterior con el botón **Fetch Random Cat** ) o con el hook `useEffect`, según las condiciones que queramos.</p>

        <p>También se pueden invocar mediante una prop `action` en elementos nativos `{"<form>"}`. En este caso, la Server Action recibirá automáticamente un parámetro de `FormData` con todos los valores de los campos del formulario, <strong>incluyendo los ocultos </strong>.</p>

        <p>Para ver ejemplos sobre esto puede visitar → <a href="https://waku.gg/#invoking-actions">el siguiente enlace</a>.</p>

        <BotonesAvance
          rutaSiguiente="/temas/temas/manejodeestado"
          rutaAnterior="/temas/temas/datafetching"
          textoSiguiente="12-Manejo de estado"
          textoAnterior="10-Data fetching"
        />
      </section>
    </>
  )
};
