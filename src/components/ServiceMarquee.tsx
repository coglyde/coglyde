const ITEMS = [
  "Website Development",
  "SEO & GEO Optimization",
  "Paid Marketing",
  "AI Automations",
  "Premium 3D Models",
  "Custom Graphic Design",
];

// Continuously sliding strip of services, both ends fading into the background
// (a sponsor-line / ticker effect). Two identical sets scroll and loop
// seamlessly via the `marquee` keyframe.
export function ServiceMarquee() {
  return (
    <div
      className="relative w-full overflow-hidden py-1"
      style={{
        maskImage:
          "linear-gradient(to right, transparent, #000 14%, #000 86%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, #000 14%, #000 86%, transparent)",
      }}
    >
      <div className="flex w-max animate-[marquee_34s_linear_infinite] items-center motion-reduce:animate-none">
        {[0, 1].map((copy) => (
          <ul
            key={copy}
            className="flex shrink-0 items-center"
            aria-hidden={copy === 1 || undefined}
          >
            {ITEMS.map((item) => (
              <li
                key={item}
                className="flex items-center whitespace-nowrap text-sm font-light tracking-[0.04em] text-white/55"
              >
                <span
                  aria-hidden
                  className="mx-7 h-1 w-1 rounded-full bg-white/30"
                />
                {item}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
