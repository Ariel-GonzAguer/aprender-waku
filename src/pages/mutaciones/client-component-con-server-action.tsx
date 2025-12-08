import ClientComponentConServerAction from '../../components/ClientComponentConServerAction';
import { fetchRandomCat } from '../../actions/randomCatAPI';

export default function RutaDeClientComponentConServerAction() {

  return (
    <section className="flex flex-col justify-center items-center text-center mt-6 mb-10">
      <h2 className='mb-10'>Esta ruta muestra el uso de un Client Component con una Server Action pasada como prop</h2>
      <ClientComponentConServerAction funcionRandomCat={fetchRandomCat} />
    </section>
  )
}

export const getConfig = async () => {
  return {
    render: "static",
  } as const;
}