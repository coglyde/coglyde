import type { ReactNode } from "react";

// Brand marks for the tool marquee. JavaScript, Shopify, and LottieFiles come
// from the logo library; the rest are hand-authored to stay recognizable on a
// dark tile without pulling in a logo dependency.

export type Logo = { name: string; node: ReactNode };

const Figma = (
  <svg viewBox="0 0 38 57" className="h-full w-full">
    <path d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0Z" fill="#1abcfe" />
    <path d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0Z" fill="#0acf83" />
    <path d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19Z" fill="#ff7262" />
    <path d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5Z" fill="#f24e1e" />
    <path d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5Z" fill="#a259ff" />
  </svg>
);

const React_ = (
  <svg viewBox="-11.5 -10.23 23 20.46" className="h-full w-full">
    <circle r="2.05" fill="#61dafb" />
    <g stroke="#61dafb" strokeWidth="1" fill="none">
      <ellipse rx="11" ry="4.2" />
      <ellipse rx="11" ry="4.2" transform="rotate(60)" />
      <ellipse rx="11" ry="4.2" transform="rotate(120)" />
    </g>
  </svg>
);

const NextJs = (
  <svg viewBox="0 0 256 256" className="h-full w-full">
    <circle cx="128" cy="128" r="128" fill="#fff" />
    <path
      d="M212.6 224.3 98.7 76H84v103.9h11.8V91l107.5 140.4a128.6 128.6 0 0 0 9.3-7.1Z"
      fill="#000"
    />
    <path d="M161 76h11.7v104H161V76Z" fill="#000" />
  </svg>
);

const Webflow = (
  <svg viewBox="0 0 24 24" className="h-full w-full">
    <path
      fill="#4353ff"
      d="M24 4.5 16.5 19h-7l3.1-6.1h-.1C9.9 16.2 6.1 18.3 0 19v-6.9s3.9-.2 6.2-2.6H0V4.5h5.4V9h.1l2.2-4.5H12V9h.1l2.3-4.5H24Z"
    />
  </svg>
);

const Shopify = (
  <svg viewBox="0 0 256 292" className="h-full w-full">
    <path
      d="M223.8 57.3c-.2-1.5-1.5-2.3-2.5-2.4-1.1-.1-23.4-1.7-23.4-1.7s-15.5-15.4-17.2-17.1c-1.7-1.7-5-1.2-6.3-.8-.2.1-3.4 1-8.7 2.7-5.2-14.9-14.3-28.6-30.4-28.6h-1.4C129.3 3.4 123.6.8 118.7.8c-37.4 0-55.3 46.8-61 70.6L31.5 79.6c-8.1 2.5-8.4 2.8-9.4 10.5C21.3 95.8 0 260.2 0 260.2l165.7 31 89.8-19.4S224 58.8 223.8 57.3ZM156.5 40.8l-14 4.4v-3c0-9.3-1.3-16.7-3.4-22.6 8.3 1 13.8 10.4 17.4 21.2Zm-27.7-19.4c2.3 5.7 3.8 14 3.8 25.2v1.6l-29 9c5.6-21.6 16-32 25.2-35.8Zm-11.1-10.6c1.6 0 3.2.6 4.8 1.7-12 5.6-24.9 19.9-30.3 48.3l-22.9 7.1c6.5-22 21.6-57.3 48.4-57.3Z"
      fill="#95bf46"
    />
    <path
      d="M221.2 55c-1.1-.1-23.4-1.7-23.4-1.7s-15.5-15.4-17.2-17.1c-.6-.6-1.5-1-2.4-1.1l-12.5 256.2 89.8-19.4S224 58.8 223.8 57.3c-.2-1.5-1.5-2.3-2.6-2.4"
      fill="#5e8e3e"
    />
    <path
      d="m135.2 104.6-11 32.9s-9.7-5.2-21.6-5.2c-17.4 0-18.3 11-18.3 13.7 0 15 39.2 20.8 39.2 56 0 27.7-17.6 45.6-41.3 45.6-28.4 0-43-17.7-43-17.7l7.6-25.2s14.9 12.8 27.6 12.8c8.2 0 11.6-6.5 11.6-11.2 0-19.6-32.2-20.5-32.2-52.7 0-27.2 19.5-53.4 58.8-53.4 15.1 0 22.6 4.4 22.6 4.4"
      fill="#fff"
    />
  </svg>
);

const JavaScript = (
  <svg viewBox="0 0 1052 1052" className="h-full w-full">
    <path fill="#f0db4f" d="M0 0h1052v1052H0z" />
    <path
      d="M965.9 801.1c-7.7-48-39-88.3-131.7-125.9-32.2-14.8-68.1-25.4-78.8-49.8-3.8-14.2-4.3-22.2-1.9-30.8 6.9-27.9 40.2-36.6 66.6-28.6 17 5.7 33.1 18.8 42.8 39.7 45.4-29.4 45.3-29.2 77-49.4-11.6-18-17.8-26.3-25.4-34-27.3-30.5-64.5-46.2-124-45l-31 4c-29.7 7.5-58 23.1-74.6 44-49.8 56.5-35.6 155.4 25 196.1 59.7 44.8 147.4 55 158.6 96.9 10.9 51.3-37.7 67.9-86 62-35.6-7.4-55.4-25.5-76.8-58.4l-79.9 46.1c9.6 21 19.7 30.5 35.8 48.7 76.2 77.3 266.9 73.5 301.1-43.5 1.4-4 10.6-30.8 3.2-72.1Zm-394-317.6h-98.4c0 85-.4 169.4-.4 254.4 0 54.1 2.8 103.7-6 118.9-14.4 29.9-51.7 26.2-68.7 20.4-17.3-8.5-26.1-20.6-36.3-37.7l-5.6-9c-26.7 16.3-53.3 32.7-80 49 13.3 27.3 32.9 51 58 66.4 37.5 22.5 87.9 29.4 140.6 17.3 34.3-10 63.9-30.7 79.4-62.2 22.4-41.3 17.6-91.3 17.4-146.6.5-90.2 0-180.4 0-270.9Z"
      fill="#323330"
    />
  </svg>
);

