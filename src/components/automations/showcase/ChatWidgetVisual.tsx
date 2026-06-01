// An on-site chat widget mockup for the AI Chatbot tab.
export function ChatWidgetVisual() {
  return (
    <div className="relative flex h-full min-h-[18rem] items-center justify-center p-8">
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          backgroundImage:
            "radial-gradient(60% 60% at 70% 20%, rgba(59,130,246,0.20), transparent 70%)",
        }}
      />
      <div className="relative w-full max-w-xs overflow-hidden rounded-2xl border border-white/12 bg-[#0c0c11]/90 shadow-2xl">
        <div className="flex items-center gap-2.5 border-b border-white/[0.07] px-4 py-3">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-blue-500 text-[0.7rem] font-semibold text-white">
            C
          </span>
          <div className="flex-1">
            <p className="text-[0.8rem] font-medium leading-none text-white">
              Coglyde Assistant
            </p>
            <p className="mt-1 flex items-center gap-1 text-[0.65rem] text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Online now
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 px-4 py-4">
          <p className="max-w-[85%] rounded-2xl rounded-bl-md border border-white/10 bg-white/[0.05] px-3 py-2 text-[0.78rem] leading-snug text-white/80">
            Hey! Looking for a quote or have a question?
          </p>
          <p className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-gradient-to-br from-violet-500/85 to-indigo-500/85 px-3 py-2 text-[0.78rem] leading-snug text-white">
            What does a new site cost?
          </p>
          <p className="max-w-[88%] rounded-2xl rounded-bl-md border border-white/10 bg-white/[0.05] px-3 py-2 text-[0.78rem] leading-snug text-white/80">
            Most builds land between $2k and $6k. Want to grab a quick call to
            scope yours?
          </p>
        </div>

        <div className="flex items-center gap-2 border-t border-white/[0.07] px-3 py-2.5">
          <span className="flex-1 text-[0.75rem] text-white/35">
            Type a message
          </span>
          <span className="grid h-7 w-7 place-items-center rounded-full bg-white/10 text-white/70">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-3.5 w-3.5"
            >
              <path d="M5 12h13M13 6l6 6-6 6" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
}
