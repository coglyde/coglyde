"use client";

import { useEffect, useId, useRef } from "react";

type BaseProps = {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  /** Bumped by the parent on each failed submit to replay the shake. */
  errorNonce: number;
  optional?: boolean;
  placeholder?: string;
  autoComplete?: string;
};

type ContactFieldProps = BaseProps &
  ({ as?: "input"; type?: string; rows?: never } | { as: "textarea"; type?: never; rows?: number });

// A labelled field wired to the transitions.dev "error state shake": the shell
// shakes and turns red when invalid, with the message revealing beneath. The
// shake replays whenever `errorNonce` changes while an error is present.
export function ContactField(props: ContactFieldProps) {
  const { label, name, value, onChange, error, errorNonce, optional, placeholder, autoComplete } = props;
  const id = useId();
  const shellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const shell = shellRef.current;
    if (!shell || !error) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    shell.classList.remove("is-shaking");
    void shell.offsetWidth; // force reflow so the keyframes restart
    shell.classList.add("is-shaking");
    const timer = window.setTimeout(() => shell.classList.remove("is-shaking"), 320);
    return () => window.clearTimeout(timer);
  }, [errorNonce, error]);

  const fieldClasses =
    "w-full bg-transparent text-[0.95rem] text-white placeholder:text-white/30 focus:outline-none";

  return (
    <div className={`t-input-wrap ${error ? "is-error" : ""}`}>
      <label
        htmlFor={id}
        className="mb-2 block text-[0.78rem] font-medium tracking-[0.02em] text-white/70"
      >
        {label}
        {optional && <span className="ml-1.5 text-white/35">(optional)</span>}
      </label>

      <div
        ref={shellRef}
        className={`t-input rounded-2xl border bg-white/[0.03] px-4 py-3.5 backdrop-blur-sm focus-within:border-violet-400/50 ${
          error ? "is-error border-red-400/60" : "border-white/10"
        }`}
      >
        {props.as === "textarea" ? (
          <textarea
            id={id}
            name={name}
            rows={props.rows ?? 5}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={`${fieldClasses} resize-none`}
          />
        ) : (
          <input
            id={id}
            name={name}
            type={props.type ?? "text"}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            autoComplete={autoComplete}
            className={fieldClasses}
          />
        )}
      </div>

      <p
        className="t-error-msg mt-2 text-[0.78rem] text-red-300/90"
        role="alert"
        aria-live="polite"
      >
        {error}
      </p>
    </div>
  );
}
