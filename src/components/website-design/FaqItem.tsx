type FaqItemProps = {
  question: string;
  answer: string;
};

export function FaqItem({ question, answer }: FaqItemProps) {
  return (
    <details className="group rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm transition-all duration-300 hover:border-white/15 hover:bg-white/[0.04] open:border-violet-400/25 open:bg-white/[0.04]">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-6 px-6 py-5 text-left text-base font-medium text-white sm:px-7 sm:py-6 sm:text-lg [&::-webkit-details-marker]:hidden">
        <span className="text-balance">{question}</span>
        <span
          aria-hidden
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-violet-300 transition-all duration-300 group-hover:border-white/20 group-open:rotate-45 group-open:border-violet-400/40 group-open:bg-violet-500/10 group-open:text-violet-200"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
        </span>
      </summary>
      <div className="px-6 pb-6 pt-0 text-sm leading-relaxed text-white/65 sm:px-7 sm:pb-7 sm:text-[15px]">
        {answer}
      </div>
    </details>
  );
}
