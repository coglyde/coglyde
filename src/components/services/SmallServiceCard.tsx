import type { ReactNode } from "react";

type SmallServiceCardProps = {
  icon: ReactNode;
  title: string;
  description: string;
};

export function SmallServiceCard({
  icon,
  title,
  description,
}: SmallServiceCardProps) {
  return (
    <article className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm sm:p-7">
      <span
        aria-hidden
        className="absolute left-6 top-0 h-[3px] w-14 rounded-b-full bg-gradient-to-r from-violet-400 via-violet-500 to-indigo-500 sm:left-7"
      />
      <div className="flex items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-violet-300 shadow-[0_0_24px_-8px_rgba(139,92,246,0.6)]">
          {icon}
        </span>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      <p className="mt-5 text-sm leading-relaxed text-white/60">{description}</p>
    </article>
  );
}
