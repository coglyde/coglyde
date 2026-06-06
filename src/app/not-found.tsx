import Link from "next/link";
import { Header } from "@/components/Header";
import { StarfieldBackground } from "@/components/StarfieldBackground";
import { Astronaut3D } from "@/components/not-found/Astronaut3D";

export default function NotFound() {
  return (
    <>
      <StarfieldBackground />
      <Header />

      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
        {/* Astronaut roaming the whole viewport, behind the copy. */}
        <Astronaut3D className="pointer-events-none absolute inset-0 z-0" />

        {/* Vignette so the hero copy stays legible when the astronaut drifts
            behind it. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            background:
              "radial-gradient(ellipse 62% 50% at 50% 54%, rgba(0,0,0,0.62) 0%, transparent 62%)",
          }}
        />

        <div className="relative z-10 flex flex-col items-center">
          <p className="text-xs font-medium uppercase tracking-[0.32em] text-violet-400">
            404
          </p>
          <h1 className="mt-5 text-balance bg-gradient-to-br from-white via-white to-violet-200/80 bg-clip-text text-[3.4rem] font-bold leading-[0.9] tracking-[-0.03em] text-transparent drop-shadow-[0_4px_40px_rgba(0,0,0,0.7)] sm:text-[5.5rem] lg:text-[7rem]">
            You seem to be lost.
          </h1>
          <p className="mt-6 max-w-md text-pretty text-[1rem] leading-relaxed text-white/65 sm:text-lg">
            Seems like this page has drifted into the void. Let&rsquo;s guide you
            back home.
          </p>

          <Link
            href="/"
            className="group mt-10 inline-flex items-center gap-2.5 rounded-full bg-white/95 px-8 py-3.5 text-[0.95rem] font-medium text-black shadow-lg transition-[transform,box-shadow] duration-200 hover:-translate-y-px hover:bg-white hover:shadow-xl"
          >
            Take me home
            <span
              aria-hidden
              className="transition-transform duration-200 group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        </div>

        {/* Model attribution (CC-BY). */}
        <a
          href="https://modelviewer.dev/"
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="absolute bottom-5 left-1/2 z-10 -translate-x-1/2 px-6 text-center text-[0.7rem] whitespace-nowrap text-white/25 transition-colors hover:text-white/45"
        >
          3D astronaut by Poly / Google (CC-BY)
        </a>
      </main>
    </>
  );
}
