import PostList from '../components/PostList.server'
import { Suspense } from 'react'

export default async function HomePage() {
  return (
     <Suspense fallback={<p>⏳ Cargando posts...</p>}>
      <PostList />
    </Suspense>
  )
}

export const getConfig = async () => {
  return {
    render: 'dynamic',
  } as const
}