export default function handler(request: Request): Response {
  return Response.json(
    { message: "Endpoint Catch-All " + request.method },
    { status: 200 }
  );
}
