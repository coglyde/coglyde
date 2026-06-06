"use client";

import type { FormEvent } from "react";
import { ContactField } from "./ContactField";
import { ServiceSelect } from "./ServiceSelect";
import { SuccessState } from "./SuccessState";
import { useContactForm } from "./useContactForm";

export function ContactForm() {
  const { values, errors, errorNonce, status, serverError, setField, submit, reset } =
    useContactForm();

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    void submit();
  };

  const cardClasses =
    "relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-sm";

  if (status === "success") {
    return (
      <div className={cardClasses}>
        <SuccessState onReset={reset} />
      </div>
    );
  }

  const submitting = status === "submitting";

  return (
    <form onSubmit={onSubmit} className={cardClasses} noValidate>
      {/* Top edge highlight echoing the services dropdown. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-40 opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(120% 100% at 50% 0%, rgba(112,124,255,0.10) 0%, rgba(0,0,0,0) 70%)",
        }}
      />

      <div className="relative flex flex-col gap-5 p-6 sm:p-8">
        <div className="grid gap-5 sm:grid-cols-2">
          <ContactField
            label="Name"
            name="name"
            value={values.name}
            onChange={(v) => setField("name", v)}
            error={errors.name}
            errorNonce={errorNonce}
            placeholder="Jane Doe"
            autoComplete="name"
          />
          <ContactField
            label="Email"
            name="email"
            type="email"
            value={values.email}
            onChange={(v) => setField("email", v)}
            error={errors.email}
            errorNonce={errorNonce}
            placeholder="jane@company.com"
            autoComplete="email"
          />
        </div>

        <ContactField
          label="Company"
          name="company"
          value={values.company}
          onChange={(v) => setField("company", v)}
          errorNonce={errorNonce}
          optional
          placeholder="Acme Inc."
          autoComplete="organization"
        />

        <ServiceSelect value={values.service} onChange={(v) => setField("service", v)} />

        <ContactField
          as="textarea"
          label="Message"
          name="message"
          value={values.message}
          onChange={(v) => setField("message", v)}
          error={errors.message}
          errorNonce={errorNonce}
          placeholder="Tell us about your project, timeline, and what success looks like."
        />

        {status === "error" && (
          <p className="text-[0.82rem] text-red-300/90" role="alert">
            {serverError}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="group relative mt-1 inline-flex items-center justify-center gap-2.5 rounded-2xl bg-white/95 px-7 py-3.5 text-[0.9rem] font-medium text-black shadow-lg transition-[transform,box-shadow,opacity] duration-200 hover:-translate-y-px hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Sending…" : "Send message"}
          {!submitting && (
            <span
              aria-hidden
              className="transition-transform duration-200 group-hover:translate-x-1"
            >
              →
            </span>
          )}
        </button>
      </div>
    </form>
  );
}
