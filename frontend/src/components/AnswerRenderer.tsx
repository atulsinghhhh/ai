import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface AnswerRendererProps {
  content: string;
  isStreaming?: boolean;
}

export default function AnswerRenderer({ content, isStreaming }: AnswerRendererProps) {
  if (!content) return null;

  return (
    <div className={`prose-answer ${isStreaming ? "typing-cursor" : ""}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
