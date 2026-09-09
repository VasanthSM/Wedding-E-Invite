"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import {
  CalendarDays,
  ChevronDown,
  Download,
  Heart,
  ImagePlus,
  MapPin,
  Music2,
  Pause,
  Sparkles,
} from "lucide-react";

const WEDDING_TARGET = new Date("2026-10-25T06:00:00+05:30").getTime();
const SECTION_IDS = [
  "invite",
  "story",
  "date-scratch",
  "countdown",
  "engagement",
  "wedding",
  "locations",
  "memories",
  "blessing",
  "kavithai",
];

type CupidPose = "envelope" | "scratch" | "sleep" | "heart";

const cupidAssets: Record<CupidPose, string> = {
  envelope: "/images/cupid-envelope-clean.webp",
  scratch: "/images/cupid-scratch-full-clean.webp",
  sleep: "/images/cupid-sleep-full-clean.webp",
  heart: "/images/cupid-heart-clean.webp",
};

function Cupid({ pose, className = "", alt = "Cupid" }: { pose: CupidPose; className?: string; alt?: string }) {
  return (
    <div className={`cupid cupid-${pose} ${className}`} aria-hidden={alt ? undefined : true}>
      <span className="cupid-glow" />
      <img src={cupidAssets[pose]} alt={alt} draggable={false} />
    </div>
  );
}

function Music() {
  const [on, setOn] = useState(false);
  const context = useRef<AudioContext | null>(null);
  const timer = useRef<number | null>(null);

  const stop = useCallback(() => {
    if (timer.current) window.clearInterval(timer.current);
    timer.current = null;
    context.current?.close();
    context.current = null;
    setOn(false);
  }, []);

  useEffect(() => stop, [stop]);

  function toggle() {
    if (on) return stop();

    const AudioCtx = window.AudioContext;
    if (!AudioCtx) return;
    const audio = new AudioCtx();
    const master = audio.createGain();
    master.gain.value = 0.055;
    master.connect(audio.destination);
    context.current = audio;

    const progression = [
      [261.63, 329.63, 392.0, 523.25],
      [220.0, 329.63, 440.0, 523.25],
      [196.0, 293.66, 392.0, 493.88],
      [174.61, 261.63, 349.23, 440.0],
    ];
    let bar = 0;

    const playBar = () => {
      const notes = progression[bar % progression.length];
      bar += 1;
      notes.forEach((frequency, index) => {
        const oscillator = audio.createOscillator();
        const gain = audio.createGain();
        const start = audio.currentTime + index * 0.42;
        oscillator.type = index % 2 ? "sine" : "triangle";
        oscillator.frequency.setValueAtTime(frequency, start);
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(0.14, start + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 1.25);
        oscillator.connect(gain).connect(master);
        oscillator.start(start);
        oscillator.stop(start + 1.3);
      });
    };

    playBar();
    timer.current = window.setInterval(playBar, 1900);
    setOn(true);
  }

  return (
    <button className={`music-control ${on ? "is-playing" : ""}`} aria-label={on ? "Pause invitation music" : "Play invitation music"} onClick={toggle}>
      <span>{on ? <Pause /> : <Music2 />}</span>
    </button>
  );
}

function Countdown() {
  const [left, setLeft] = useState(Math.max(0, WEDDING_TARGET - Date.now()));

  useEffect(() => {
    const id = window.setInterval(() => setLeft(Math.max(0, WEDDING_TARGET - Date.now())), 1000);
    return () => window.clearInterval(id);
  }, []);

  const values = [
    Math.floor(left / 864e5),
    Math.floor(left / 36e5) % 24,
    Math.floor(left / 6e4) % 60,
    Math.floor(left / 1000) % 60,
  ];

  return (
    <div className="countdown" aria-label="Countdown to the wedding">
      {values.map((value, index) => (
        <div className="countdown-unit" key={index}>
          <b>{String(value).padStart(2, "0")}</b>
          <span>{["Days", "Hours", "Minutes", "Seconds"][index]}</span>
        </div>
      ))}
    </div>
  );
}

