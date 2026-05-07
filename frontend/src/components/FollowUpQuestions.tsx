import { Plus } from "lucide-react";

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
    <div className="space-y-1 animate-reveal">
      {questions.map((q, i) => (
        <button
          key={i}
          onClick={() => onSelect(q)}
          disabled={disabled}
          className="
            w-full group flex items-center justify-between px-2 py-3
            bg-transparent border-b border-[oklch(1_0_0/5%)]
            text-left text-[0.95rem] text-[oklch(0.85_0.005_260)] font-medium
            hover:text-[oklch(0.65_0.18_230)]
            transition-all duration-200
            disabled:opacity-40 disabled:cursor-not-allowed
            cursor-pointer
          "
        >
          <span className="flex-1">{q}</span>
          <div className="p-1 rounded-full bg-transparent group-hover:bg-[oklch(0.65_0.18_230/10%)] transition-colors">
            <Plus size={16} className="text-[oklch(0.4_0.01_260)] group-hover:text-[oklch(0.65_0.18_230)]" />
          </div>
        </button>
      ))}
    </div>
  );
}

