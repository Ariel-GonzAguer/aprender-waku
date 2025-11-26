import type { PageProps } from 'waku/router';
import { getPostBySlug } from '../../lib/posts';

export default async function PostDetail({ slug }: PageProps<'/posts/[slug]'>) {
	const post = await getPostBySlug(slug);

	if (!post) {
		return (
			<>
				<head>
					<title>Post no encontrado</title>
				</head>
				<div className="p-8">
					<h1>Post no encontrado</h1>
					<p>El post <code>{slug}</code> no existe.</p>
					<p>
						<a href="/" className="text-blue-600 underline">Volver al inicio</a>
					</p>
				</div>
			</>
		);
	}

	return (
		<>
			<head>
				<title>{post.title}</title>
			</head>
			<article className="max-w-4xl mx-auto flex flex-col justify-center items-center">
				<h1 className="text-3xl font-bold mb-4">{post.title}</h1>
				<p className="text-gray-600 text-sm mb-8">
					📅 {new Date(post.date).toLocaleDateString('es-ES')}
				</p>
				<div className="prose max-w-none leading-relaxed flex flex-col justify-center items-center">
					{post.content}
				</div>
				<p className="mt-8 pt-8 border-t border-gray-300">
					<a href="/" className="text-blue-600 underline">← Volver a posts</a>
				</p>
			</article>
		</>
	);
}

export const getConfig = async () => {
	return {
		render: 'dynamic',
	} as const;
};
