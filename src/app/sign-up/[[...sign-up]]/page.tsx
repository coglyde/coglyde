import type { Metadata } from "next";
import { SignUp } from "@clerk/nextjs";
import { PageAmbientBackground } from "@/components/PageAmbientBackground";

export const metadata: Metadata = {
  title: "Create your account | Coglyde",
};

export default function SignUpPage() {
  return (
    <>
      <PageAmbientBackground />
      <main className="relative z-10 flex min-h-screen items-center justify-center px-6 py-24">
        <SignUp signInUrl="/sign-in" fallbackRedirectUrl="/account" />
      </main>
    </>
  );
}
