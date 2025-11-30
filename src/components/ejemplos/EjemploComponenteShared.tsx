import {useId} from "react"

export default function EjemploSharedComponent() {

  function generarId() {
    let ids: string[] = [];
    for (let i = 0; i < 5; i++) {
      ids.push(useId());
    }
    console.log("ID generado:", ids);
    return ids.join(", ");
  }

  return (
    <section title="Ejemplo de Componente Shared" className="mt-6">
      <div className="p-6 bg-linear-to-r from-amber-300 to-red-600 text-black rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Componente Shared</h2>
        <p className="mb-3">Este componente puede renderizarse en cliente y servidor</p>
        <ul className="list-none space-y-2">
          <li>✓ No tiene estado</li>
          <li>✓ No usa APIs del navegador</li>
          <li>✓ No accede a funcionalidades exclusivas del servidor </li>
        </ul>
      </div>
      <p>ID generado por React con useID: {generarId()}</p>
    </section>
  )
}