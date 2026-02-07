import { Code } from "bright";

export default function CodeBlock({ children, lang }: { children: string, lang?: string }) {

  return (
    <section className="w-[95%] m-[0_auto] rounded">
      <Code lang={lang || "tsx"} lineNumbers theme={"github-dark"} className="text-left">
        {children}
      </Code>
    </section>
  )
}
