"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";

export function ContactSupport() {
  const { user } = useUser();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus("idle");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, message }),
      });

      if (res.ok) {
        setStatus("success");
        setSubject("");
        setMessage("");
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-white mb-2">Contact Support</h2>
        <p className="text-white/60">Have a question? We're here to help. Send us a message and we'll get back to you soon.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Contact Info */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6">
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase text-white/60 mb-1">Email</p>
                <a
                  href="mailto:info@coglyde.com"
                  className="text-white hover:text-blue-400 transition-colors"
                >
                  info@coglyde.com
                </a>
              </div>
              <div className="border-t border-white/10 pt-4">
                <p className="text-xs font-semibold uppercase text-white/60 mb-1">Location</p>
                <p className="text-white">Vancouver, BC</p>
                <p className="text-sm text-white/60">Canada</p>
              </div>
              <div className="border-t border-white/10 pt-4">
                <p className="text-xs font-semibold uppercase text-white/60 mb-2">Hours</p>
                <p className="text-sm text-white/80">Mon - Fri</p>
                <p className="text-sm text-white/60">9:00 AM - 6:00 PM PST</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 p-6">
            <h3 className="font-semibold text-white mb-2 text-sm">Quick Support</h3>
            <p className="text-xs text-white/70 mb-4">
              For urgent matters, email us directly at info@coglyde.com
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="What is this about?"
              required
              className="w-full rounded-lg bg-white/[0.05] border border-white/15 px-4 py-2.5 text-white placeholder:text-white/40 focus:border-blue-500/50 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us more about your issue or question..."
              required
              rows={6}
              className="w-full rounded-lg bg-white/[0.05] border border-white/15 px-4 py-2.5 text-white placeholder:text-white/40 focus:border-emerald-500/50 focus:outline-none transition-colors resize-none"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="text-xs text-white/60">
              Sent from: <span className="text-white">{user?.emailAddresses[0]?.emailAddress}</span>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-2.5 text-sm font-medium text-white transition-colors"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </div>

          {/* Status Messages */}
          {status === "success" && (
            <div className="rounded-lg bg-blue-500/10 border border-blue-500/30 p-4">
              <p className="text-sm text-blue-300">
                ✓ Message sent! We'll get back to you soon.
              </p>
            </div>
          )}
          {status === "error" && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-4">
              <p className="text-sm text-red-300">
                ✗ Something went wrong. Please try again or email us directly.
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
