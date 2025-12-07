const urlJsonPlaceholder = "https://jsonplaceholder.typicode.com/posts";

export async function GET(request: Request): Promise<Response> {
  try {
    // primero probamos con el parámetro de consulta `id` (por ejemplo, /api/jsonPlaceholderPosts?id=1)
    const url = new URL(request.url);
    const idParam = url.searchParams.get('id');

    const id = idParam ?? (await (async () => {
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
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const response = await fetch(`${urlJsonPlaceholder}/${id}`);
    const posts = await response.json();

    return new Response(JSON.stringify(posts), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('GET error proxy:', error);
    return new Response(JSON.stringify({ error: 'Error fetching posts' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
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
    const idParam = url.searchParams.get('id');

    const updatedPost = await request.json();
    const id = idParam ?? updatedPost?.id;
    if (!id) {
      return new Response(JSON.stringify({ error: 'Missing id for update' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const response = await fetch(`${urlJsonPlaceholder}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedPost),
    });
    const post = await response.json();

    return new Response(JSON.stringify(post), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('PUT error proxy:', error);
    return new Response(JSON.stringify({ error: 'Error updating post' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function DELETE(request: Request): Promise<Response> {
  try {
    // acepramos el id  aceptamos el id del parámetro de consulta primero (por ejemplo, /api/jsonPlaceholderPosts?id=1) si no hay id ahí, intentamos con el cuerpo JSON
    const url = new URL(request.url);
    const idParam = url.searchParams.get('id');

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
      return new Response(JSON.stringify({ error: 'Missing id for delete' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
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
