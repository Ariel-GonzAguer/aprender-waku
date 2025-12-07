export default function handler(request: Request): Response {
  return Response.json(
    { message: "Default handler " + request.method },
    { status: 200 }
  );
}
