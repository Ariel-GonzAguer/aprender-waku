import { Slice } from 'waku';

export default function PaginaSeis() {

  return (
    <div>
      <Slice id="seis" />
      <Slice id="mil/seiscientos" />
    </div>
  );
}

// como usamos 'static' debemos definir los slices que usaremos
export const getConfig = () => {
  return {
    render: 'dynamic',
    slices: ['seis', 'mil/seiscientos'],
  };
};