function PremiumScratch({ onComplete }: { onComplete: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const drawing = useRef(false);
  const completed = useRef(false);
  const path = useRef<Array<{ x: number; y: number }>>([]);
  const cells = useRef(new Set<string>());
  const lastPoint = useRef<{ x: number; y: number } | null>(null);
  const [progress, setProgress] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const paintCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const host = hostRef.current;
    if (!canvas || !host) return;

    const rect = host.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const width = rect.width;
    const height = rect.height;
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#ead5b0");
    gradient.addColorStop(0.32, "#c49a61");
    gradient.addColorStop(0.64, "#b77f8e");
    gradient.addColorStop(1, "#836b9f");
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    const sheen = ctx.createLinearGradient(0, 0, width, 0);
    sheen.addColorStop(0, "rgba(255,255,255,.05)");
    sheen.addColorStop(0.47, "rgba(255,255,255,.34)");
    sheen.addColorStop(0.56, "rgba(255,255,255,.06)");
    ctx.fillStyle = sheen;
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = "rgba(255,250,240,.55)";
    ctx.lineWidth = 1;
    ctx.strokeRect(12, 12, width - 24, height - 24);
    ctx.strokeStyle = "rgba(77,49,67,.22)";
    ctx.strokeRect(18, 18, width - 36, height - 36);

    ctx.fillStyle = "rgba(255,250,245,.95)";
    ctx.textAlign = "center";
    ctx.font = "600 12px ui-sans-serif, system-ui, sans-serif";
    ctx.fillText("CUPID'S LITTLE SECRET", width / 2, height / 2 - 7);
    ctx.font = "500 10px ui-sans-serif, system-ui, sans-serif";
    ctx.fillText("SCRATCH TO REVEAL", width / 2, height / 2 + 16);

    if (path.current.length) {
      ctx.globalCompositeOperation = "destination-out";
      path.current.forEach((point) => {
        ctx.beginPath();
        ctx.arc(point.x * width, point.y * height, Math.max(24, width * 0.07), 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalCompositeOperation = "source-over";
    }
  }, []);

  useEffect(() => {
    paintCanvas();
    if (typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver(() => window.requestAnimationFrame(paintCanvas));
      if (hostRef.current) observer.observe(hostRef.current);
      return () => observer.disconnect();
    }
    const onResize = () => window.requestAnimationFrame(paintCanvas);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [paintCanvas]);

  const eraseAt = useCallback((clientX: number, clientY: number) => {
    if (completed.current) return;
    const canvas = canvasRef.current;
    const host = hostRef.current;
    if (!canvas || !host) return;
    const rect = host.getBoundingClientRect();
    const nx = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const ny = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));

    const previous = lastPoint.current;
    const samples = previous ? Math.max(1, Math.ceil(Math.hypot(nx - previous.x, ny - previous.y) * 28)) : 1;
    for (let i = 1; i <= samples; i += 1) {
      const x = previous ? previous.x + (nx - previous.x) * (i / samples) : nx;
      const y = previous ? previous.y + (ny - previous.y) * (i / samples) : ny;
      path.current.push({ x, y });
      cells.current.add(`${Math.floor(x * 12)}:${Math.floor(y * 8)}`);
    }
    lastPoint.current = { x: nx, y: ny };

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalCompositeOperation = "destination-out";
    const radius = Math.max(24, rect.width * 0.07);
    ctx.beginPath();
    ctx.arc(nx * rect.width, ny * rect.height, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = "source-over";

    const nextProgress = Math.min(100, Math.round((cells.current.size / 58) * 100));
    setProgress(nextProgress);

    if (nextProgress >= 52 && !completed.current) {
      completed.current = true;
      drawing.current = false;
      setRevealed(true);
      if (typeof canvas.animate === "function") {
        canvas.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 650, easing: "cubic-bezier(.22,.8,.24,1)", fill: "forwards" });
      }
      window.setTimeout(onComplete, 900);
    }
  }, [onComplete]);

  function pointerDown(event: React.PointerEvent<HTMLCanvasElement>) {
    if (completed.current) return;
    drawing.current = true;
    lastPoint.current = null;
    event.currentTarget.setPointerCapture(event.pointerId);
    eraseAt(event.clientX, event.clientY);
  }

  function pointerMove(event: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current || completed.current) return;
    event.preventDefault();
    const points = event.nativeEvent.getCoalescedEvents?.() ?? [event.nativeEvent];
    points.forEach((point) => eraseAt(point.clientX, point.clientY));
  }

  function pointerEnd(event: React.PointerEvent<HTMLCanvasElement>) {
    drawing.current = false;
    lastPoint.current = null;
    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      // Pointer may already have been released by the browser.
    }
  }

  return (
    <div className={`scratch-shell ${revealed ? "is-revealed" : ""}`}>
      <div ref={hostRef} className="scratch-stage">
        <div className="scratch-reveal" aria-live="polite">
          <span className="date-eyebrow">OUR WEDDING DAY</span>
          <strong>25</strong>
          <b>OCTOBER · 2026</b>
          <i>Selvam <em>♡</em> Raja Praba</i>
        </div>
        <canvas
          ref={canvasRef}
          className="scratch-canvas"
          aria-label="Scratch the card to reveal the wedding date"
          onPointerDown={pointerDown}
          onPointerMove={pointerMove}
          onPointerUp={pointerEnd}
          onPointerCancel={pointerEnd}
          onContextMenu={(event) => event.preventDefault()}
        />
        <div className="scratch-sparkles" aria-hidden="true">
          {Array.from({ length: 56 }, (_, index) => {
            const angle = (index / 56) * Math.PI * 2 + (index % 4) * 0.11;
            const distance = 92 + (index % 6) * 14;
            const x = Math.round(Math.cos(angle) * distance * 1.28);
            const y = Math.round(Math.sin(angle) * distance * 0.88);

            const particleStyle = {
              "--sx": `${x}px`,
              "--sy": `${y}px`,
              animationDelay: `${(index % 10) * 0.035}s`,
              fontSize: `${13 + (index % 5) * 2}px`,
            } as CSSProperties;

            return (
              <i key={index} style={particleStyle}>
                {index % 7 === 0 ? "✦" : index % 3 === 0 ? "♥" : "♡"}
              </i>
            );
          })}
        </div>
      </div>
      <button className="scratch-fallback" type="button" onClick={() => { if (!completed.current) { completed.current = true; setProgress(100); setRevealed(true); window.setTimeout(onComplete, 450); } }}>
        Trouble scratching? Reveal the date
      </button>
    </div>
  );
}

