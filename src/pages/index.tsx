import PostList from '../components/PostList.server'

export default async function HomePage() {
  return (
    <PostList />
  )
}

export const getConfig = async () => {
  return {
    render: 'static',
  } as const
}