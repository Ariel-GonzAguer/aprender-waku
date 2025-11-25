export default function NotFound({ params }: { params: { notFound: string[] } }) {
	const path = params.notFound?.join('/') ?? '';

	return (
		<html>
			<head>
				<title>404 - Página no encontrada</title>
			</head>
			<body style={{ textAlign: 'center', padding: '3rem' }}>
				<h1>🔍 404 - Página no encontrada</h1>
				<p style={{ color: '#666' }}>
					No pudimos encontrar: <code>/{path}</code>
				</p>
				<p>
					<a href="/">Ir a home</a> • <a href="/posts">Ver todos los posts</a>
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
