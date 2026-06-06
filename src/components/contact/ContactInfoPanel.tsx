import { CONTACT_CHANNELS } from "./contact-data";

// Right-rail of direct ways to reach the studio. Each row lifts its arrow and
// brightens on hover, the same restrained motion used across the site.
export function ContactInfoPanel() {
  return (
    <div className="flex flex-col gap-3">
      {CONTACT_CHANNELS.map((channel) => (
        <a
          key={channel.label}
          href={channel.href}
          target={channel.external ? "_blank" : undefined}
          rel={channel.external ? "noopener noreferrer" : undefined}
          className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-sm transition-colors duration-200 hover:border-white/20"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              backgroundImage:
                "radial-gradient(80% 80% at 100% 0%, rgba(112,124,255,0.12) 0%, rgba(0,0,0,0) 70%)",
            }}
          />
          <div className="relative flex items-start justify-between gap-4">
            <div>
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-white/40">
                {channel.label}
              </p>
              <p className="mt-2 text-[1.05rem] font-medium text-white">{channel.value}</p>
              <p className="mt-1 text-[0.85rem] text-white/55">{channel.hint}</p>
            </div>
            <svg
              viewBox="0 0 16 16"
              aria-hidden
              className="mt-1 h-4 w-4 shrink-0 text-white/30 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-white"
            >
              <path
                d="m6 4 4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </a>
      ))}
    </div>
  );
}
