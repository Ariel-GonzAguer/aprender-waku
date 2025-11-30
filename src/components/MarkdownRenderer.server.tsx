import fm from "front-matter";
import fs from "fs";
import path from "path";
import MarkdownContent from "../components/MarkdownContent.client";

interface FrontmatterAttributes {
  titulo?: string;
  autor?: string;
  fecha?: string;
  [key: string]: unknown;
  tags?: string[];
}

interface Props {
  markdown: string;
}

// Función para procesar referencias a archivos
async function processFileReferences(content: string): Promise<string> {
  const fileRefRegex = /#file:([^\s\n]+)/g;
  let processedContent = content;

  const matches = Array.from(content.matchAll(fileRefRegex));
  
  for (const match of matches) {
    const filePath = match[1];
    if (!filePath) continue;
    const fullPath = path.join(process.cwd(), 'src', filePath);
    
    try {
      if (fs.existsSync(fullPath)) {
        const fileContent = fs.readFileSync(fullPath, 'utf-8');
        const ext = path.extname(filePath).slice(1) || 'tsx';
        const codeBlock = `\`\`\`${ext}\n${fileContent}\n\`\`\``;
        processedContent = processedContent.replace(match[0], codeBlock);
      }
    } catch (error) {
      console.error(`Error reading file ${filePath}:`, error);
    }
  }

  return processedContent;
}

export default async function MarkdownRenderer({ markdown }: Props) {
  // Parsear frontmatter
  const parsed = fm<FrontmatterAttributes>(markdown);

  // Extraer atributos y contenido
  const { attributes: data, body: content } = parsed;

  // Procesar referencias a archivos
  const processedContent = await processFileReferences(content);

  // Sanitizar el id para evitar inyecciones accidentales
  const titleValue = typeof data.titulo === 'string'
    ? data.titulo
    : typeof (data as any).title === 'string'
      ? (data as any).title
      : undefined;

  const safeId = titleValue
    ? titleValue.toLowerCase().replace(/[^a-z0-9-_]+/g, '-')
    : undefined;

  return (
    <>
      <title>{data.titulo}</title>
      <meta name="author" content={data.autor} />
      <meta name="keywords" content={Array.isArray(data.tags) ? data.tags.join(', ') : ''} />
      <meta name="robots" content="index, follow" />
      
      <article className="prose lg:prose-xl mx-auto p-4 leading-loose text-center text-balance">
        <header className="mb-6 text-center text-red-600 text-4xl">
          {data.titulo && <h2 id={safeId}>{data.titulo}</h2>}
          {(data.autor || data.fecha) && (
            <p className="text-sm text-gray-500 italic">
              {data.autor && <>Por {data.autor}</>}
              {data.autor && data.fecha && " — "}
              {data.fecha && <>{data.fecha}</>}
            </p>
          )}
        </header>

        <MarkdownContent markdown={processedContent} />
      </article>
    </>
  );
}

export const getConfig = async () => {
  return {
    render: 'dynamic',
  } as const;
};
