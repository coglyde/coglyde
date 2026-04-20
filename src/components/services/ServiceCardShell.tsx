import type { ReactNode } from "react";

type ServiceCardShellProps = {
  icon: ReactNode;
  title: string;
  description: string;
  children: ReactNode;
};

export function ServiceCardShell({
  icon,
  title,
  description,
  children,
}: ServiceCardShellProps) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-sm transition-colors hover:border-white/20 sm:p-10">
      <span
        aria-hidden
        className="absolute left-10 top-0 h-[3px] w-20 rounded-b-full bg-gradient-to-r from-violet-400 via-violet-500 to-indigo-500"
      />
      <div className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-violet-300 shadow-[0_0_30px_-8px_rgba(139,92,246,0.6)]">
        {icon}
      </div>
      <div className="mt-10">
        <h3 className="text-2xl font-semibold tracking-tight text-white sm:text-[28px]">
          {title}
        </h3>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-white/60 sm:text-[15px]">
          {description}
        </p>
      </div>
      <div className="mt-10 flex-1">{children}</div>
    </article>
  );
}
