import { useEffect, useRef, useState, useCallback } from "react";
import deepika1 from "@/assets/deepika-1.png";
import deepika2 from "@/assets/deepika-2.png";
import deepika3 from "@/assets/deepika-3.png";
import { Volume2, VolumeX } from "lucide-react";

const useFadeIn = () => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return ref;
};

const GoldDivider = () => (
  <div className="w-24 h-px bg-primary mx-auto my-8 opacity-60" />
);

// Ambient golden music using Web Audio API
const useAmbientMusic = () => {
  const ctxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<OscillatorNode[]>([]);
  const gainRef = useRef<GainNode | null>(null);
  const [playing, setPlaying] = useState(false);

  const start = useCallback(() => {
    if (ctxRef.current) return;
    const ctx = new AudioContext();
    ctxRef.current = ctx;
    const master = ctx.createGain();
    master.gain.value = 0;
    master.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 2);
    master.connect(ctx.destination);
    gainRef.current = master;

    // Warm ambient chord: D major with extensions (293.66, 369.99, 440, 554.37)
    const freqs = [146.83, 185.0, 220.0, 277.18, 293.66, 369.99];
    freqs.forEach((f) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = f;

      const g = ctx.createGain();
      g.gain.value = 0.015;
      
      // Subtle LFO for warmth
      const lfo = ctx.createOscillator();
      lfo.type = "sine";
      lfo.frequency.value = 0.2 + Math.random() * 0.3;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.005;
      lfo.connect(lfoGain);
      lfoGain.connect(g.gain);
      lfo.start();

      osc.connect(g);
      g.connect(master);
      osc.start();
      nodesRef.current.push(osc, lfo);
    });

    setPlaying(true);
  }, []);

  const stop = useCallback(() => {
    if (gainRef.current && ctxRef.current) {
      gainRef.current.gain.linearRampToValueAtTime(0, ctxRef.current.currentTime + 1);
      setTimeout(() => {
        nodesRef.current.forEach((n) => { try { n.stop(); } catch {} });
        nodesRef.current = [];
        ctxRef.current?.close();
        ctxRef.current = null;
        gainRef.current = null;
      }, 1200);
    }
    setPlaying(false);
  }, []);

  const toggle = useCallback(() => {
    playing ? stop() : start();
  }, [playing, start, stop]);

  useEffect(() => {
    return () => { if (ctxRef.current) { nodesRef.current.forEach(n => { try { n.stop(); } catch {} }); ctxRef.current.close(); } };
  }, []);

  return { playing, toggle };
};

const galleryItems = [
  {
    src: deepika1,
    quote: "In a simple moment, you became something meaningful.",
    text: "There are people who enter your life without warning — and quietly change everything. You didn't ask for attention, yet you became the center of mine.",
  },
  {
    src: deepika2,
    quote: "Some feelings grow quietly but deeply.",
    text: "Seven months of watching you from a respectful distance. Seven months of your smile becoming my favourite part of the day. Quietly. Deeply.",
  },
  {
    src: deepika3,
    quote: "You are calm, yet powerful.",
    text: "Your grace, your composure, your silent strength — they speak louder than words ever could. You don't try to impress, and that's what makes you unforgettable.",
  },
];

const promises = [
  "I promise to respect you.",
  "I promise to communicate honestly.",
  "I promise to grow with you.",
  "I promise to never treat your feelings lightly.",
];

