import Image from "next/image";

const IMG_SIZES = "(min-width: 1024px) 40vw, 95vw";

export function SeoResults() {
  return (
    <section className="relative z-10 px-6 pb-20 sm:px-10 sm:pb-28">
      <div className="mx-auto max-w-7xl">
        {/* Heading + the 3D growth chart */}
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-violet-400">
              Results
            </p>
            <h2 className="mt-4 text-balance text-4xl font-medium leading-[1.05] tracking-tight text-white sm:text-5xl">
              Real results with proven SEO success
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/55">
              We focus on comprehensive SEO and GEO strategies that drive real,
              measurable results: more visibility, higher rankings and stronger
              engagement, across Google and AI answers alike.
            </p>
          </div>
          <div className="relative aspect-[2030/1711] w-full overflow-hidden rounded-3xl border border-white/[0.08] bg-black">
            <Image
              src="/images/seo/real-results-with-proven-seo-sucess.jpg"
              alt="3D surface chart of compounding SEO growth"
              fill
              sizes={IMG_SIZES}
              className="object-cover"
            />
          </div>
        </div>

        {/* More page clicks — text + on-track visual */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="flex flex-col justify-center rounded-3xl border border-white/[0.08] bg-white/[0.02] p-8 sm:p-10">
            <h3 className="text-2xl font-medium tracking-tight text-white sm:text-3xl">
              Start getting more page clicks. Instantly.
            </h3>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/55 sm:text-base">
              Generate immediate traction with targeted SEO and GEO. From
              keyword and entity optimization to technical fixes, we prime your
              site for growth and the audience it deserves.
            </p>
          </div>
          <div className="relative aspect-[785/606] w-full overflow-hidden rounded-3xl border border-white/[0.08] bg-black">
            <Image
              src="/images/seo/on-track.png"
              alt="+10% boost in SEO traffic, on track"
              fill
              sizes={IMG_SIZES}
              className="object-cover"
            />
          </div>
        </div>

        {/* Engagement — visual + text */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="relative aspect-[550/404] w-full overflow-hidden rounded-3xl border border-white/[0.08] bg-black">
            <Image
              src="/images/seo/boost-engagement-rate.png"
              alt="40% increase in engagement rate"
              fill
              sizes={IMG_SIZES}
              className="object-cover"
            />
          </div>
          <div className="flex flex-col justify-center rounded-3xl border border-white/[0.08] bg-white/[0.02] p-8 sm:p-10">
            <h3 className="text-2xl font-medium tracking-tight text-white sm:text-3xl">
              Maximize your engagement rate.
            </h3>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/55 sm:text-base">
              Elevate user interaction with compelling, optimized content. Our
              proven methods increase not just clicks but meaningful connections
              that drive conversions.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
