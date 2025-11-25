export default async function PostDetail({ params }: { params: { slug: string } }) {
	const { slug } = params;

	return (
		<html>
			<head>
				<title>Post: {slug}</title>
			</head>
			<body style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
				<h1>Post: {slug}</h1>
				<p>Esta es una página de ejemplo para el post <code>{slug}</code>.</p>
				<p>
					<a href="/posts">Volver a posts</a>
				</p>
			</body>
		</html>
	);
}

export const getConfig = async () => {
	return {
		render: 'dynamic',
	} as const;
};
