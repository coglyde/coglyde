import { HowWeHelpIntro } from "./HowWeHelpIntro";
import { ServiceDetailList } from "./ServiceDetailList";
import { VideoBackdrop } from "./VideoBackdrop";

export function HowWeHelpSection() {
  return (
    <section className="relative z-10 px-6 pb-24 sm:pb-32">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] border border-white/10 bg-black/40 px-6 py-12 sm:px-12 sm:py-16 lg:px-16 lg:py-20">
        <VideoBackdrop />
        <div className="relative grid gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
          <HowWeHelpIntro />
          <ServiceDetailList />
        </div>
      </div>
    </section>
  );
}
