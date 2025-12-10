export default async function AcercaDe() {

  return (
    <section className="flex flex-col justify-center items-center text-center mt-10">
      <p>Los íconos animados usados en este proyecto son de <a href="http://https://lordicon.com/" target="_blank" rel="noopener noreferrer" className='text-sky-300 font-bold'>Lordicon</a>.</p>
      <p>Agradecimiento directo a Daishi Kato por crear el framework, y por apoyar cuando hubo algún problema con el desarrollo de este proyecto.</p>
    
    </section>
  );
}


export const getConfig = async () => {
  return {
    render: 'static',
  } as const;
};