function Intro({ open }: { open: () => void }) {
  const [opening, setOpening] = useState(false);

  function reveal() {
    if (opening) return;

    setOpening(true);
    window.setTimeout(open, 1050);
  }

  return (
    <section className={`intro ${opening ? "is-opening" : ""}`}>
      <div
        className="intro-ornament intro-ornament-left"
        aria-hidden="true"
      />

      <div
        className="intro-ornament intro-ornament-right"
        aria-hidden="true"
      />

      <div className="intro-copy">
        <span className="eyebrow">A POSTCARD FROM CUPID</span>

        <h1>
          Something beautiful
          <br />
          <i>is waiting</i>
        </h1>

        <p>A little love story is about to unfold.</p>
      </div>

      <Cupid
        pose="envelope"
        className="intro-cupid"
        alt="Cupid carrying the invitation"
      />

      <div className="postcard-scene">
        <div className="postcard-shadow" />

        {/* Closed envelope body */}
        <div className="envelope-back">
          <div className="envelope-inner-shadow" />
        </div>

        {/* Front folded paper sections */}
        <div className="envelope-front">
          <div className="envelope-fold envelope-fold-left" />
          <div className="envelope-fold envelope-fold-right" />
          <div className="envelope-fold envelope-fold-bottom" />
        </div>

        {/* Closed top flap */}
        <div className="envelope-flap">
          <div className="flap-highlight" />
          <div className="flap-shadow" />
        </div>

        {/* Wax seal */}
        <button
          className="wax-seal"
          onClick={reveal}
          aria-label="Open the wedding invitation"
        >
          <Heart fill="currentColor" />
          <span>OPEN</span>
        </button>
      </div>

      <div className="intro-note">Tap the seal to open</div>
    </section>
  );
}

