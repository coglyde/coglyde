// Render-only mockups for the content-automation timeline. Decorative, so the
// wrappers are aria-hidden by the timeline.

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b0f]/80 p-5 shadow-[0_30px_90px_-40px_rgba(0,0,0,0.9)] backdrop-blur-sm">
      <span
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(70% 70% at 80% 0%, rgba(112,124,255,0.16), transparent 70%)",
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}

export function ProfileMock() {
  return (
    <Frame>
      <div className="flex items-center gap-3">
        <span className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-500/50 to-blue-500/30" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-white">Your business</p>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-amber-400">
            ★★★★★ <span className="text-white/40">(745)</span>
          </p>
        </div>
      </div>
      <div className="mt-4 space-y-2 text-[0.72rem] text-white/50">
        <p>
          <span className="text-white/40">Services:</span> Design, SEO, Marketing
        </p>
        <p>
          <span className="text-white/40">Voice:</span> Friendly, expert, concise
        </p>
        <p>
          <span className="text-white/40">Audience:</span> Local service owners
        </p>
      </div>
    </Frame>
  );
}

export function IdeasMock() {
  return (
    <Frame>
      <div className="flex items-center gap-2">
        <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-blue-500 text-white">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
            <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
            <path d="M12 8c.6 2.2 1.8 3.4 4 4-2.2.6-3.4 1.8-4 4-.6-2.2-1.8-3.4-4-4 2.2-.6 3.4-1.8 4-4Z" />
          </svg>
        </span>
        <p className="text-xs font-medium text-white/80">Generating ideas…</p>
      </div>
      <div className="mt-4 space-y-2.5">
        {["7 signs it's time to redesign", "Local SEO checklist for 2026", "How AI answers find you"].map(
          (idea, i) => (
            <div
              key={idea}
              className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-[0.74rem] text-white/70"
            >
              <span className="text-violet-300">{i + 1}</span>
              {idea}
            </div>
          ),
        )}
      </div>
    </Frame>
  );
}

export function TopicsMock() {
  return (
    <Frame>
      <div className="grid grid-cols-3 gap-2.5">
        {["Topic #1", "Topic #2", "Topic #3"].map((t, i) => (
          <div
            key={t}
            className={`rounded-xl border p-3 ${
              i === 0
                ? "border-violet-400/40 bg-violet-500/[0.08]"
                : "border-white/10 bg-white/[0.03]"
            }`}
          >
            <p className="text-[0.7rem] font-semibold text-white">{t}</p>
            <div className="mt-2 space-y-1">
              <span className="block h-1 w-full rounded bg-white/15" />
              <span className="block h-1 w-4/5 rounded bg-white/10" />
              <span className="block h-1 w-3/5 rounded bg-white/10" />
            </div>
            {i === 0 ? (
              <span className="mt-2.5 inline-block rounded-full bg-violet-500/20 px-2 py-0.5 text-[0.55rem] font-semibold text-violet-200">
                Chosen
              </span>
            ) : null}
          </div>
        ))}
      </div>
    </Frame>
  );
}

export function PublishMock() {
  return (
    <Frame>
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-white/80">This month</p>
        <span className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2 py-0.5 text-[0.6rem] font-semibold text-emerald-300">
          6 published
        </span>
      </div>
      <div className="mt-4 space-y-2">
        {[
          { t: "Local SEO checklist for 2026", d: "Published" },
          { t: "How AI answers find you", d: "Published" },
          { t: "7 signs it's time to redesign", d: "Scheduled" },
        ].map((post) => (
          <div
            key={post.t}
            className="flex items-center gap-2.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2"
          >
            <span
              className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                post.d === "Published" ? "bg-emerald-400" : "bg-amber-400"
              }`}
            />
            <p className="flex-1 truncate text-[0.74rem] text-white/70">
              {post.t}
            </p>
            <span className="text-[0.62rem] text-white/40">{post.d}</span>
          </div>
        ))}
      </div>
    </Frame>
  );
}
