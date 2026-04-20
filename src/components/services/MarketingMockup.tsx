import { MarketingProgressRow } from "./MarketingProgressRow";
import { MarketingSocialRow } from "./MarketingSocialRow";
import { PaperPlaneIcon } from "./icons";

export function MarketingMockup() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-black/30 p-5 shadow-[inset_0_0_40px_rgba(139,92,246,0.08)]">
      <div className="flex items-center justify-between rounded-xl border border-white/10 bg-black/40 px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-violet-500/15 text-violet-300">
            <PaperPlaneIcon className="h-3.5 w-3.5" />
          </span>
          <span className="text-sm text-white/80">Coglyde Contact</span>
        </div>
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-violet-500/20 text-violet-300">
          <PaperPlaneIcon className="h-3.5 w-3.5" />
        </span>
      </div>

      <div className="mt-5">
        <MarketingSocialRow />
      </div>

      <div className="mt-6 space-y-3">
        <MarketingProgressRow label="More page clicks" fill={72} />
        <MarketingProgressRow label="Maximize engagement rate" fill={48} />
      </div>

      <div className="mt-6 flex justify-start">
        <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.06] px-4 py-1.5 text-xs font-medium text-white/80">
          Get Started
        </span>
      </div>
    </div>
  );
}
