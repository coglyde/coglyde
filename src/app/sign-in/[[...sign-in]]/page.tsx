import type { Metadata } from "next";
import { SignIn } from "@clerk/nextjs";
import { PageAmbientBackground } from "@/components/PageAmbientBackground";

export const metadata: Metadata = {
  title: "Sign in | Coglyde",
};

export default function SignInPage() {
  return (
    <>
      <PageAmbientBackground />
      <main className="relative z-10 flex min-h-screen items-center justify-center px-6 py-24">
        <SignIn signUpUrl="/sign-up" fallbackRedirectUrl="/account" />
      </main>
    </>
  );
}
