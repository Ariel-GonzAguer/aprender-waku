const urlJsonPlaceholder = "https://jsonplaceholder.typicode.com/posts";

export async function GET(request: Request): Promise<Response> {
  try {
    const response = await fetch(`${urlJsonPlaceholder}/1`, {
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
