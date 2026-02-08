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
      throw new Error(`API error: ${response.status}`);
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
}