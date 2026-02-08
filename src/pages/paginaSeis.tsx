import { Slice } from 'waku';

export default function PaginaSeis() {

  return (
    <div className="flex flex-col justify-center items-center mt-10 text-2xl">
      <h2>Esta página utiliza tres Slices.</h2>
      <h3 className='m-1!'>Slice uno:</h3>
      <Slice id="seis" />
      <h3 className='mb-1!'>Slice dos:</h3>
      <Slice id="mil/seiscientos" />
      <h3 className='mb-1!'>Slice tres (lazy):</h3>
      <Slice id="lazyseis" lazy fallback={<p>Cargando lazy Slice...</p>} />
    </div>
  );
}

// como usamos 'static' debemos definir los slices que usaremos
export const getConfig = () => {
  return {
    render: 'static',
    slices: ['seis', 'mil/seiscientos'], // el slice 'lazyseis' no se incluye acá porque es lazy, no se carga automáticamente en el HTML estático, sino que se llama por separado cuando se necesite
  };
};