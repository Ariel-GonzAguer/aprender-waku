/**
 * Cloudflare Pages Function - API Routes
 * Implementa los handlers de API desde src/pages/api/*
 */

const urlJsonPlaceholder = "https://jsonplaceholder.typicode.com/posts";

export const onRequest = async (context: any) => {
  const { request } = context;
  const url = new URL(request.url);
  const pathname = url.pathname;
  const method = request.method;

  // Extraer el path de API después de /api/
  const apiPath = pathname
    .replace("/api/", "")
    .replace(/\/$/, "")
    .split("?")[0];

  console.log(`API Request: ${method} ${pathname} -> apiPath: "${apiPath}"`);

  // ============================================
  // GET /api/jsonPlaceholderPosts
  // ============================================
  if (apiPath === "jsonPlaceholderPosts" && method === "GET") {
    try {
      const idParam = url.searchParams.get("id");

      if (!idParam) {
        // Retornar lista completa de posts
        const response = await fetch(urlJsonPlaceholder);
        const posts = await response.json();
        return Response.json(posts);
      }

      // Retornar post específico por ID
      const response = await fetch(`${urlJsonPlaceholder}/${idParam}`);
      const post = await response.json();
      return Response.json(post);
    } catch (error: any) {
      console.error("jsonPlaceholderPosts GET error:", error);
      return Response.json(
        { error: "Error fetching posts", message: error?.message },
        { status: 500 }
      );
    }
  }

  // ============================================
  // POST /api/jsonPlaceholderPosts
  // ============================================
  if (apiPath === "jsonPlaceholderPosts" && method === "POST") {
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
      return Response.json(createdPost, { status: 201 });
    } catch (error: any) {
      console.error("jsonPlaceholderPosts POST error:", error);
      return Response.json(
        { error: "Error creating post", message: error?.message },
        { status: 500 }
      );
    }
  }

  if (apiPath === "jsonPlaceholderPosts" && method === "PUT") {
    try {
      // le damos preferencia al id del parámetro de consulta (/api/jsonPlaceholderPosts?id=1) en lugar del cuerpo
      const url = new URL(request.url);
      const idParam = url.searchParams.get("id");

      const updatedPost = await request.json();
      const id = idParam ?? updatedPost?.id;
      if (!id) {
        return new Response(
          JSON.stringify({ error: "Missing id for update" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
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

  if (apiPath === "jsonPlaceholderPosts" && method === "DELETE") {
    try {
      // aceptamos el id del parámetro de consulta primero (por ejemplo, /api/jsonPlaceholderPosts?id=1) si no hay id ahí, intentamos con el cuerpo JSON
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
        return new Response(
          JSON.stringify({ error: "Missing id for delete" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
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

  // ============================================
  // GET /api/otroEndpoint
  // ============================================
  if (apiPath === "otroEndpoint" && method === "GET") {
    return Response.json(
      { message: `Endpoint Catch-All ${method}` },
      { status: 200 }
    );
  }

  // ============================================
  // Rutas no encontradas
  // ============================================
  if (apiPath === "" || apiPath === "/") {
    return Response.json(
      {
        error: "No API endpoint specified",
        availableEndpoints: [
          "/api/jsonPlaceholderPosts - GET/POST",
          "/api/otroEndpoint - GET",
        ],
      },
      { status: 400 }
    );
  }

  return Response.json(
    {
      error: `Endpoint /api/${apiPath} not found`,
      availableEndpoints: [
        "/api/jsonPlaceholderPosts - GET/POST",
        "/api/otroEndpoint - GET",
      ],
    },
    { status: 404 }
  );
};
