export async function POST(request: Request) {
  try {
    const body = await request.text();
    const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    });

    const text = await res.text();
    return new Response(text, {
      status: res.status,
      headers: { 'content-type': 'application/json; charset=utf-8' },
    });
  } catch (err: any) {
    console.error('API proxy POST error:', err);
    return new Response(JSON.stringify({ error: 'Failed to create remote post' }), { status: 502, headers: { 'content-type': 'application/json' } });
  }
}