function DateReveal({ done }: { done: () => void }) {
  return (
    <section id="date-scratch" className="page date-scratch section-reveal">
      <div className="section-heading">
        <span className="eyebrow">CUPID IS HIDING THE DATE</span>
        <h2>Scratch the magic</h2>
      </div>
      <Cupid pose="scratch" className="date-cupid" alt="Cupid pointing to the scratch card" />
      <PremiumScratch onComplete={done} />
      <div className="locked-hint"><Sparkles /> Scratch to unlock the celebration</div>
    </section>
  );
}

function Poster({ kind }: { kind: "engagement" | "wedding" }) {
  const engagement = kind === "engagement";
  const image = engagement ? "/images/engagement-poster.webp" : "/images/wedding-poster.webp";

  return (
    <section id={engagement ? "engagement" : "wedding"} className={`page poster-page ${engagement ? "engagement-page" : "wedding-page"} section-reveal`}>
      <div className="poster-kicker">
        <span className="eyebrow">{engagement ? "THE EVENING BEFORE" : "THE MOMENT WE SAY I DO"}</span>
        <b>{engagement ? "Engagement" : "Muhurtham"}</b>
      </div>
      <div className="poster-frame">
        <img src={image} loading="lazy" alt={engagement ? "Engagement invitation backdrop" : "Wedding invitation backdrop"} />
        <div className="poster-vignette" />
        <div className="poster-copy">
          <span>{engagement ? "ENGAGEMENT" : "WEDDING · MUHURTHAM"}</span>
          <h2>Selvam <i>&</i><br />Raja Praba</h2>
          <br/>
          <div className="poster-professions">
            <small>Selvam · B.E. · Software Engineer</small>
            <em>Infoane Technologies</em>
            <small>Raja Praba · BA LL.B. · Advocate</small>
          </div>
          <Heart fill="currentColor" />
          <h3>{engagement ? "24 October 2026" : "25 October 2026"}</h3>
          <p>{engagement ? <>Saturday · Illathar Mahal<br />Kovilpatti</> : <>6:00 AM – 7:00 AM<br />Shenbhagavalli Amman Kovil</>}</p>
        </div>
      </div>
      <a className="text-action" download href={image}><Download /> Save {engagement ? "engagement" : "wedding"} poster</a>
    </section>
  );
}

