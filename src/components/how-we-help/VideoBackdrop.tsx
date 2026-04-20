"use client";

import { useInViewVideo } from "../useInViewVideo";

type VideoBackdropProps = {
  src?: string;
};

const DEFAULT_VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260210_031346_d87182fb-b0af-4273-84d1-c6fd17d6bf0f.mp4";

export function VideoBackdrop({ src = DEFAULT_VIDEO }: VideoBackdropProps) {
  const videoRef = useInViewVideo<HTMLVideoElement>(0.2);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2.5rem]"
    >
      <video
        ref={videoRef}
        src={src}
        loop
        muted
        playsInline
        preload="metadata"
        className="absolute inset-0 h-full w-full scale-[1.05] object-cover"
      />
      <div className="absolute inset-0 bg-black/35" />
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_50%,transparent_40%,rgba(0,0,0,0.6)_100%)]" />
    </div>
  );
}
