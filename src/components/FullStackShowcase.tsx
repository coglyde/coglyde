"use client";

import { useInViewVideo } from "./useInViewVideo";

export function FullStackShowcase() {
  const videoRef = useInViewVideo<HTMLVideoElement>();

  return (
    <section className="relative z-10 px-6 pt-24 pb-24 sm:pt-32 sm:pb-32">
      <div className="mx-auto max-w-7xl">
        <header className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Full-stack custom solutions
          </h2>
          <p className="mt-3 text-base text-white/60 sm:text-lg">
            We are coders, designers, and builders at heart.
          </p>
        </header>

        <div className="relative mt-14">
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-16 left-[15%] h-64 w-64 rounded-full bg-violet-600/50 blur-[120px] sm:-bottom-24 sm:h-80 sm:w-80"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-16 right-[15%] h-64 w-64 rounded-full bg-indigo-600/50 blur-[120px] sm:-bottom-24 sm:h-80 sm:w-80"
          />

          <div className="relative overflow-hidden rounded-[1.75rem]">
            <video
              ref={videoRef}
              src="https://coglyde-website.s3.us-east-2.amazonaws.com/coglyde-fullstack-development.mp4"
              loop
              muted
              playsInline
              preload="metadata"
              className="block h-auto w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
