import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion } from "motion/react";
import { HeroSection } from "./components/hero/HeroSection";
import { ArrowRight, Gauge, Zap, Wind, RotateCw, Play, Search, Sun, Moon, Lightbulb, Minus, Plus, Menu, X } from "lucide-react";
import { gallery, heroCampaigns, hotspots, vehicles, viewerAngles } from "./data/vehicles";

// ── HOOKS ─────────────────────────────────────────────────────────────────────

function useCountUp(target: number, duration: number, triggered: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!triggered) return;
    let current = 0;
    const step = target / (duration / 16);
    const id = setInterval(() => {
      current += step;
      if (current >= target) { setCount(target); clearInterval(id); }
      else setCount(Math.floor(current));
    }, 16);
    return () => clearInterval(id);
  }, [target, duration, triggered]);
  return count;
}

function useInView(threshold = 0.3) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function usePrefersReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  return reducedMotion;
}

// ── COMPONENT ─────────────────────────────────────────────────────────────────

export default function App() {
  const [activeModel, setActiveModel] = useState(0);
  const [viewerAngle, setViewerAngle] = useState(2);
  const [viewerKey, setViewerKey] = useState(0);
  const [navScrolled, setNavScrolled] = useState(false);
  const [heroMouse, setHeroMouse] = useState({ x: 0.5, y: 0.5 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [baseAngle, setBaseAngle] = useState(2);
  const [heroCampaign, setHeroCampaign] = useState(0);
  const [lastInteraction, setLastInteraction] = useState(Date.now());
  const [isIdle, setIsIdle] = useState(false);
  const [highlightStat, setHighlightStat] = useState(0);
  const [viewerZoom, setViewerZoom] = useState(1);
  const [viewerLighting, setViewerLighting] = useState(true);
  const [viewerEnvironment, setViewerEnvironment] = useState<"day" | "night">("night");
  const [activeHotspot, setActiveHotspot] = useState(hotspots[0].id);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  const heroRef = useRef<HTMLDivElement>(null);
  const { ref: statsRef, inView: statsInView } = useInView(0.3);

  const hp = useCountUp(1200, 2000, statsInView);
  const topSpeed = useCountUp(250, 1800, statsInView);
  const torque = useCountUp(1100, 2200, statsInView);

  useEffect(() => {
    const fn = () => setNavScrolled(window.scrollY > 80);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const markInteraction = () => {
      setLastInteraction(Date.now());
      setIsIdle(false);
    };
    window.addEventListener("pointerdown", markInteraction);
    window.addEventListener("keydown", markInteraction);
    window.addEventListener("wheel", markInteraction, { passive: true });
    window.addEventListener("touchstart", markInteraction, { passive: true });
    return () => {
      window.removeEventListener("pointerdown", markInteraction);
      window.removeEventListener("keydown", markInteraction);
      window.removeEventListener("wheel", markInteraction);
      window.removeEventListener("touchstart", markInteraction);
    };
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIsIdle(Date.now() - lastInteraction > 6500);
    }, 1000);
    return () => window.clearInterval(id);
  }, [lastInteraction]);

  useEffect(() => {
    if (reducedMotion) return;
    const id = window.setInterval(() => {
      setHeroCampaign(i => (i + 1) % heroCampaigns.length);
      setHighlightStat(i => (i + 1) % heroCampaigns[heroCampaign].stats.length);
      if (isIdle) {
        setViewerAngle(i => (i + 1) % viewerAngles.length);
        setViewerKey(k => k + 1);
      }
    }, isIdle ? 4200 : 7800);
    return () => window.clearInterval(id);
  }, [heroCampaign, isIdle, reducedMotion]);

  const handleHeroMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion) return;
    const rect = heroRef.current?.getBoundingClientRect();
    if (!rect) return;
    setHeroMouse({ x: (e.clientX - rect.left) / rect.width, y: (e.clientY - rect.top) / rect.height });
  }, [reducedMotion]);

  const markUserInteraction = () => {
    setLastInteraction(Date.now());
    setIsIdle(false);
  };

  const selectHeroCampaign = (index: number) => {
    markUserInteraction();
    setHeroCampaign(index);
  };

  const changeAngle = (i: number) => {
    markUserInteraction();
    setViewerAngle(i);
    setViewerKey(k => k + 1);
    setBaseAngle(i);
  };

  const onDragStart = (clientX: number) => { markUserInteraction(); setIsDragging(true); setDragStartX(clientX); };
  const onDragMove = useCallback((clientX: number) => {
    if (!isDragging) return;
    const step = Math.round((clientX - dragStartX) / 100);
    const next = Math.max(0, Math.min(viewerAngles.length - 1, baseAngle - step));
    if (next !== viewerAngle) { setViewerAngle(next); setViewerKey(k => k + 1); }
  }, [isDragging, dragStartX, baseAngle, viewerAngle]);
  const onDragEnd = () => { if (isDragging) { setBaseAngle(viewerAngle); setIsDragging(false); } };

  const model = vehicles[activeModel];
  const campaign = heroCampaigns[heroCampaign];
  const currentCamera = viewerAngles[viewerAngle].label;
  const visibleHotspots = useMemo(() => hotspots
    .map(hotspot => ({ hotspot, position: hotspot.cameras[currentCamera] }))
    .filter((item): item is { hotspot: typeof hotspots[number]; position: { x: number; y: number } } => Boolean(item.position)), [currentCamera]);
  const activeHotspotData = hotspots.find(h => h.id === activeHotspot) ?? visibleHotspots[0]?.hotspot ?? hotspots[0];

  useEffect(() => {
    if (visibleHotspots.length > 0 && !visibleHotspots.some(({ hotspot }) => hotspot.id === activeHotspot)) {
      setActiveHotspot(visibleHotspots[0].hotspot.id);
    }
  }, [activeHotspot, visibleHotspots]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Inter:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
        @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes fadeRotIn { from{opacity:0;transform:perspective(900px) rotateY(-14deg) scale(0.96)} to{opacity:1;transform:perspective(900px) rotateY(0deg) scale(1)} }
        @keyframes pulseGlow { 0%,100%{box-shadow:0 0 20px rgba(201,168,76,.25)} 50%{box-shadow:0 0 50px rgba(201,168,76,.55),0 0 90px rgba(201,168,76,.15)} }
        @keyframes speedLine { 0%{transform:translateX(-100%);opacity:0} 50%{opacity:1} 100%{transform:translateX(110vw);opacity:0} }
        @keyframes floatY { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes revealUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        @keyframes particleDrift { from{transform:translate3d(0,20px,0);opacity:.05} 50%{opacity:.38} to{transform:translate3d(42px,-90px,0);opacity:0} }
        @keyframes lensSweep { 0%{transform:translateX(-35vw) rotate(-12deg);opacity:0} 30%{opacity:.55} 100%{transform:translateX(120vw) rotate(-12deg);opacity:0} }
        @keyframes hotspotPulse { 0%,100%{transform:scale(1);box-shadow:0 0 0 0 rgba(201,168,76,.38)} 50%{transform:scale(1.15);box-shadow:0 0 0 12px rgba(201,168,76,0)} }
        .gold-shimmer { background:linear-gradient(90deg,#c9a84c 0%,#f5d880 45%,#c9a84c 100%); background-size:200% auto; -webkit-background-clip:text; -webkit-text-fill-color:transparent; animation:shimmer 4s linear infinite; }
        .car-anim { animation:fadeRotIn .55s cubic-bezier(.16,1,.3,1) forwards; }
        .pulse-cta { animation:pulseGlow 2.5s ease-in-out infinite; }
        .speed-stripe { position:absolute; height:1px; animation:speedLine linear infinite; pointer-events:none; }
        .float-img { animation:floatY 5s ease-in-out infinite; }
        .particle { animation:particleDrift 7s linear infinite; }
        .lens-sweep { animation:lensSweep 6s ease-in-out infinite; }
        .hotspot-dot { animation:hotspotPulse 2.4s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .gold-shimmer,.pulse-cta,.speed-stripe,.float-img,.particle,.lens-sweep,.hotspot-dot,.car-anim { animation:none!important; } *,*::before,*::after{scroll-behavior:auto!important;transition-duration:.01ms!important;animation-duration:.01ms!important;animation-iteration-count:1!important;} }
        html { scroll-behavior:smooth; }
        ::-webkit-scrollbar { width:3px; }
        ::-webkit-scrollbar-track { background:#050508; }
        ::-webkit-scrollbar-thumb { background:rgba(201,168,76,.35); }
      `}</style>

      <div style={{ fontFamily: "'Inter', sans-serif", background: "#050508", color: "#f0ead8", overflowX: "hidden" }}>

        {/* ── NAV ── */}
        <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
          style={{ background: navScrolled ? "rgba(5,5,8,.88)" : "transparent", backdropFilter: navScrolled ? "blur(20px)" : "none", borderBottom: navScrolled ? "1px solid rgba(201,168,76,.1)" : "none" }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-14 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 flex items-center justify-center" style={{ background: "linear-gradient(135deg,#c9a84c,#f5d880)" }}>
                <span style={{ fontFamily: "'Playfair Display',serif", color: "#050508", fontWeight: 900, fontSize: 13 }}>V</span>
              </div>
              <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 17, fontWeight: 700, letterSpacing: "0.18em", color: "#f0ead8" }}>VELORUM</span>
            </div>
            <div className="hidden md:flex items-center gap-10">
              {["Models", "Experience", "Gallery", "Test Drive"].map(l => (
                <a key={l} href={`#${l.toLowerCase().replace(" ", "-")}`}
                  className="text-xs tracking-widest uppercase transition-colors duration-200"
                  style={{ color: "rgba(240,234,216,.55)", fontWeight: 500 }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#c9a84c")}
                  onMouseLeave={e => (e.currentTarget.style.color = "rgba(240,234,216,.55)")}>
                  {l}
                </a>
              ))}
            </div>
            <button className="hidden md:flex items-center gap-2 px-5 py-2.5 text-xs tracking-widest uppercase transition-all duration-300"
              style={{ border: "1px solid rgba(201,168,76,.35)", color: "#c9a84c" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#c9a84c"; e.currentTarget.style.color = "#050508"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#c9a84c"; }}>
              Book Viewing
            </button>
            <button type="button" className="md:hidden flex items-center justify-center w-11 h-11 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2" aria-label={mobileNavOpen ? "Close navigation" : "Open navigation"} aria-expanded={mobileNavOpen} aria-controls="mobile-navigation" onClick={() => setMobileNavOpen(open => !open)}
              style={{ border: "1px solid rgba(201,168,76,.26)", color: "#c9a84c", outlineColor: "#c9a84c" }}>
              {mobileNavOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
          <div id="mobile-navigation" className={`md:hidden overflow-hidden transition-all duration-300 ${mobileNavOpen ? "max-h-96 border-t" : "max-h-0"}`} style={{ borderColor: "rgba(201,168,76,.1)", background: "rgba(5,5,8,.96)", backdropFilter: "blur(20px)" }}>
            <div className="px-6 py-5 flex flex-col gap-1">
              {["Models", "Experience", "Gallery", "Test Drive"].map(l => (
                <a key={l} href={`#${l.toLowerCase().replace(" ", "-")}`} onClick={() => setMobileNavOpen(false)} className="py-4 text-xs tracking-widest uppercase focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2" style={{ color: "rgba(240,234,216,.7)", fontFamily: "'DM Mono',monospace", outlineColor: "#c9a84c" }}>{l}</a>
              ))}
              <a href="#test-drive" onClick={() => setMobileNavOpen(false)} className="mt-3 px-5 py-4 text-center text-xs tracking-widest uppercase font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2" style={{ background: "#c9a84c", color: "#050508", outlineColor: "#f0ead8" }}>Book Viewing</a>
            </div>
          </div>
        </nav>

        <HeroSection
          heroRef={heroRef}
          heroMouse={heroMouse}
          campaign={campaign}
          campaigns={heroCampaigns}
          activeCampaign={heroCampaign}
          isIdle={isIdle}
          highlightStat={highlightStat}
          reducedMotion={reducedMotion}
          onMouseMove={handleHeroMouseMove}
          onSelectCampaign={selectHeroCampaign}
        />

        {/* ── MODELS ── */}
        <section id="models" className="py-28" style={{ background: "#07070f" }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-14">
            <motion.div initial={reducedMotion ? false : { opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: reducedMotion ? 0 : .45 }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-10" style={{ background: "#c9a84c" }} />
                <span className="text-xs tracking-widest uppercase" style={{ color: "#c9a84c", fontFamily: "'DM Mono',monospace" }}>2025 Lineup</span>
              </div>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(36px,5vw,64px)", fontWeight: 700 }}>
                Choose Your Legend
              </h2>
            </motion.div>

            {/* Tabs */}
            <div className="flex gap-0 mt-10 border-b" style={{ borderColor: "rgba(201,168,76,.1)" }}>
              {vehicles.map((m, i) => (
                <button key={m.id} onClick={() => setActiveModel(i)}
                  className="px-5 py-4 text-xs tracking-widest uppercase transition-all duration-300 whitespace-nowrap"
                  style={{
                    fontFamily: "'Inter',sans-serif",
                    color: activeModel === i ? "#c9a84c" : "rgba(240,234,216,.35)",
                    borderBottom: activeModel === i ? "2px solid #c9a84c" : "2px solid transparent",
                    marginBottom: -1,
                    fontWeight: activeModel === i ? 600 : 400,
                  }}>
                  {m.name}
                </button>
              ))}
            </div>

            {/* Model display */}
            <div className="grid lg:grid-cols-2" style={{ minHeight: 500 }}>
              {/* Image */}
              <div className="relative overflow-hidden" style={{ background: "rgba(13,13,20,.8)" }}>
                <img key={activeModel} src={model.image} alt={model.name} loading="lazy" decoding="async" width="1400" height="800"
                  className="w-full h-full object-cover car-anim"
                  style={{ minHeight: 400 }} />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to right,transparent 55%,rgba(7,7,15,.92) 100%)" }} />
                <div className="absolute bottom-6 left-6 flex items-center gap-2">
                  <div className="w-3 h-3" style={{ background: model.accent, boxShadow: `0 0 8px ${model.accent}` }} />
                  <span className="text-xs tracking-widest uppercase" style={{ color: "rgba(240,234,216,.5)", fontFamily: "'DM Mono',monospace" }}>{model.colorName}</span>
                </div>
              </div>

              {/* Specs */}
              <div className="p-10 flex flex-col justify-between"
                style={{ background: "rgba(13,13,20,.97)", borderLeft: "1px solid rgba(201,168,76,.07)" }}>
                <div>
                  <span className="text-xs tracking-widest uppercase" style={{ color: "rgba(240,234,216,.28)", fontFamily: "'DM Mono',monospace" }}>
                    Model {String(activeModel + 1).padStart(2, "0")}
                  </span>
                  <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 38, fontWeight: 700, marginTop: 8 }}>{model.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "rgba(240,234,216,.45)" }}>{model.tagline}</p>

                  {/* Stats grid */}
                  <div className="mt-8 grid grid-cols-2 gap-px" style={{ background: "rgba(201,168,76,.07)" }}>
                    {[
                      { label: "Horsepower", value: model.hp, unit: "HP" },
                      { label: "0 to 60", value: model.zeroToSixty, unit: "sec" },
                      { label: "Top Speed", value: model.topSpeed, unit: "mph" },
                      { label: "Torque", value: model.torque, unit: "lb-ft" },
                    ].map(s => (
                      <div key={s.label} className="p-4" style={{ background: "rgba(5,5,8,.95)" }}>
                        <div className="text-xs tracking-wider uppercase mb-1" style={{ color: "rgba(240,234,216,.28)", fontFamily: "'DM Mono',monospace" }}>{s.label}</div>
                        <div className="flex items-baseline gap-1">
                          <span style={{ fontSize: 30, fontWeight: 700, color: "#c9a84c", fontFamily: "'DM Mono',monospace", lineHeight: 1 }}>{s.value}</span>
                          <span className="text-xs" style={{ color: "rgba(240,234,216,.35)", fontFamily: "'DM Mono',monospace" }}>{s.unit}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {model.features.map(f => (
                      <span key={f} className="px-3 py-1 text-xs tracking-wider"
                        style={{ border: "1px solid rgba(201,168,76,.18)", color: "rgba(240,234,216,.45)", fontFamily: "'DM Mono',monospace" }}>
                        {f}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between">
                  <div>
                    <div className="text-xs tracking-widest uppercase mb-1" style={{ color: "rgba(240,234,216,.28)", fontFamily: "'DM Mono',monospace" }}>Showroom status</div>
                    <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 600 }}>{model.viewingStatus}</div>
                  </div>
                  <button className="flex items-center gap-2 px-6 py-3 text-xs tracking-widest uppercase transition-all duration-300"
                    style={{ border: "1px solid rgba(201,168,76,.35)", color: "#c9a84c" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#c9a84c"; e.currentTarget.style.color = "#050508"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#c9a84c"; }}>
                    View Details <ArrowRight size={11} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 360° VIEWER ── */}
        <section id="experience" className="py-28 relative overflow-hidden" style={{ background: "#050508" }}>
          <div className="absolute inset-0 pointer-events-none" style={{
            background: "radial-gradient(ellipse 80% 60% at 50% 50%,rgba(201,168,76,.04),transparent)",
          }} />

          <div className="max-w-7xl mx-auto px-6 lg:px-14">
            <motion.div initial={reducedMotion ? false : { opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: reducedMotion ? 0 : .45 }}
              className="text-center mb-16">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="h-px w-10" style={{ background: "#c9a84c" }} />
                <span className="text-xs tracking-widest uppercase" style={{ color: "#c9a84c", fontFamily: "'DM Mono',monospace" }}>360° Studio</span>
                <div className="h-px w-10" style={{ background: "#c9a84c" }} />
              </div>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(32px,4.5vw,58px)", fontWeight: 700 }}>
                Every Angle. Every Detail.
              </h2>
              <p className="mt-4 max-w-lg mx-auto text-sm leading-relaxed" style={{ color: "rgba(240,234,216,.4)" }}>
                Explore the APEX Shadow from every perspective. Drag left and right or tap an angle to rotate the vehicle.
              </p>
            </motion.div>

            {/* Viewer stage */}
            <div className="relative select-none"
              style={{ cursor: isDragging ? "grabbing" : "grab" }}
              onMouseDown={e => onDragStart(e.clientX)}
              onMouseMove={e => onDragMove(e.clientX)}
              onMouseUp={onDragEnd}
              onMouseLeave={onDragEnd}
              onTouchStart={e => onDragStart(e.touches[0].clientX)}
              onTouchMove={e => onDragMove(e.touches[0].clientX)}
              onTouchEnd={onDragEnd}>

              <div style={{ perspective: "1400px" }}>
                <img key={viewerKey}
                  src={viewerAngles[viewerAngle].image}
                  alt={`Car ${viewerAngles[viewerAngle].label} view`}
                  width="1300" height="700" decoding="async"
                  className="w-full object-cover car-anim"
                  style={{ height: "clamp(300px,50vh,540px)", display: "block", border: "1px solid rgba(201,168,76,.09)", transform: `scale(${viewerZoom})`, filter: `${viewerEnvironment === "night" ? "brightness(.72) contrast(1.12)" : "brightness(1.05) contrast(1.04)"} ${viewerLighting ? "drop-shadow(0 0 28px rgba(201,168,76,.22))" : ""}`, transition: "transform .45s ease, filter .45s ease" }}
                  draggable={false} />
              </div>

              {/* Overlays */}
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: "linear-gradient(to top,rgba(5,5,8,1) 0%,transparent 30%,transparent 72%,rgba(5,5,8,.25) 100%)" }} />

              <div className="absolute inset-0 pointer-events-none">
                {visibleHotspots.map(({ hotspot, position }) => (
                  <button key={hotspot.id} type="button" onClick={() => { markUserInteraction(); setActiveHotspot(hotspot.id); }} className="hotspot-dot absolute pointer-events-auto flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full transition-transform duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4" aria-label={`Inspect ${hotspot.title}`} aria-pressed={activeHotspot === hotspot.id}
                    style={{ left: `${position.x}%`, top: `${position.y}%`, background: "rgba(5,5,8,.42)", border: activeHotspot === hotspot.id ? "1px solid rgba(245,216,128,.95)" : "1px solid rgba(240,234,216,.45)", outlineColor: "#c9a84c" }}>
                    <span className="flex h-5 w-5 items-center justify-center rounded-full" style={{ background: activeHotspot === hotspot.id ? "#c9a84c" : "rgba(201,168,76,.72)" }}><span className="h-1.5 w-1.5 rounded-full" style={{ background: "#050508" }} /></span>
                  </button>
                ))}
              </div>

              <div className="hidden sm:block absolute top-5 right-5 px-4 py-2 text-xs tracking-widest uppercase"
                style={{ background: "rgba(5,5,8,.8)", border: "1px solid rgba(201,168,76,.12)", backdropFilter: "blur(8px)", color: "rgba(240,234,216,.35)", fontFamily: "'DM Mono',monospace" }}>
                ← drag to rotate →
              </div>

              <div className="absolute top-4 left-4 right-4 sm:right-auto sm:top-5 sm:left-5 flex flex-row sm:flex-col gap-2 pointer-events-auto">
                <div className="flex items-center gap-2 p-2" style={{ background: "rgba(5,5,8,.74)", border: "1px solid rgba(201,168,76,.12)", backdropFilter: "blur(12px)" }}>
                  <button type="button" aria-label="Zoom out" onClick={() => { markUserInteraction(); setViewerZoom(z => Math.max(1, +(z - .08).toFixed(2))); }} className="p-2 transition-colors" style={{ color: "rgba(240,234,216,.55)" }}><Minus size={14} /></button>
                  <span className="text-[10px] tracking-widest uppercase min-w-12 text-center" style={{ color: "rgba(201,168,76,.75)", fontFamily: "'DM Mono',monospace" }}>{Math.round(viewerZoom * 100)}%</span>
                  <button type="button" aria-label="Zoom in" onClick={() => { markUserInteraction(); setViewerZoom(z => Math.min(1.24, +(z + .08).toFixed(2))); }} className="p-2 transition-colors" style={{ color: "rgba(240,234,216,.55)" }}><Plus size={14} /></button>
                </div>
                <div className="flex flex-wrap gap-2 max-w-xs">
                  <button type="button" aria-pressed={viewerLighting} onClick={() => { markUserInteraction(); setViewerLighting(v => !v); }} className="flex items-center gap-2 px-3 py-2 text-[10px] tracking-widest uppercase" style={{ background: viewerLighting ? "rgba(201,168,76,.12)" : "rgba(5,5,8,.7)", border: "1px solid rgba(201,168,76,.16)", color: viewerLighting ? "#c9a84c" : "rgba(240,234,216,.42)", fontFamily: "'DM Mono',monospace", backdropFilter: "blur(12px)" }}><Lightbulb size={12} /> Lights</button>
                  <button type="button" aria-pressed={viewerEnvironment === "night"} onClick={() => { markUserInteraction(); setViewerEnvironment(v => v === "night" ? "day" : "night"); }} className="flex items-center gap-2 px-3 py-2 text-[10px] tracking-widest uppercase" style={{ background: "rgba(5,5,8,.7)", border: "1px solid rgba(201,168,76,.16)", color: "rgba(240,234,216,.5)", fontFamily: "'DM Mono',monospace", backdropFilter: "blur(12px)" }}>{viewerEnvironment === "night" ? <Moon size={12} /> : <Sun size={12} />} {viewerEnvironment}</button>
                </div>
              </div>

              {/* Angle controls */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-5 pointer-events-none">
                <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: "rgba(240,234,216,.4)", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                  {viewerAngles[viewerAngle].label} View
                </span>
                <div className="flex items-center gap-2 pointer-events-auto">
                  {viewerAngles.map((_, i) => (
                    <button key={i} type="button" aria-label={`Switch to ${viewerAngles[i].label} view`} aria-pressed={viewerAngle === i} onClick={() => changeAngle(i)} className="flex items-center justify-center transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
                      style={{ width: viewerAngle === i ? 28 : 8, height: 8, background: viewerAngle === i ? "#c9a84c" : "rgba(240,234,216,.18)", transition: "all .3s ease" }} />
                  ))}
                </div>
                <div className="flex items-center gap-6 pointer-events-auto">
                  {viewerAngles.map((a, i) => (
                    <button key={i} type="button" aria-pressed={viewerAngle === i} onClick={() => changeAngle(i)}
                      className="text-xs tracking-wider uppercase transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
                      style={{ fontFamily: "'DM Mono',monospace", color: viewerAngle === i ? "#c9a84c" : "rgba(240,234,216,.2)", fontWeight: viewerAngle === i ? 500 : 400 }}>
                      {a.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-6 flex justify-center">
              <div className="relative h-0.5 w-60" style={{ background: "rgba(201,168,76,.1)" }}>
                <div className="absolute top-0 left-0 h-full transition-all duration-300"
                  style={{ width: `${(viewerAngle / (viewerAngles.length - 1)) * 100}%`, background: "linear-gradient(to right,rgba(201,168,76,.3),#c9a84c)" }} />
                <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 -translate-x-1/2 transition-all duration-300"
                  style={{ left: `${(viewerAngle / (viewerAngles.length - 1)) * 100}%`, background: "#c9a84c", boxShadow: "0 0 10px rgba(201,168,76,.8)" }} />
              </div>
            </div>

            {/* Hotspot callouts */}
            <div className="mt-14 grid lg:grid-cols-[.9fr_1.1fr] gap-px" style={{ background: "rgba(201,168,76,.06)" }}>
              <motion.div key={activeHotspotData.id} initial={reducedMotion ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reducedMotion ? 0 : .3 }} className="p-7" aria-live="polite" style={{ background: "linear-gradient(135deg,rgba(13,13,20,.98),rgba(5,5,8,.98))" }}>
                <div className="flex items-center gap-3 mb-4">
                  <Search size={15} style={{ color: "#c9a84c" }} />
                  <span className="text-xs tracking-widest uppercase" style={{ color: "#c9a84c", fontFamily: "'DM Mono',monospace" }}>Active inspection</span>
                </div>
                <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 30, fontWeight: 700 }}>{activeHotspotData.title}</h3>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: "rgba(240,234,216,.45)" }}>{activeHotspotData.desc}</p>
              </motion.div>
              <div className="grid sm:grid-cols-2">
                {visibleHotspots.map(({ hotspot }) => (
                  <button key={hotspot.id} type="button" onClick={() => { markUserInteraction(); setActiveHotspot(hotspot.id); }} aria-pressed={activeHotspot === hotspot.id} className="p-5 text-left group transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px]"
                    style={{ background: activeHotspot === hotspot.id ? "rgba(201,168,76,.08)" : "rgba(5,5,8,.97)", border: "1px solid rgba(201,168,76,.035)", outlineColor: "#c9a84c" }}>
                    <div className="h-px mb-4 transition-all duration-500" style={{ width: activeHotspot === hotspot.id ? "100%" : "0%", background: "#c9a84c" }} />
                    <div className="text-sm font-medium mb-2" style={{ color: activeHotspot === hotspot.id ? "#c9a84c" : "#f0ead8", fontFamily: "'Inter',sans-serif" }}>{hotspot.title}</div>
                    <div className="text-xs leading-relaxed" style={{ color: "rgba(240,234,216,.36)", fontFamily: "'Inter',sans-serif" }}>{hotspot.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── PERFORMANCE STATS ── */}
        <section ref={statsRef} className="py-28 relative" style={{ background: "#07070f" }}>
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
            backgroundImage: "repeating-linear-gradient(0deg,rgba(201,168,76,1) 0,rgba(201,168,76,1) 1px,transparent 1px,transparent 64px),repeating-linear-gradient(90deg,rgba(201,168,76,1) 0,rgba(201,168,76,1) 1px,transparent 1px,transparent 64px)",
          }} />

          <div className="relative max-w-7xl mx-auto px-6 lg:px-14">
            <motion.div initial={reducedMotion ? false : { opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: reducedMotion ? 0 : .45 }} className="text-center mb-16">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="h-px w-10" style={{ background: "#c9a84c" }} />
                <span className="text-xs tracking-widest uppercase" style={{ color: "#c9a84c", fontFamily: "'DM Mono',monospace" }}>Engineering</span>
                <div className="h-px w-10" style={{ background: "#c9a84c" }} />
              </div>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(32px,4.5vw,58px)", fontWeight: 700 }}>
                Numbers That Shock.
              </h2>
            </motion.div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-px" style={{ background: "rgba(201,168,76,.07)" }}>
              {[
                { label: "Peak Horsepower", display: hp.toLocaleString(), unit: "HP", icon: <Zap size={18} /> },
                { label: "0 to 60 mph", display: "1.9", unit: "sec", icon: <Gauge size={18} /> },
                { label: "Top Speed", display: topSpeed.toLocaleString(), unit: "mph", icon: <Wind size={18} /> },
                { label: "Torque Output", display: torque.toLocaleString(), unit: "lb-ft", icon: <RotateCw size={18} /> },
              ].map((s, i) => (
                <motion.div key={s.label}
                  initial={reducedMotion ? false : { opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: reducedMotion ? 0 : i * .1, duration: reducedMotion ? 0 : .45 }}
                  className="p-8 flex flex-col gap-5 group transition-all duration-300"
                  style={{ background: "rgba(5,5,8,.97)" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(13,13,20,.97)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "rgba(5,5,8,.97)")}>
                  <div style={{ color: "#c9a84c" }}>{s.icon}</div>
                  <div>
                    <div className="flex items-baseline gap-1 leading-none">
                      <span style={{ fontSize: "clamp(40px,5vw,72px)", fontWeight: 700, color: "#f0ead8", fontFamily: "'DM Mono',monospace" }}>{s.display}</span>
                      <span style={{ color: "#c9a84c", fontFamily: "'DM Mono',monospace", fontSize: 15 }}>{s.unit}</span>
                    </div>
                    <div className="mt-3 text-xs tracking-wider uppercase" style={{ color: "rgba(240,234,216,.3)", fontFamily: "'DM Mono',monospace" }}>{s.label}</div>
                  </div>
                  <div className="h-px w-0 group-hover:w-full transition-all duration-500" style={{ background: "#c9a84c" }} />
                </motion.div>
              ))}
            </div>

            <motion.div initial={reducedMotion ? false : { opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: reducedMotion ? 0 : .45, duration: reducedMotion ? 0 : .45 }}
              className="mt-12 flex justify-center">
              <div className="px-8 py-4 flex items-center gap-5"
                style={{ border: "1px solid rgba(201,168,76,.15)", background: "rgba(201,168,76,.02)" }}>
                <div className="w-px h-8" style={{ background: "#c9a84c" }} />
                <p className="text-sm" style={{ color: "rgba(240,234,216,.4)", fontFamily: "'Inter',sans-serif" }}>
                  Nürburgring 2024 — world record holder,{" "}
                  <span style={{ color: "#c9a84c" }}>fastest production electric vehicle</span>
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── gallery ── */}
        <section id="gallery" className="py-28" style={{ background: "#050508" }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-14">
            <motion.div initial={reducedMotion ? false : { opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: reducedMotion ? 0 : .45 }} className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-10" style={{ background: "#c9a84c" }} />
                <span className="text-xs tracking-widest uppercase" style={{ color: "#c9a84c", fontFamily: "'DM Mono',monospace" }}>Visual Poetry</span>
              </div>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(32px,4.5vw,58px)", fontWeight: 700 }}>
                Art in Motion
              </h2>
            </motion.div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2" style={{ gridAutoRows: "220px" }}>
              {gallery.map((item, i) => (
                <motion.div key={item.id}
                  initial={reducedMotion ? false : { opacity: 0, scale: .96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: reducedMotion ? 0 : i * .07, duration: reducedMotion ? 0 : .45 }}
                  className={`relative overflow-hidden group ${item.tall ? "row-span-2" : ""}`}
                  style={{ background: "#0d0d14" }}>
                  <img src={`https://images.unsplash.com/photo-${item.id}?w=800&h=700&fit=crop&auto=format`}
                    alt={item.alt} loading="lazy" decoding="async" width="800" height="700"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                    style={{ transition: "transform .7s ease" }}
                    onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.07)")}
                    onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")} />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                    style={{ background: "linear-gradient(to top,rgba(5,5,8,.65),transparent)", transition: "opacity .4s ease" }} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── DEMO DRIVE ── */}
        <section id="test-drive" className="relative overflow-hidden" style={{ minHeight: "70vh", background: "#050508" }}>
          {/* Speed streaks */}
          {Array.from({ length: 9 }, (_, i) => (
            <div key={i} className="speed-stripe"
              style={{
                top: `${8 + i * 10}%`,
                width: `${80 + i * 40}px`,
                background: `linear-gradient(to right,transparent,rgba(201,168,76,${.06 + i * .025}),transparent)`,
                animationDuration: `${1.4 + i * .25}s`,
                animationDelay: `${i * .18}s`,
              }} />
          ))}

          <div className="absolute inset-0">
            <img src="https://images.unsplash.com/photo-1774874604286-30ee598ae960?w=1800&h=900&fit=crop&auto=format"
              alt="Car in motion" loading="lazy" decoding="async" width="1800" height="900"
              className="w-full h-full object-cover"
              style={{ opacity: .18 }} />
            <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center,rgba(5,5,8,.35),rgba(5,5,8,.96) 75%)" }} />
          </div>

          <div className="relative flex items-center justify-center min-h-[70vh]">
            <div className="text-center max-w-3xl mx-auto px-6">
              <motion.div initial={reducedMotion ? false : { opacity: 0, y: 35 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: reducedMotion ? 0 : .45 }}>
                <div className="flex items-center justify-center gap-4 mb-7">
                  <div className="h-px w-14" style={{ background: "#c41e3a" }} />
                  <span className="text-xs tracking-widest uppercase" style={{ color: "#c41e3a", fontFamily: "'DM Mono',monospace" }}>Limited Availability</span>
                  <div className="h-px w-14" style={{ background: "#c41e3a" }} />
                </div>

                <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(42px,6.5vw,84px)", fontWeight: 900, lineHeight: 1.03 }}>
                  Feel What<br />
                  <em style={{ color: "#c9a84c", fontStyle: "italic" }}>850 HP</em> Feels Like.
                </h2>

                <p className="mt-7 text-base leading-relaxed max-w-xl mx-auto" style={{ color: "rgba(240,234,216,.45)" }}>
                  Schedule your private demonstration at our exclusive proving ground. A Velorum specialist will guide you through every dimension of the machine.
                </p>

                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button className="px-10 py-5 text-xs tracking-widest uppercase font-semibold transition-all duration-300"
                    style={{ background: "#c41e3a", color: "#f0ead8", letterSpacing: "0.18em" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#a01530")}
                    onMouseLeave={e => (e.currentTarget.style.background = "#c41e3a")}>
                    Book Your Experience
                  </button>
                  <button className="flex items-center gap-2 px-10 py-5 text-xs tracking-widest uppercase transition-all duration-300"
                    style={{ border: "1px solid rgba(240,234,216,.18)", color: "rgba(240,234,216,.55)" }}>
                    <Play size={13} /> Watch Film
                  </button>
                </div>

                <p className="mt-7 text-xs" style={{ color: "rgba(240,234,216,.2)", fontFamily: "'DM Mono',monospace" }}>
                  By appointment only · London · Monaco · Dubai · New York
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="py-16 border-t" style={{ background: "#050508", borderColor: "rgba(201,168,76,.09)" }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-14">
            <div className="grid md:grid-cols-4 gap-12 mb-12">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 flex items-center justify-center" style={{ background: "linear-gradient(135deg,#c9a84c,#f5d880)" }}>
                    <span style={{ fontFamily: "'Playfair Display',serif", color: "#050508", fontWeight: 900, fontSize: 13 }}>V</span>
                  </div>
                  <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 17, fontWeight: 700, letterSpacing: "0.18em" }}>VELORUM</span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(240,234,216,.3)" }}>
                  Precision engineering. Uncompromising luxury. The pinnacle of automotive artistry since 1983.
                </p>
              </div>

              {[
                { title: "Models", links: ["VELOX GT-R", "APEX Shadow", "NOVA Coupe", "TITAN Roadster"] },
                { title: "Experience", links: ["Virtual Showroom", "Test Drive", "Configurator", "Heritage"] },
                { title: "Showrooms", links: ["London, Mayfair", "Monaco, Monte Carlo", "Dubai, DIFC", "New York, SoHo"] },
              ].map(col => (
                <div key={col.title}>
                  <h4 className="text-xs tracking-widest uppercase mb-5" style={{ color: "#c9a84c", fontFamily: "'DM Mono',monospace" }}>{col.title}</h4>
                  <ul className="space-y-3">
                    {col.links.map(l => (
                      <li key={l}>
                        <a href="#" className="text-sm transition-colors duration-200"
                          style={{ color: "rgba(240,234,216,.35)", fontFamily: "'Inter',sans-serif" }}
                          onMouseEnter={e => (e.currentTarget.style.color = "#c9a84c")}
                          onMouseLeave={e => (e.currentTarget.style.color = "rgba(240,234,216,.35)")}>
                          {l}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 border-t" style={{ borderColor: "rgba(201,168,76,.07)" }}>
              <p className="text-xs" style={{ color: "rgba(240,234,216,.18)", fontFamily: "'DM Mono',monospace" }}>
                © 2025 Velorum Automobiles S.p.A. All rights reserved.
              </p>
              <div className="flex items-center gap-6">
                {["Privacy", "Terms", "Legal", "Cookies"].map(item => (
                  <a key={item} href="#" className="text-xs transition-colors"
                    style={{ color: "rgba(240,234,216,.18)", fontFamily: "'DM Mono',monospace" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#c9a84c")}
                    onMouseLeave={e => (e.currentTarget.style.color = "rgba(240,234,216,.18)")}>
                    {item}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}
