export default function SliceSeiscientos() {

  return (
    <section className="flex flex-col justify-center items-center mt-10">
      <p className="m-1!">¿Qué tal 600 slices, pero de una mini pizza?</p>
      <p className="m-1!">🍕 x 600</p>
      <p className="text-3xl m-1!">🙀</p>
    </section>
  )
}

export const getConfig = () => {
  return {
    render: 'static',
  };
};
