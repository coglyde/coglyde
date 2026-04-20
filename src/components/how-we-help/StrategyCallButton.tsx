import { ArrowRightIcon } from "../services/icons";

type StrategyCallButtonProps = {
  href?: string;
};

export function StrategyCallButton({
  href = "#strategy-call",
}: StrategyCallButtonProps) {
  return (
    <a
      href={href}
      className="group inline-flex w-fit items-center gap-4 self-start rounded-full border border-white/20 bg-black/60 py-1.5 pl-6 pr-1.5 text-sm font-medium text-white shadow-[0_10px_40px_-10px_rgba(123,57,252,0.5),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl transition hover:border-white/35 hover:bg-black/80"
    >
      <span>Strategy Call</span>
      <span className="grid h-10 w-10 place-items-center rounded-full bg-white/15 text-white transition-transform group-hover:translate-x-0.5">
        <ArrowRightIcon className="h-4 w-4" />
      </span>
    </a>
  );
}