const Index = () => {
  const galleryRef = useFadeIn();
  const letterRef = useFadeIn();
  const promisesRef = useFadeIn();
  const finalRef = useFadeIn();
  const { playing, toggle } = useAmbientMusic();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Floating Music Button */}
      <button
        onClick={toggle}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full border border-primary bg-background/80 backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:bg-primary hover:text-primary-foreground shadow-lg"
        aria-label={playing ? "Mute music" : "Play music"}
      >
        {playing ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
      </button>

      {/* Hero */}
      <section
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
        style={{ background: "linear-gradient(180deg, hsl(30,33%,94%) 0%, hsl(25,30%,92%) 100%)" }}
      >
        {Array.from({ length: 12 }).map((_, i) => (
          <span
            key={i}
            className="gold-particle"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${5 + Math.random() * 4}s`,
              width: `${3 + Math.random() * 3}px`,
              height: `${3 + Math.random() * 3}px`,
            }}
          />
        ))}
        <div className="animate-fade-in text-center px-6 z-10">
          <h1 className="text-6xl md:text-8xl font-semibold tracking-tight mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
            Deepika
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground italic" style={{ fontFamily: "'Playfair Display', serif" }}>
            Seven months of quiet admiration.
          </p>
          <p className="mt-8 text-sm text-muted-foreground/60 animate-pulse">
            ↓ Scroll to begin
          </p>
        </div>
      </section>

      {/* Gallery — side-by-side layout */}
      <section ref={galleryRef} className="fade-in-section py-24 px-6">
        <div className="max-w-6xl mx-auto space-y-24">
          {galleryItems.map((item, i) => (
            <div
              key={i}
              className={`flex flex-col ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} items-center gap-10 md:gap-16`}
            >
              {/* Image */}
              <div className="w-full md:w-1/2 group">
                <div className="overflow-hidden rounded-2xl shadow-lg transition-shadow duration-500 group-hover:shadow-[0_0_30px_hsl(40,45%,57%,0.25)]">
                  <img
                    src={item.src}
                    alt={`Photo of Deepika ${i + 1}`}
                    className="w-full aspect-[3/4] object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="w-full md:w-1/2 text-center md:text-left space-y-6">
                <div className="w-16 h-px bg-primary opacity-50 mx-auto md:mx-0" />
                <p className="text-2xl md:text-3xl leading-snug font-medium italic" style={{ fontFamily: "'Playfair Display', serif" }}>
                  "{item.quote}"
                </p>
                <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
                  {item.text}
                </p>
                <div className="w-16 h-px bg-primary opacity-50 mx-auto md:mx-0" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Letter */}
      <section ref={letterRef} className="fade-in-section py-24 px-6" style={{ background: "linear-gradient(180deg, transparent, hsl(20,30%,90%,0.3), transparent)" }}>
        <div className="max-w-[700px] mx-auto">
          <h2 className="text-3xl md:text-4xl text-center font-semibold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            A Letter For You
          </h2>
          <GoldDivider />
          <div className="space-y-5 text-base md:text-lg leading-relaxed text-foreground/90">
            <p>Deepika,</p>
            <p>It has been seven months since you quietly became a part of my everyday thoughts.</p>
            <p>There was no big dramatic moment.<br />No loud confession.<br />Just a slow, steady realization that my heart feels different when it comes to you.</p>
            <p>I still remember that one minute we met.<br />It wasn't long.<br />But something about it stayed with me.</p>
            <p>In these months, I didn't just admire you —<br />I respected you.<br />Your calm nature.<br />Your strength.<br />The way you carry yourself.</p>
            <p>You may not know this, but you became a motivation for me.<br />To improve.<br />To grow.<br />To become more patient and more intentional.</p>
            <p>This is not an impulsive feeling.<br />It is not excitement.<br />It is not fantasy.</p>
            <p>It is steady.<br />It is thoughtful.<br />It is sincere.</p>
            <p>I don't promise perfection.<br />I don't promise a fairytale.</p>
            <p>But I promise honesty.<br />I promise effort.<br />I promise respect.<br />And I promise that my feelings come from a place of clarity, not confusion.</p>
            <p>If you ever allow me to walk beside you —<br />I will walk with purpose.</p>
            <p>Not to rush anything.<br />Not to pressure you.<br />But to build something real.</p>
            <p>Deepika,<br />I admire you deeply.<br />And I value you more than you know.</p>
            <p className="text-right italic">— With sincerity</p>
          </div>
          <GoldDivider />
        </div>
      </section>

      {/* Promises */}
      <section ref={promisesRef} className="fade-in-section py-24 px-6">
        <div className="max-w-lg mx-auto space-y-0">
          {promises.map((p, i) => (
            <div key={i}>
              <p className="text-center text-lg md:text-xl py-6 italic" style={{ fontFamily: "'Playfair Display', serif" }}>
                {p}
              </p>
              {i < promises.length - 1 && <GoldDivider />}
            </div>
          ))}
        </div>
      </section>

      {/* Final */}
      <section ref={finalRef} className="fade-in-section py-28 px-6 text-center">
        <p className="text-xl md:text-2xl leading-relaxed max-w-lg mx-auto mb-12 italic" style={{ fontFamily: "'Playfair Display', serif" }}>
          Deepika,<br />
          If someday our paths align,<br />
          I would be grateful to walk beside you.
        </p>
        <button className="px-10 py-3 rounded-full border border-primary bg-transparent text-primary font-medium transition-all duration-300 hover:bg-primary hover:text-primary-foreground tracking-wide">
          Thank you for reading
        </button>
      </section>

      <div className="h-16" />
    </div>
  );
};

export default Index;
