// A "leads landing in your pipeline" mockup for the Lead Generation tab.
const leads = [
  { name: "Priya N.", note: "Kitchen remodel", tag: "Hot", hot: true },
  { name: "Marcus L.", note: "Roof inspection", tag: "New", hot: false },
  { name: "Dana R.", note: "Quote request", tag: "New", hot: false },
];

export function LeadPipelineVisual() {
  return (
    <div className="relative flex h-full min-h-[18rem] items-center justify-center p-8">
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          backgroundImage:
            "radial-gradient(60% 60% at 30% 15%, rgba(139,92,246,0.20), transparent 70%)",
        }}
      />
      <div className="relative w-full max-w-sm">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[0.8rem] font-medium text-white">New leads today</p>
          <span className="rounded-full border border-violet-400/25 bg-violet-500/10 px-2.5 py-0.5 text-[0.65rem] font-semibold text-violet-200">
            +12 this week
          </span>
        </div>
        <div className="flex flex-col gap-2.5">
          {leads.map((lead) => (
            <div
              key={lead.name}
              className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-3"
            >
              <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-violet-500/40 to-blue-500/20 text-[0.75rem] font-semibold text-white">
                {lead.name[0]}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[0.82rem] font-medium text-white">
                  {lead.name}
                </p>
                <p className="truncate text-[0.72rem] text-white/45">
                  {lead.note}
                </p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wide ${
                  lead.hot
                    ? "border border-amber-400/30 bg-amber-400/10 text-amber-300"
                    : "border border-white/10 bg-white/[0.04] text-white/55"
                }`}
              >
                {lead.tag}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
