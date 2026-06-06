"use client";

import { SERVICE_OPTIONS, type ServiceOption } from "./contact-data";

type ServiceSelectProps = {
  value: ServiceOption | "";
  onChange: (value: ServiceOption) => void;
};

// Single-select interest pills. Each pill lifts on hover and locks into a soft
// violet wash when active, a lightweight nod to the avatar-group-hover feel.
export function ServiceSelect({ value, onChange }: ServiceSelectProps) {
  return (
    <fieldset>
      <legend className="mb-2 block text-[0.78rem] font-medium tracking-[0.02em] text-white/70">
        What can we help with?
      </legend>
      <div className="flex flex-wrap gap-2.5">
        {SERVICE_OPTIONS.map((option) => {
          const active = value === option;
          return (
            <button
              key={option}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(option)}
              className={`rounded-full border px-4 py-2 text-[0.82rem] font-medium transition-[transform,background-color,border-color,color] duration-200 ease-out hover:-translate-y-px ${
                active
                  ? "border-violet-400/50 bg-violet-400/15 text-white shadow-[0_0_24px_-8px_rgba(139,92,246,0.6)]"
                  : "border-white/12 bg-white/[0.03] text-white/65 hover:border-white/25 hover:text-white"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
