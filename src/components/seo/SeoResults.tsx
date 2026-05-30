import Image from "next/image";

export function SeoResults() {
  return (
    <section className="relative z-10 px-6 pb-20 sm:px-10 sm:pb-28">
      <div className="mx-auto max-w-[90rem]">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
          <h2 className="text-balance text-4xl font-medium leading-[1.05] tracking-tight text-white sm:text-5xl">
            Real results with proven SEO success
          </h2>
          <p className="max-w-xl text-base leading-relaxed text-white/55 lg:pt-3">
            We focus on comprehensive SEO and GEO strategies that drive real,
            measurable results: more visibility, higher rankings and stronger
            engagement, across Google and AI answers alike.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:auto-rows-fr lg:grid-cols-2">
          {/* 3D growth chart */}
          <div className="relative min-h-[20rem] overflow-hidden rounded-3xl border border-white/[0.08] bg-black">
            <Image
              src="/images/seo/real-results-with-proven-seo-sucess.jpg"
              alt="3D surface chart of compounding SEO growth"
              fill
              sizes="(min-width: 1024px) 45vw, 95vw"
              className="object-contain"
            />
          </div>

          {/* More page clicks — text + on-track visual */}
          <div className="flex flex-col overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.02]">
            <div className="p-8 sm:p-9">
              <h3 className="text-xl font-medium tracking-tight text-white sm:text-2xl">
                Start getting more page clicks. Instantly.
              </h3>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-white/55 sm:text-[15px]">
                Generate immediate traction with targeted SEO and GEO. From
                keyword and entity optimization to technical fixes, we prime
                your site for growth and the audience it deserves.
              </p>
            </div>
            <div className="relative mt-auto min-h-[12rem] flex-1">
              <Image
                src="/images/seo/on-track.png"
                alt="+10% boost in SEO traffic, on track"
                fill
                sizes="(min-width: 1024px) 45vw, 95vw"
                className="object-cover object-right-bottom"
              />
            </div>
          </div>

          {/* Engagement — text */}
          <div className="flex flex-col justify-center rounded-3xl border border-white/[0.08] bg-white/[0.02] p-8 sm:p-9">
            <h3 className="text-xl font-medium tracking-tight text-white sm:text-2xl">
              Maximize your engagement rate.
            </h3>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/55 sm:text-[15px]">
              Elevate user interaction with compelling, optimized content. Our
              proven methods increase not just clicks but meaningful connections
              that drive conversions.
            </p>
          </div>

          {/* Engagement — visual */}
          <div className="relative min-h-[16rem] overflow-hidden rounded-3xl border border-white/[0.08] bg-black">
            <Image
              src="/images/seo/boost-engagement-rate.png"
              alt="40% increase in engagement rate"
              fill
              sizes="(min-width: 1024px) 45vw, 95vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
