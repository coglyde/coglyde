import type { ReactNode } from "react";

type ServiceDetailScrollFrameProps = {
  children: ReactNode;
};

const MASK = {
  WebkitMaskImage:
    "linear-gradient(to bottom, transparent 0, black 28px, black calc(100% - 28px), transparent 100%)",
  maskImage:
    "linear-gradient(to bottom, transparent 0, black 28px, black calc(100% - 28px), transparent 100%)",
};

export function ServiceDetailScrollFrame({
  children,
}: ServiceDetailScrollFrameProps) {
  return (
    <div
      className="h-full overflow-y-auto pr-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar]:w-1"
      style={MASK}
    >
      {children}
    </div>
  );
}
