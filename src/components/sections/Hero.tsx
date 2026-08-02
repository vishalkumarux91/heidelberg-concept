"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { brand, hero } from "@/content/copy";

/**
 * Section 01 — the scroll-driven weather hero. The one place the page
 * spends its boldness (see DESIGN_INSTRUCTIONS §1).
 *
 * Desktop: a 520vh pinned sequence. Four frames of the same house and
 * valley — Summer → Monsoon → Desert → Winter — crossfaded by directional
 * mask wipes while a particle canvas rains, snows and blows dust. Effects
 * lead the image: particles ramp from 0–55% of a transition, the wipe
 * starts at 28%, so rain falls on the sunny frame before the sky darkens.
 * That ordering is what makes it read as weather changing rather than
 * pictures swapping.
 *
 * Per-transition direction: monsoon descends (175°, y), desert washes in
 * sideways (90°, x), winter settles diagonally (135°, both).
 *
 * Mobile (<768px): no scroll-jacking — a swipeable snap carousel.
 * Reduced motion: the pinned sequence is abandoned entirely; the first
 * frame renders statically with the four states as a labelled grid.
 */

/**
 * Frame widths, cut from the 5504x3072 masters with identical encoder
 * settings across all four frames — so no frame-to-frame texture
 * variation shows up during the crossfades. AVIF is served first, WebP
 * is the fallback source.
 */
const WIDTHS = [1080, 1600, 2560, 3840] as const;

/** Weather behaviour, angle and wipe axis keyed by the incoming layer. */
const MODES = ["calm", "rain", "dust", "snow"] as const;
const ANGLES = [175, 175, 90, 135] as const;
const AXES = ["y", "y", "x", "both"] as const;

type Mode = (typeof MODES)[number];

function srcSet(id: string, ext: "avif" | "webp") {
  return WIDTHS.map((w) => `/hero/${id}-${w}.${ext} ${w}w`).join(", ");
}

