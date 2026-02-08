const urlJsonPlaceholder = "https://jsonplaceholder.typicode.com/posts";

export async function DELETE(request: Request): Promise<Response> {
  try {
    const response = await fetch(`${urlJsonPlaceholder}/1`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
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
