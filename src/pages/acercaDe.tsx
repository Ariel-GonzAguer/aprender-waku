export default async function AcercaDe() {

  return (
    <section className="flex flex-col justify-center gap-4 items-center text-center mt-10 max-2xl:m-auto px-4 text-balance">
      <p>Hola. Mi nombre es Ariel y soy Desarrollador Web y UX Designer. Tengo una pequeña agencia de Desarrollo Web llamada <a href="https://gatorojolab.com" target="_blank" rel="noopener noreferrer" className="text-red-600 font-bold">Gato Rojo Lab</a>. Puede visitar la página y ver un poco de lo que hago cuando estoy con VS Code abierto.</p>
      <p>Este proyecto fue creado aprendiendo a usar Waku, literalmente leyendo la documentación y experimentando.
        <br />Y como dice en la página principal, fui inspirado a hacer esta guía por "la impresionante deficiencia de varios modelos de IA para crear una guía decente".
      </p>
      <p>Leer la documentación oficial (o guías basadas en esta) es fundamental para entender cómo funciona una herramienta.</p>

      <h2 className="mt-10 text-2xl text-amber-300">Atributos y agradecimientos:</h2>
      <ul>
        <li>Atribución: Los íconos animados usados en este proyecto son de <a href="http://https://lordicon.com/" target="_blank" rel="noopener noreferrer" className='text-sky-300 font-bold'>Lordicon</a>.</li>
        <li>Agradecimiento: a Daishi Kato por responder algunas preguntas que surgieron durante el desarrollo.</li>
      </ul>
    </section>
  );
}


export const getConfig = async () => {
  return {
    render: 'static',
  } as const;
};
