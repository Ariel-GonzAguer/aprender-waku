'use client';

import { useState } from 'react';

export default function ClientComponentConServerAction({ funcionRandomCat }: { funcionRandomCat: () => Promise<string | null> }) {

  const [catImg, setCatImg] = useState<string | null>(null);

  async function handleFetchCat() {
    const catData = await funcionRandomCat();
    setCatImg(catData);
  }

  return (
    <section>
      <button
        className="bg-amber-300 hover:bg-red-600 text-black font-bold py-2 px-4 rounded cursor-pointer mb-6"
        onClick={handleFetchCat}
      >
        Fetch Random Cat
      </button>
      {catImg ? (
        <div>
          <img src={catImg} alt="Random Cat" />
        </div>
      ) : (
        <p className='mt-6'>Aún no se ha obtenido una imagen de gato.</p>
      )}
    </section>
  )
}
