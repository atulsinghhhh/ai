import { MessageCircle } from "lucide-react";

interface FollowUpQuestionsProps {
  questions: string[];
  onSelect: (question: string) => void;
  disabled?: boolean;
}

export default function FollowUpQuestions({
  questions,
  onSelect,
  disabled,
}: FollowUpQuestionsProps) {
  if (!questions.length) return null;

  return (
    <div className="mt-6 animate-fade-in-up">
      <div className="flex items-center gap-2 mb-3">
        <MessageCircle size={14} className="text-[oklch(0.55_0.01_260)]" />
        <span className="text-[0.8rem] font-medium text-[oklch(0.55_0.01_260)]">
          Related
        </span>
      </div>
      <div className="flex flex-col gap-0 border border-[oklch(1_0_0/6%)] rounded-xl overflow-hidden">
        {questions.map((q, i) => (
          <button
            key={i}
            onClick={() => onSelect(q)}
            disabled={disabled}
            className={`
              group flex items-center gap-3 px-4 py-3
              bg-transparent
              text-left text-[0.88rem] text-[oklch(0.78_0.008_260)]
              hover:bg-[oklch(1_0_0/4%)] hover:text-[oklch(0.92_0.005_260)]
              transition-all duration-150
              disabled:opacity-40 disabled:cursor-not-allowed
              cursor-pointer
              ${i < questions.length - 1 ? "border-b border-[oklch(1_0_0/5%)]" : ""}
            `}
          >
            <span className="flex-1">{q}</span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="flex-shrink-0 opacity-0 group-hover:opacity-60 transition-opacity -translate-x-1 group-hover:translate-x-0 transition-transform duration-200"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}
