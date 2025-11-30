// components/CodeBlock.tsx
'use client';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

type Props = {
  code: string;
  language?: string;
};

export default function CodeBlock({ code, language = "tsx" }: Props) {
  return (
    <SyntaxHighlighter
      language={language}
      style={oneDark}
      wrapLines={true}
      showLineNumbers={true}
    >
      {code}
    </SyntaxHighlighter>
  );
}