function Blessing() {
  const [blessed, setBlessed] = useState(false);
  const [burstId, setBurstId] = useState(0);

  function sendBlessing() {
    // First click changes the content
    if (!blessed) {
      setBlessed(true);
    }

    // Every click restarts the heart burst
    setBurstId((prev) => prev + 1);
  }

  return (
    <section
      id="blessing"
      className={`page blessing section-reveal ${
        blessed ? "is-blessed" : ""
      }`}
    >
      <Cupid
        pose="heart"
        className="blessing-cupid"
        alt="Cupid holding a glowing heart"
      />

      <div className="blessing-card premium-card">
        <span className="eyebrow">ONE LITTLE MOMENT</span>

        <h2>
          {blessed ? "Your love reached us" : "Send us a blessing"}
        </h2>

        <p>
          {blessed
            ? "இந்த அழகான நாளில் உங்கள் அன்பும் ஆசீர்வாதமும் எங்களுடன் இருக்கட்டும்."
            : "Tap the heart and let Cupid carry your blessing into our new beginning."}
        </p>

        <button
          type="button"
          className="blessing-heart"
          onClick={sendBlessing}
          aria-label="Send a blessing"
        >
          <Heart fill="currentColor" />
        </button>

        <small className="blessing-caption">
          {blessed
            ? "With love, Selvam & Raja Praba"
            : "A tiny tap. A lot of love."}
        </small>
      </div>

      {/* New burst is created on EVERY click */}
      {burstId > 0 && (
        <div
          key={burstId}
          className="blessing-burst"
          aria-hidden="true"
        >
          {Array.from({ length: 56 }, (_, index) => {
            const angle =
              (index / 56) * Math.PI * 2 +
              (index % 5) * 0.08;

            const distance =
              120 + (index % 7) * 22;

            const x = Math.round(
              Math.cos(angle) * distance
            );

            const y = Math.round(
              Math.sin(angle) * distance
            );

            return (
              <i
                key={`${burstId}-${index}`}
                style={
                  {
                    "--bx": `${x}px`,
                    "--by": `${y}px`,
                    animationDelay: `${(index % 12) * 0.025}s`,
                    fontSize: `${14 + (index % 6) * 2}px`,
                  } as React.CSSProperties
                }
              >
                {index % 8 === 0
                  ? "✦"
                  : index % 3 === 0
                    ? "♥"
                    : "♡"}
              </i>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default function Home() {
  const [opened, setOpened] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [activeSection, setActiveSection] = useState("invite");

  useEffect(() => {
    document.body.classList.toggle("invitation-locked", !opened);
    return () => document.body.classList.remove("invitation-locked");
  }, [opened]);

  useEffect(() => {
    if (!opened) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveSection(visible.target.id);
        entries.forEach((entry) => entry.target.classList.toggle("is-visible", entry.isIntersecting));
      },
      { threshold: [0.3, 0.55, 0.8] },
    );
    document.querySelectorAll<HTMLElement>(".page").forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [opened, unlocked]);

  if (!opened) {
    return <main><Intro open={() => { setOpened(true); window.scrollTo(0, 0); }} /></main>;
  }

  const visibleSections = unlocked ? SECTION_IDS : SECTION_IDS.slice(0, 3);

  return (
    <main className="site">
      <div className="ambient-petals" aria-hidden="true">
        {Array.from({ length: 9 }, (_, index) => <i key={index}>{index % 4 === 0 ? "♡" : ""}</i>)}
      </div>

      <header className="site-header">
        <a className="monogram" href="#invite" aria-label="Selvam and Raja Praba invitation home">S <Heart fill="currentColor" /> R</a>
        <span className="header-date">{unlocked ? "25 · 10 · 2026" : "OUR LITTLE CUPID STORY"}</span>
        <Music />
      </header>

      <nav className="section-pager" aria-label="Invitation sections">
        {visibleSections.map((id) => <a key={id} className={activeSection === id ? "active" : ""} href={`#${id}`} aria-label={`Go to ${id}`} aria-current={activeSection === id ? "page" : undefined} />)}
      </nav>

      <section id="invite" className="page invite section-reveal">
        <div className="invite-aura" />
        <Cupid pose="envelope" className="invite-cupid" alt="Cupid delivering Selvam and Raja Praba's invitation" />
        <div className="invite-copy premium-card">
          <span className="eyebrow">
            TOGETHER WITH OUR FAMILIES
          </span>

          <h1 className="couple-name">
            Selvam
          </h1>

          <h1 className="couple-ampersand">
            <i>&</i>
          </h1>

          <h1 className="couple-name couple-name-long">
            Raja Praba
          </h1>

          <div className="heart-rule">
            <span />
            <Heart fill="currentColor" />
            <span />
          </div>

          <p>
            invite you to celebrate<br />
            the beginning of their forever.
          </p>
        </div>
        <a className="next-cue" href="#story"><span>Begin our story</span><ChevronDown /></a>
      </section>

      <section id="story" className="page story-page section-reveal">
        <div className="story-constellation" aria-hidden="true">
          <span className="orbit orbit-one" /><span className="orbit orbit-two" />
          <Heart fill="currentColor" />
          <i /><i /><i />
        </div>
        <div className="section-heading story-copy">
          <span className="eyebrow">NINE YEARS · ONE FOREVER</span>
          <h2>Written in the stars</h2>
          <p>From one beautiful hello to a lifetime of choosing each other.</p>
        </div>
        <div className="story-timeline">
          <article><span>01</span><b>2017</b><p>We met</p></article>
          <i />
          <article><span>02</span><b>2020</b><p>Stronger together</p></article>
          <i />
          <article><span>03</span><b>2026</b><p>Our forever begins</p></article>
        </div>
      </section>

      <DateReveal done={() => {
        setUnlocked(true);
        window.setTimeout(() => document.getElementById("engagement")?.scrollIntoView({ behavior: "smooth" }), 750);
      }} />

      {unlocked && <>
        <Poster kind="engagement" />
        <Poster kind="wedding" />

        <section id="locations" className="page venue section-reveal">
          <div className="section-heading">
            <span className="eyebrow">WHERE LOVE LEADS</span>
            <h2>Two celebrations</h2>
            <p>Two moments, one beautiful beginning.</p>
          </div>
          <div className="venue-grid">
            <article className="premium-card">
              <div className="venue-icon"><CalendarDays /></div>

              <span>24 & 25 · OCT · 2026</span>
              <b>Engagement & Reception</b>

              <h3>Illathar Mahal</h3>

              <p>
                <br />
                <strong>24 Oct · Engagement</strong><br />
                7:00 PM – 9:00 PM
                <br />
                <strong>25 Oct · Reception</strong><br />
                After Muhurtham
                <br />
                Kovilpatti, Thoothukudi
              </p>

              <a
                href="https://maps.app.goo.gl/nKdNxzqvvPiYEMsE6"
                target="_blank"
                rel="noopener noreferrer"
                style={{fontSize: "0.875rem", display: "inline-flex", alignItems: "center", gap: "0.25rem"}}
              >
                <MapPin /> Directions to Mahal
              </a>
            </article>
            <article className="premium-card">
              <div className="venue-icon"><Heart /></div>
              <span>25 · OCT · 2026</span>
              <b>Muhurtham</b>
              <h3>Shenbhagavalli Amman Temple</h3>
              <p>6:00 AM – 7:00 AM<br />Kovilpatti 628501, Thoothukudi</p>
              <a
                href="https://maps.app.goo.gl/255EAdpTU2puTKdd7"
                target="_blank"
                rel="noopener noreferrer"
                style={{fontSize: "0.875rem", display: "inline-flex", alignItems: "center", gap: "0.25rem"}}
              >
                <MapPin /> Directions to Temple
              </a>
            </article>
          </div>
        </section>

        <section id="memories" className="page memories section-reveal">
          <div className="memory-bg" />
          <div className="section-heading">
            <span className="eyebrow">OUR MEMORIES</span>
            <h2>Moments by the sea</h2>
            <p>Nine years, countless little stories. Your photographs can live here when they are ready.</p>
          </div>
          <div className="memory-scroll">
            {["Our first chapter", "Little adventures", "Sunset promises", "Nine years of us", "Forever begins"].map((label, index) => (
              <article key={label}>
                <div className="memory-placeholder"><ImagePlus /><span>PHOTO {String(index + 1).padStart(2, "0")}</span></div>
                <b>{label}</b>
                <small>{index === 4 ? "25 · 10 · 2026" : "A memory worth keeping"}</small>
              </article>
            ))}
          </div>
          <div className="swipe-hint"><span>SWIPE TO WANDER</span><i /></div>
        </section>

        <Blessing />

        <section id="countdown" className="page countdown-page section-reveal">
          <div className="countdown-copy premium-card">
            <span className="eyebrow">UNTIL WE SAY “I DO”</span>
            <h2>Dreaming of forever</h2>
            <p>Every second brings us a little closer to the day we have waited for.</p>
            <Countdown />
          </div>
          <Cupid pose="sleep" className="sleep-cupid" alt="Cupid sleeping peacefully on a cloud" />
        </section>
        <section id="kavithai" className="page kavithai section-reveal">
        <div className="kavithai-orbit" aria-hidden="true">
          <Heart fill="currentColor" />
        </div>

        <div className="kavithai-card premium-card">
          <span className="eyebrow">
            திருமண வாழ்வின் இனிய தொடக்கம்
          </span>

          <h2>
            அன்பும் அறனும் உடைத்தாயின் இல்வாழ்க்கை<br />
            பண்பும் பயனும் அது.
          </h2>

          <div className="tamil-rule">
            <span />
            <Heart fill="currentColor" />
            <span />
          </div>

          <p>
            அன்பால் இணையும் இரு இதயங்கள்,<br />
            அறத்தால் மலரும் ஓர் அழகிய இல்லறம்.
          </p>

          <b>— திருவள்ளுவர் · திருக்குறள் 45</b>

          <small>
            செல்வம் ♡ ராஜ பிரபா · 25 · 10 · 2026
          </small>
        </div>
      </section>
      </>}
    </main>
  );
}
