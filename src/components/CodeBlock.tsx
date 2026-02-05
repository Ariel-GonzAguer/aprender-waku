import { Code } from "bright";

export default function CodeBlock({ children, lang }: { children: string, lang?: string }) {

  return (
    <Code lang={lang || "tsx"} lineNumbers theme={"github-dark"} className="text-left">
      {children}
    </Code>
  )
}
