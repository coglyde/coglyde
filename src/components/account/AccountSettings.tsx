"use client";

import { UserProfile } from "@clerk/nextjs";

export function AccountSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-white mb-2">Account Settings</h2>
        <p className="text-white/60">Manage your profile, email, password, and connected accounts</p>
      </div>

      <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8">
        <UserProfile
          appearance={{
            elements: {
              card: "bg-transparent border-0",
              headerTitle: "text-xl font-semibold text-white",
              headerSubtitle: "text-white/60",
              formButtonPrimary: "bg-blue-600 hover:bg-blue-700",
              formFieldLabel: "text-white/80",
              formFieldInput:
                "bg-white/[0.05] border-white/15 text-white placeholder:text-white/40",
              dividerLine: "bg-white/10",
              profileSectionTitle: "text-lg font-semibold text-white",
              identityPreview: "bg-white/[0.03] border-white/10",
              profilePage: "text-white",
              accordion: "border-white/10",
              accordionButton: "text-white hover:bg-white/[0.05]",
              accordionContent: "text-white/80",
              navbarButton: "text-white/70 hover:text-white",
              navbarButtonActive: "text-blue-400",
            },
          }}
        />
      </div>

      <div className="rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 p-6">
        <h3 className="font-semibold text-white mb-2">Security Tip</h3>
        <p className="text-sm text-white/70">
          Keep your password secure and enable two-factor authentication for added protection.
        </p>
      </div>
    </div>
  );
}
