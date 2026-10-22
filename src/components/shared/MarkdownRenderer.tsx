import { lazy, Suspense } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";

// 代码高亮库体积很大，懒加载：只有文章里真有代码块时才下载
const SyntaxHighlighter = lazy(() =>
  import("react-syntax-highlighter").then((m) => ({ default: m.Prism }))
);

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="markdown-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const language = match ? match[1] : "";
            const isInline = !className;

            if (isInline) {
              return (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            }

            const codeText = String(children).replace(/\n$/, "");
            return (
              <Suspense
                fallback={
                  <pre
                    style={{
                      margin: 0,
                      borderRadius: "16px",
                      background: "rgba(255, 255, 255, 0.65)",
                      padding: "1em",
                      overflowX: "auto",
                    }}
                  >
                    <code>{codeText}</code>
                  </pre>
                }
              >
                <SyntaxHighlighter
                  style={oneLight}
                  language={language || "text"}
                  PreTag="div"
                  customStyle={{
                    margin: 0,
                    borderRadius: "16px",
                    background: "rgba(255, 255, 255, 0.65)",
                  }}
                >
                  {codeText}
                </SyntaxHighlighter>
              </Suspense>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
