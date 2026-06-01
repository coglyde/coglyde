import { BentoCard } from "../seo/BentoCard";
import { ChartIcon, DocIcon } from "../seo/icons";
import {
  CalendarIcon,
  FunnelIcon,
  PhoneIcon,
  StarIcon,
} from "./icons";

export function AutomationsCapabilities() {
  return (
    <section className="relative z-10 px-6 pb-16 sm:px-10 sm:pb-24">
      <div className="mx-auto max-w-7xl">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-violet-400">
            What we automate
          </p>
          <h2 className="mt-4 text-balance text-4xl font-medium tracking-tight text-white sm:text-5xl">
            One system, every busywork bottleneck
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/55">
            Mix and match the pieces you need. Each one runs end to end, built
            and managed by our team.
          </p>
        </header>

        {/* Bento: a featured front-desk tile, paired lead tiles, a row of three,
            and a wide reporting tile — varied shapes, not a uniform grid. */}
        <div className="mt-14 grid gap-6 lg:auto-rows-fr lg:grid-cols-6">
          <div className="lg:col-span-3">
            <BentoCard
              glow="violet"
              icon={<PhoneIcon />}
              title="AI front desk"
              description="Missed Call Text-Back, an AI Chatbot on your site and a Virtual AI Admin that answers calls and chats, qualifies, and books straight into your calendar. Nobody waits on hold, nobody slips away."
            />
          </div>
          <div className="lg:col-span-3">
            <BentoCard
              icon={<FunnelIcon />}
              title="Lead generation & outreach"
              description="We source qualified prospects and run personalized outreach on autopilot, so a steady stream of new opportunities lands in your pipeline without manual prospecting."
            />
          </div>

          <div className="lg:col-span-2">
            <BentoCard
              icon={<CalendarIcon />}
              title="Follow-up & nurture"
              description="Automated reminders cut no-shows, and email and SMS drip sequences warm new leads and win back past customers, hands-free."
            />
          </div>
          <div className="lg:col-span-2">
            <BentoCard
              icon={<StarIcon />}
              title="Reputation & reviews"
              description="Auto-requests reviews after every job, flags unhappy customers before they post, and drafts replies so your rating climbs on its own."
            />
          </div>
          <div className="lg:col-span-2">
            <BentoCard
              icon={<DocIcon />}
              title="Content & social"
              description="SEO blog posts drafted and published monthly, plus scroll-stopping carousels for TikTok and Instagram, delivered on schedule."
            />
          </div>

          <div className="lg:col-span-6">
            <BentoCard
              glow="blue"
              horizontal
              icon={<ChartIcon />}
              title="Research & reporting intelligence"
              description="Keyword research, market and competitor research, and always-current dashboards across your ads, analytics and conversions, compiled automatically so you always know what's working and where to push next."
            />
          </div>
        </div>
      </div>
    </section>
  );
}
