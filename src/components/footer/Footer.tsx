import { FooterCTA } from "./FooterCTA";
import { FooterCopyright } from "./FooterCopyright";
import { FooterNav } from "./FooterNav";

export function Footer() {
  return (
    <footer className="relative z-10 overflow-hidden">
      <div className="relative z-10 mx-auto max-w-7xl px-6 pt-32 pb-12 sm:pt-48">
        <FooterCTA />

        <div className="mt-32 sm:mt-40">
          <FooterNav />
          <div className="mt-16 sm:mt-20">
            <FooterCopyright />
          </div>
        </div>
      </div>
    </footer>
  );
}