const LottieFiles = (
  <svg viewBox="0 0 81 81" className="h-full w-full">
    <rect x="0.3" y="0.3" width="80" height="80" rx="20" fill="#00ddb3" />
    <path
      d="M61.1 18.2c-13.8 0-18.9 9.8-23 17.7l-2.7 5c-4.3 8.4-7.6 13.5-15.9 13.5a3.95 3.95 0 1 0 0 7.9c13.8 0 18.9-9.8 23-17.7l2.7-5c4.3-8.4 7.6-13.5 16-13.5a3.95 3.95 0 1 0 0-7.9Z"
      fill="#fff"
    />
  </svg>
);

const AdobeCc = (
  <svg viewBox="0 0 24 24" className="h-full w-full">
    <defs>
      <linearGradient id="acc-grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#ff1f8f" />
        <stop offset="0.5" stopColor="#7c3aed" />
        <stop offset="1" stopColor="#ffb703" />
      </linearGradient>
    </defs>
    <rect width="24" height="24" rx="6" fill="url(#acc-grad)" />
    <path
      d="M9.6 9.4c-1.6 0-2.8 1.2-2.8 2.7s1.2 2.7 2.8 2.7c.8 0 1.5-.3 2-.9M17 9.4c-1.6 0-2.8 1.2-2.8 2.7s1.2 2.7 2.8 2.7c.8 0 1.5-.3 2-.9"
      fill="none"
      stroke="#fff"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
  </svg>
);

const Spline = (
  <svg viewBox="0 0 24 24" className="h-full w-full" fill="none">
    <path
      d="M4 15.5c2.2 2 5.3 2 7.5 0s5.3-2 7.5 0M4.5 8.5c2.2-2 5.3-2 7.5 0s5.3 2 7.5 0"
      stroke="#3ad6c5"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
  </svg>
);

const Blender = (
  <svg viewBox="0 0 24 24" className="h-full w-full" fill="none">
    <path
      d="M21 13.4c0 3.3-3.8 5.9-8.5 5.9-3.4 0-6.4-1.4-7.8-3.4-.5-.7-.7-1.4-.7-2.2 0-1.2.5-2.3 1.5-3.1l6.2-4.7-3.4-.2 5-3 .9 3.9 1 .8c3.5.3 5.8 2.8 5.8 6Z"
      fill="#ea7600"
    />
    <circle cx="11" cy="13.6" r="3.2" fill="#fff" />
    <circle cx="11" cy="13.8" r="1.7" fill="#265787" />
  </svg>
);

const Claude = (
  <svg viewBox="0 0 24 24" className="h-full w-full">
    <g stroke="#d97757" strokeWidth="2.1" strokeLinecap="round">
      {Array.from({ length: 12 }).map((_, i) => (
        <line key={i} x1="12" y1="12" x2="12" y2="3.2" transform={`rotate(${i * 30} 12 12)`} />
      ))}
    </g>
  </svg>
);

const Illustrator = (
  <svg viewBox="0 0 24 24" className="h-full w-full">
    <rect width="24" height="24" rx="6" fill="#1a0d00" />
    <text
      x="12"
      y="16.4"
      textAnchor="middle"
      fontFamily="system-ui, -apple-system, sans-serif"
      fontSize="10.5"
      fontWeight="700"
      fill="#ff9a00"
    >
      Ai
    </text>
  </svg>
);

const FinalCutPro = (
  <svg viewBox="0 0 24 24" className="h-full w-full">
    <rect width="24" height="24" rx="6" fill="#1b1d24" />
    {/* Clapperboard: angled striped top over a blue body. */}
    <path d="M4 8.4 17.9 5.9l.5 2.7L4.5 11.1 4 8.4Z" fill="#e8ecf3" />
    <path
      d="m6.6 7.5 1 2.2M9.5 7 10.5 9.2M12.4 6.5l1 2.2M15.3 6l1 2.2"
      stroke="#1b1d24"
      strokeWidth="0.9"
    />
    <rect x="4.4" y="11.1" width="15.2" height="7.4" rx="1.2" fill="#3457d5" />
    <path d="M10.5 13.2v4l3.2-2-3.2-2Z" fill="#fff" />
  </svg>
);

export const LOGOS: Record<string, ReactNode> = {
  Blender,
  Figma,
  Webflow,
  JavaScript,
  "Next.js": NextJs,
  React: React_,
  Shopify,
  LottieFiles,
  "Adobe CC": AdobeCc,
  Spline,
  Claude,
  Illustrator,
  "Final Cut Pro": FinalCutPro,
};
