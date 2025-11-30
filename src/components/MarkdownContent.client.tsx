'use client';

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Link } from "waku/router/client";
import CodeBlock from "./CodeBlock.client";

interface Props {
  markdown: string;
}

export default function MarkdownContent({ markdown }: Props) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={{
        a: ({ href, children, ...rest }: any) => {
          const isInternal = href && (href.startsWith('/') || (!href.startsWith('http://') && !href.startsWith('https://')));
          
          if (isInternal) {
            return (
              <Link
                to={href as any}
                className="text-blue-600 underline hover:text-blue-800"
                {...rest}
              >
                {children}
              </Link>
            );
          }
          
          return (
            <a
              href={href}
              {...rest}
              className="text-blue-600 underline hover:text-blue-800"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          );
        },
        img: (props: any) => (
          <img
            {...props}
            className="rounded shadow-md max-w-full mx-auto my-6 bg-slate-800"
          />
        ),
        h2: (props: any) => (
          <h2 {...props} className="text-2xl mt-8 mb-4 text-rose-700" />
        ),
        h3: (props: any) => (
          <h3 {...props} className="text-xl mt-6 mb-3 text-amber-300 font-bold" />
        ),
        h4: (props: any) => (
          <h4 {...props} className="text-lg mt-4 mb-2 text-green-400 font-semibold" />
        ),
        h5: (props: any) => (
          <h5 {...props} className="text-md mt-3 mb-1 text-purple-400 font-medium" />
        ),
        ul: (props: any) => (
          <ul {...props} className="list-none my-4" />
        ),
        pre: (props: any) => {
          const { children } = props;
          // Extraer el texto del elemento code dentro de pre
          let code = '';
          if (typeof children === 'string') {
            code = children;
          } else if (Array.isArray(children) && children[0]) {
            code = children[0].props?.children || String(children);
          } else if (children?.props?.children) {
            code = children.props.children;
          } else {
            code = String(children);
          }
          return <CodeBlock code={code} />;
        },
        table: (props: any) => (
          <table {...props} className="min-w-full border border-gray-300 my-6 rounded shadow-md bg-white" />
        ),
        thead: (props: any) => (
          <thead {...props} className="bg-gray-100" />
        ),
        tbody: (props: any) => (
          <tbody {...props} className="divide-y divide-gray-200" />
        ),
        tr: (props: any) => (
          <tr {...props} className="hover:bg-gray-50" />
        ),
        th: (props: any) => (
          <th {...props} className="px-4 py-2 border-b font-semibold text-left" />
        ),
        td: (props: any) => (
          <td {...props} className="px-4 py-2 border-b" />
        ),
      }}
    >
      {markdown}
    </ReactMarkdown>
  );
}