function ease(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReduced(onChange: () => void) {
  const mq = window.matchMedia(REDUCED_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function useReducedMotion() {
  return useSyncExternalStore(
    subscribeReduced,
    () => window.matchMedia(REDUCED_QUERY).matches,
    () => false,
  );
}

export function Hero() {
  const pinRef = useRef<HTMLDivElement>(null);
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cloudARef = useRef<HTMLDivElement>(null);
  const cloudBRef = useRef<HTMLDivElement>(null);
  const gradeRef = useRef<HTMLDivElement>(null);
  const sheenRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hudLabelRef = useRef<HTMLSpanElement>(null);
  const hudFillRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const pin = pinRef.current;
    const cv = canvasRef.current;
    if (!pin || !cv) return;
    if (!window.matchMedia("(min-width: 768px)").matches) return;

    const ctx = cv.getContext("2d");
    if (!ctx) return;

    const segs = hero.seasons.length - 1;
    let W = 0;
    let H = 0;
    let raf = 0;
    let running = false;
    let lastT = performance.now();
    let cloudOff = 0;
    let fx = { o: "calm" as Mode, n: "calm" as Mode, lead: 0 };
    let activeIdx = 0;

    type Particle = { x: number; y: number; s: number; r: number; ph: number };
    let P: Particle[] = [];

    function seed() {
      P = [];
      for (let i = 0; i < 520; i++) {
        P.push({
          x: Math.random() * W,
          y: Math.random() * H,
          s: 0.5 + Math.random() * 0.95,
          r: 1 + Math.random() * 2.5,
          ph: Math.random() * 6.28,
        });
      }
    }

    function resize() {
      if (!cv || !ctx) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = cv.clientWidth;
      H = cv.clientHeight;
      cv.width = W * dpr;
      cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    }

    function update() {
      if (!pin) return;
      const r = pin.getBoundingClientRect();
      const tot = r.height - window.innerHeight;
      const prog = Math.min(1, Math.max(0, -r.top / tot));
      const sf = prog * segs;
      const si = Math.min(Math.floor(sf), segs - 1);
      const t = sf - si;

      // Effects lead (0–55%), the wipe follows (28%→100%).
      const wipe = ease(Math.min(1, Math.max(0, (t - 0.28) / 0.72)));
      const lead = Math.min(1, t / 0.55);

      const ang = ANGLES[si + 1] ?? 175;
      const ax = AXES[si + 1] ?? "y";
      const size = ax === "y" ? "100% 300%" : ax === "x" ? "300% 100%" : "300% 300%";
      const off = (1 - wipe) * 100;
      const px = ax === "x" || ax === "both" ? off : 0;
      const py = ax === "y" || ax === "both" ? off : 0;

      layerRefs.current.forEach((el, i) => {
        if (!el) return;
        if (i < si) {
          el.style.opacity = "0";
        } else if (i === si) {
          el.style.opacity = "1";
          el.style.maskImage = "none";
          el.style.webkitMaskImage = "none";
        } else if (i === si + 1) {
          el.style.opacity = "1";
          const m = `linear-gradient(${ang}deg, #000 0%, #000 36%, transparent 64%)`;
          el.style.maskImage = m;
          el.style.webkitMaskImage = m;
          el.style.maskSize = size;
          el.style.webkitMaskSize = size;
          el.style.maskPosition = `${px}% ${py}%`;
          el.style.webkitMaskPosition = `${px}% ${py}%`;
        } else {
          el.style.opacity = "0";
        }
      });

      fx = { o: MODES[si], n: MODES[si + 1], lead };

      const storm = (m: Mode) => (m === "rain" ? 1 : m === "snow" ? 0.7 : m === "dust" ? 0.25 : 0.16);
      const cw = storm(MODES[si]) * (1 - lead) + storm(MODES[si + 1]) * lead;
      if (cloudARef.current) cloudARef.current.style.opacity = (cw * 0.55).toFixed(3);
      if (cloudBRef.current) cloudBRef.current.style.opacity = (cw * 0.45).toFixed(3);

      const dk = (m: Mode) => (m === "rain" ? 0.28 : m === "snow" ? 0.09 : 0);
      const dv = dk(MODES[si]) * (1 - lead) + dk(MODES[si + 1]) * lead;
      if (gradeRef.current) {
        gradeRef.current.style.background =
          MODES[si] === "snow" || MODES[si + 1] === "snow"
            ? "linear-gradient(#cddbe8, #aebecd)"
            : "linear-gradient(#41505c, #2d3a44)";
        gradeRef.current.style.opacity = dv.toFixed(3);
      }

      const wet = (m: Mode) => (m === "rain" ? 1 : 0);
      if (sheenRef.current) {
        sheenRef.current.style.opacity = (
          (wet(MODES[si]) * (1 - lead) + wet(MODES[si + 1]) * lead) * 0.52
        ).toFixed(3);
      }

      const idx = t > 0.5 ? si + 1 : si;
      if (hudLabelRef.current) hudLabelRef.current.textContent = hero.seasons[idx].name;
      if (hudFillRef.current) hudFillRef.current.style.width = `${(prog * 100).toFixed(1)}%`;
      if (idx !== activeIdx) {
        activeIdx = idx;
        setActive(idx);
      }
    }

    function draw(now: number) {
      if (!running || !ctx) return;
      const dt = Math.min(now - lastT, 50);
      lastT = now;

      // Drive the sequence from the frame loop, not only from scroll
      // events: under smooth scroll a programmatic window.scrollTo (deep
      // link, scroll restoration) moves the page without emitting one,
      // which would leave the frames and HUD stale. The loop is already
      // running whenever the hero is on screen, and this is a single
      // rect read per frame.
      update();

      ctx.clearRect(0, 0, W, H);

      const spd = fx.n === "rain" || fx.o === "rain" ? 26 : 12;
      cloudOff = (cloudOff + (dt * spd) / 1000) % 1000;
      if (cloudARef.current) cloudARef.current.style.transform = `translateX(${-cloudOff}px)`;
      if (cloudBRef.current) cloudBRef.current.style.transform = `translateX(${-cloudOff * 0.55}px)`;

      const amt = (k: Mode) => (fx.o === k ? 1 : 0) * (1 - fx.lead) + (fx.n === k ? 1 : 0) * fx.lead;
      const rain = amt("rain");
      const snow = amt("snow");
      const dust = amt("dust");

      if (rain > 0.01) {
        ctx.strokeStyle = `rgba(208,224,238,${0.5 * Math.min(rain, 1)})`;
        ctx.lineWidth = 1.1;
        const n = Math.floor(P.length * Math.min(rain, 1));
        for (let i = 0; i < n; i++) {
          const p = P[i];
          p.y += dt * (1.05 + p.s) * 1.08;
          p.x += dt * 0.17;
          if (p.y > H) {
            p.y = -30;
            p.x = Math.random() * W;
          }
          if (p.x > W) p.x -= W;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - 4.8, p.y - 20);
          ctx.stroke();
        }
      }
      if (snow > 0.01) {
        ctx.fillStyle = `rgba(255,255,255,${0.84 * Math.min(snow, 1)})`;
        const n = Math.floor(P.length * 0.66 * Math.min(snow, 1));
        for (let i = 0; i < n; i++) {
          const p = P[i];
          p.y += dt * (0.055 + p.s * 0.055);
          p.ph += dt * 0.0016;
          p.x += Math.sin(p.ph) * 0.44;
          if (p.y > H) {
            p.y = -12;
            p.x = Math.random() * W;
          }
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 0.72, 0, 6.283);
          ctx.fill();
        }
      }
      if (dust > 0.01) {
        ctx.fillStyle = `rgba(228,203,158,${0.3 * Math.min(dust, 1)})`;
        const n = Math.floor(P.length * 0.42 * Math.min(dust, 1));
        for (let i = 0; i < n; i++) {
          const p = P[i];
          p.x += dt * (0.14 + p.s * 0.12);
          p.ph += dt * 0.0011;
          p.y += Math.sin(p.ph) * 0.23;
          if (p.x > W) {
            p.x = -14;
            p.y = Math.random() * H;
          }
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 0.5, 0, 6.283);
          ctx.fill();
        }
      }

      raf = requestAnimationFrame(draw);
    }

    // Pause the RAF loop when the hero is off screen.
    const io = new IntersectionObserver(([entry]) => {
      const visible = entry.isIntersecting;
      if (visible && !running) {
        running = true;
        lastT = performance.now();
        raf = requestAnimationFrame(draw);
      } else if (!visible && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    });
    io.observe(pin);

    const onScroll = () => update();
    const onResize = () => {
      resize();
      update();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    resize();
    update();

    return () => {
      io.disconnect();
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [reduced]);

  const season = hero.seasons[active];

  return (
    <section aria-label="Mycem — strong for every season" className="relative bg-ink-deep text-white">
      {/* Text alternative for the visual sequence. */}
      <p className="sr-only">
        One house and valley shown through four Indian weather states — summer heat, monsoon rain,
        desert dryness and winter frost — with the same structure standing through all of them.
      </p>

      {reduced ? (
        <StaticHero />
      ) : (
        <>
          {/* ---------- Desktop: pinned scroll sequence ---------- */}
          <div ref={pinRef} className="relative hidden h-[520vh] md:block">
            <div className="sticky top-0 h-screen overflow-hidden">
              {hero.seasons.map((s, i) => (
                <div
                  key={s.id}
                  ref={(el) => {
                    layerRefs.current[i] = el;
                  }}
                  className="absolute inset-0 will-change-[opacity]"
                  style={{ opacity: i === 0 ? 1 : 0 }}
                >
                  <SeasonFrame season={s} eager={i === 0} />
                </div>
              ))}

              <div ref={cloudARef} className="hero-cloud hero-cloud-a" />
              <div ref={cloudBRef} className="hero-cloud hero-cloud-b" />
              <div
                ref={sheenRef}
                className="pointer-events-none absolute inset-0 opacity-0 [background:linear-gradient(to_bottom,transparent_56%,rgba(118,148,174,0.34)_100%)]"
              />
              <div ref={gradeRef} className="pointer-events-none absolute inset-0 opacity-0 mix-blend-multiply" />
              <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" />
              <div className="hero-grain" />

              {/* Scrim for type legibility. */}
              <div className="hero-scrim" />

              <LogoBox />

              {/* Headline block, bottom-left. */}
              <div className="absolute inset-x-0 bottom-0">
                <div className="shell pb-32">
                  <p className="label-tag hero-text-shadow text-white/75">{hero.eyebrow}</p>
                  <h1 className="display hero-text-shadow mt-5 max-w-[13ch] text-[length:var(--text-mega)] text-white">
                    {hero.headline.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </h1>

                  {/* The season line: stressor, then answer. */}
                  <div className="mt-7 flex min-h-14 max-w-xl items-start" aria-live="polite">
                    <p
                      key={season.id}
                      className="rise-in hero-text-shadow text-lg leading-snug text-white/90 md:text-xl"
                    >
                      <span className="font-semibold text-white">{season.stressor}</span>{" "}
                      <span className="text-white/80">{season.answer}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* HUD: progress only. Bottom-centre, minimal. */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center gap-3 pb-7">
                <span ref={hudLabelRef} className="sr-only">
                  {hero.seasons[0].name}
                </span>
                <div className="h-0.5 w-52 overflow-hidden rounded-full bg-white/25">
                  <div ref={hudFillRef} className="h-full w-0 bg-white" />
                </div>
                <p className="label-tag text-[0.5625rem] text-white/50">{hero.scrollCue}</p>
              </div>
            </div>
          </div>

          {/* ---------- Mobile: swipeable carousel, no scroll-jack ---------- */}
          <MobileHero />
        </>
      )}
    </section>
  );
}

/* ------------------------------------------------------------------ */

function SeasonFrame({
  season,
  eager = false,
}: {
  season: (typeof hero.seasons)[number];
  eager?: boolean;
}) {
  // Only the first frame is eager; the other three lazy-load so they
  // don't compete for bandwidth at first paint. The seasonal gradient
  // behind carries the state until its frame decodes.
  return (
    <div className={`absolute inset-0 hero-fallback-${season.id}`}>
      <picture>
        <source type="image/avif" srcSet={srcSet(season.id, "avif")} sizes="100vw" />
        <source type="image/webp" srcSet={srcSet(season.id, "webp")} sizes="100vw" />
        { }
        <img
          src={`/hero/${season.id}-2560.webp`}
          alt=""
          decoding="async"
          loading={eager ? "eager" : "lazy"}
          fetchPriority={eager ? "high" : "low"}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </picture>
    </div>
  );
}

/**
 * Logo in a White logo box — one of the four approved box colours.
 *
 * White rather than Deep Green because the supplied asset is the
 * positive colourway (green wordmark): on a Deep Green box it would be
 * invisible, and recolouring the mark is not permitted. If the mono
 * white colourway is supplied later, this box can move to Deep Green.
 *
 * Clear space is half the mark's height on all four sides, which is
 * what the padding below resolves to at each breakpoint. The box is
 * always square-cornered — never rounded.
 */
function LogoBox({ compact = false }: { compact?: boolean }) {
  return (
    <div className="absolute left-0 top-0 z-10">
      <div className={`bg-white ${compact ? "px-4 py-4" : "px-7 py-7"}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/logo.png"
          alt={`${brand.parent} — ${brand.name}`}
          width={2034}
          height={369}
          className={compact ? "h-4 w-auto" : "h-7 w-auto"}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function MobileHero() {
  const [index, setIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const onScroll = () => {
      const i = Math.round(el.scrollLeft / el.clientWidth);
      setIndex(Math.max(0, Math.min(hero.seasons.length - 1, i)));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="md:hidden">
      <div className="relative">
        <div
          ref={trackRef}
          role="region"
          aria-roledescription="carousel"
          aria-label="Four weather states"
          tabIndex={0}
          className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none]"
        >
          {hero.seasons.map((s, i) => (
            <div key={s.id} className="relative h-[62vh] w-full shrink-0 snap-center overflow-hidden">
              <SeasonFrame season={s} eager={i === 0} />
              <div className="hero-grain" />
              <div className="hero-scrim-mobile" />
              <div className="absolute inset-x-0 bottom-0 p-5 pb-8">
                <p className="label-tag text-white/80">{s.name}</p>
                <p className="mt-2 text-base leading-snug text-white/95">
                  <span className="font-semibold">{s.stressor}</span>{" "}
                  <span className="text-white/80">{s.answer}</span>
                </p>
              </div>
            </div>
          ))}
        </div>

        <LogoBox compact />

        <div className="absolute inset-x-0 bottom-2.5 flex justify-center gap-2" aria-hidden="true">
          {hero.seasons.map((s, i) => (
            <span
              key={s.id}
              className="h-1 w-6 rounded-full transition-opacity duration-300"
              style={{ background: s.tint, opacity: index === i ? 1 : 0.3 }}
            />
          ))}
        </div>
      </div>

      <div className="bg-ink-deep">
        <div className="shell py-12">
          <p className="label-tag text-white/70">{hero.eyebrow}</p>
          <h1 className="display mt-4 text-[length:var(--text-display)] text-white">
            {hero.headline.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>
          <p className="mt-5 max-w-[36ch] text-base leading-relaxed text-white/80">{hero.subhead}</p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

/** Reduced motion: no pin, no particles. First frame plus a labelled grid. */
function StaticHero() {
  return (
    <div>
      <div className="relative h-[80vh] overflow-hidden">
        <SeasonFrame season={hero.seasons[0]} eager />
        <div className="hero-scrim" />
        <LogoBox />
        <div className="absolute inset-x-0 bottom-0">
          <div className="shell pb-14">
            <p className="label-tag text-white/75">{hero.eyebrow}</p>
            <h1 className="display mt-5 max-w-[13ch] text-[length:var(--text-mega)] text-white">
              {hero.headline.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h1>
            <p className="mt-6 max-w-xl text-lg text-white/85">{hero.subhead}</p>
          </div>
        </div>
      </div>

      <div className="bg-ink-deep">
        <div className="shell grid grid-cols-2 gap-4 py-10 lg:grid-cols-4">
          {hero.seasons.map((s) => (
            <figure key={s.id} className="relative aspect-video overflow-hidden rounded-[var(--radius-sm)]">
              <SeasonFrame season={s} />
              <figcaption className="absolute bottom-0 left-0 bg-black/45 px-3 py-2">
                <span className="label-tag text-white">{s.name}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </div>
  );
}
