import { FooterCTA } from "./FooterCTA";
import { FooterCopyright } from "./FooterCopyright";
import { FooterHorizon } from "./FooterHorizon";
import { FooterNav } from "./FooterNav";

export function Footer() {
  return (
    <footer className="relative z-10 overflow-hidden">
      <FooterHorizon />

      <div className="relative z-10 mx-auto max-w-7xl px-6 pt-32 pb-12 sm:pt-48">
        <FooterCTA />

        <div className="mt-80 sm:mt-[28rem] lg:mt-[36rem]">
          <FooterNav />
          <div className="mt-24 sm:mt-28">
            <FooterCopyright />
          </div>
        </div>
      </div>
    </footer>
  );
}
