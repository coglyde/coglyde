"use client";

import { useState } from "react";
import type { ServiceOption } from "./contact-data";

type FieldErrors = Partial<Record<"name" | "email" | "message", string>>;
type Status = "idle" | "submitting" | "success" | "error";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EMPTY = {
  name: "",
  email: "",
  company: "",
  service: "" as ServiceOption | "",
  message: "",
};

// Owns the contact form's submission lifecycle: field values, validation,
// the POST to /api/inquiry, and the resulting status. `errorNonce` bumps on
// every failed validation so fields can replay their shake.
export function useContactForm() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [errorNonce, setErrorNonce] = useState(0);
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState("");

  const setField = <K extends keyof typeof EMPTY>(key: K, value: (typeof EMPTY)[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (key in errors) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key as keyof FieldErrors];
        return next;
      });
    }
  };

  const validate = (): FieldErrors => {
    const next: FieldErrors = {};
    if (values.name.trim().length < 2) next.name = "Please tell us your name.";
    if (!EMAIL_RE.test(values.email.trim())) next.email = "Enter a valid email address.";
    if (values.message.trim().length < 10)
      next.message = "A little more detail helps us help you.";
    return next;
  };

  const fail = (fieldErrors: FieldErrors) => {
    setErrors(fieldErrors);
    setErrorNonce((n) => n + 1);
  };

  const submit = async () => {
    setServerError("");
    const localErrors = validate();
    if (Object.keys(localErrors).length > 0) {
      fail(localErrors);
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (res.status === 422) {
        const data = (await res.json()) as { errors?: FieldErrors };
        fail(data.errors ?? {});
        setStatus("idle");
        return;
      }

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setServerError(data.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setStatus("success");
    } catch {
      setServerError("Network error. Please check your connection and retry.");
      setStatus("error");
    }
  };

  const reset = () => {
    setValues(EMPTY);
    setErrors({});
    setServerError("");
    setStatus("idle");
  };

  return { values, errors, errorNonce, status, serverError, setField, submit, reset };
}
