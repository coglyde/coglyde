import { HowWeHelpIntro } from "./HowWeHelpIntro";
import { ServiceDetailList } from "./ServiceDetailList";
import { ServiceDetailScrollFrame } from "./ServiceDetailScrollFrame";
import { VideoBackdrop } from "./VideoBackdrop";

export function HowWeHelpSection() {
  return (
    <section className="relative z-10 px-6 pb-24 sm:pb-32">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] border border-white/10 bg-black/40 p-8 sm:p-12">
        <VideoBackdrop />
        <div className="relative grid gap-10 lg:h-[600px] lg:grid-cols-2 lg:gap-14">
          <HowWeHelpIntro />
          <ServiceDetailScrollFrame>
            <ServiceDetailList />
          </ServiceDetailScrollFrame>
        </div>
      </div>
    </section>
  );
}
