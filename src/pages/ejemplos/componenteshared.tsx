import { useId } from "react"

export default function SharedComponent() {
  // useId() debe llamarse en el cuerpo del componente, nunca dentro de loops, condiciones o funciones anidadas
  const id1 = useId();
  const id2 = useId();
  const id3 = useId();
  const id4 = useId();
  const id5 = useId();

  const ids = [id1, id2, id3, id4, id5];

  return (
    <section className="mt-6">
      <div className="p-6 bg-linear-to-r from-amber-300 to-red-600 text-black rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Componente Shared</h2>
        <p className="mb-3">Este componente puede renderizarse en cliente y servidor</p>
        <ul className="list-none space-y-2">
          <li>✓ No tiene estado</li>
          <li>✓ No usa APIs del navegador</li>
          <li>✓ No accede a funcionalidades exclusivas del servidor </li>
        </ul>
      </div>
      <p>ID generado por React con useID: {ids.join(", ")}</p>
    </section>
  )
}
