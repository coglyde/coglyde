import { CheckIcon } from "./icons";

type MarketingProgressRowProps = {
  label: string;
  fill: number;
};

export function MarketingProgressRow({
  label,
  fill,
}: MarketingProgressRowProps) {
  return (
    <div className="flex items-center gap-3 text-[13px] text-white/70">
      <span className="grid h-4 w-4 shrink-0 place-items-center rounded-full bg-violet-500/20 text-violet-300">
        <CheckIcon className="h-3 w-3" />
      </span>
      <span className="w-44 shrink-0">{label}</span>
      <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
        <span
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-violet-400 to-indigo-400"
          style={{ width: `${fill}%` }}
        />
      </div>
    </div>
  );
}
