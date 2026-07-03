import React from "react";
import { motion } from "motion/react";
import { ArrowRight, Play } from "lucide-react";
import type { HeroCampaign } from "../../data/vehicles";

type HeroSectionProps = {
  heroRef: React.RefObject<HTMLDivElement>;
  heroMouse: { x: number; y: number };
  campaign: HeroCampaign;
  campaigns: HeroCampaign[];
  activeCampaign: number;
  isIdle: boolean;
  highlightStat: number;
  reducedMotion: boolean;
  onMouseMove: (event: React.MouseEvent<HTMLDivElement>) => void;
  onSelectCampaign: (index: number) => void;
};

export function HeroSection({
  heroRef,
  heroMouse,
  campaign,
  campaigns,
  activeCampaign,
  isIdle,
  highlightStat,
  reducedMotion,
  onMouseMove,
  onSelectCampaign,
}: HeroSectionProps) {
  return (
    <section ref={heroRef} id="hero" className="relative flex items-center overflow-hidden"
      style={{ minHeight: "100vh", background: "#050508" }}
      onMouseMove={onMouseMove}>

      <div className="absolute inset-0 pointer-events-none" style={{
        background: `radial-gradient(700px circle at ${heroMouse.x * 100}% ${heroMouse.y * 100}%, rgba(201,168,76,.06), transparent 60%)`,
      }} />

      <div className="absolute inset-0">
        <img src={campaign.background}
          alt={`${campaign.time} luxury car campaign`} className="w-full h-full object-cover" width="1800" height="1000" decoding="async"
          style={{ opacity: .22, transform: reducedMotion ? "scale(1.04)" : `translate(${(heroMouse.x - .5) * -20}px,${(heroMouse.y - .5) * -12}px) scale(1.06)`, transition: reducedMotion ? "none" : "transform .4s ease-out" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg,rgba(5,5,8,.96) 0%,rgba(5,5,8,.45) 55%,rgba(5,5,8,.92) 100%)" }} />
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 18 }, (_, i) => (
          <span key={i} className="particle absolute h-1 w-1 rounded-full" style={{ left: `${(i * 17) % 100}%`, top: `${12 + ((i * 23) % 76)}%`, background: i % 3 === 0 ? "rgba(201,168,76,.55)" : "rgba(240,234,216,.28)", animationDelay: `${i * .37}s`, animationDuration: `${5.8 + (i % 5)}s` }} />
        ))}
        <div className="lens-sweep absolute top-[28%] h-px w-[42vw]" style={{ background: "linear-gradient(to right,transparent,rgba(245,216,128,.55),transparent)", boxShadow: "0 0 22px rgba(201,168,76,.35)" }} />
      </div>

      <div className="absolute bottom-24 left-6 lg:left-14 z-10 flex flex-wrap items-center gap-2">
        {campaigns.map((item, i) => (
          <button key={item.id} type="button" onClick={() => onSelectCampaign(i)} aria-label={`Show ${item.time} campaign`} aria-pressed={activeCampaign === i}
            className="px-3 py-2 text-[10px] tracking-widest uppercase transition-all duration-300"
            style={{ fontFamily: "'DM Mono',monospace", border: activeCampaign === i ? "1px solid rgba(201,168,76,.65)" : "1px solid rgba(201,168,76,.16)", color: activeCampaign === i ? "#c9a84c" : "rgba(240,234,216,.38)", background: activeCampaign === i ? "rgba(201,168,76,.08)" : "rgba(5,5,8,.36)", backdropFilter: "blur(10px)" }}>
            {item.time}
          </button>
        ))}
        {isIdle && <span className="px-3 py-2 text-[10px] tracking-widest uppercase" style={{ fontFamily: "'DM Mono',monospace", color: "rgba(201,168,76,.7)", border: "1px solid rgba(201,168,76,.18)", background: "rgba(5,5,8,.45)" }}>Auto showcase</span>}
      </div>

      <div className="absolute top-0 left-0 w-px h-full" style={{ background: "linear-gradient(to bottom,transparent,rgba(201,168,76,.25),transparent)" }} />
      <div className="absolute top-0 right-20 w-px h-full opacity-10" style={{ background: "linear-gradient(to bottom,transparent,rgba(201,168,76,.6),transparent)" }} />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-14 pt-32 pb-20 w-full grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <motion.div initial={reducedMotion ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reducedMotion ? 0 : .5, delay: reducedMotion ? 0 : .15 }}
            className="flex items-center gap-3 mb-8">
            <div className="h-px w-10" style={{ background: "#c9a84c" }} />
            <span className="text-xs tracking-widest uppercase" style={{ color: "#c9a84c", fontFamily: "'DM Mono',monospace" }}>{campaign.eyebrow}</span>
          </motion.div>

          <motion.h1 initial={reducedMotion ? false : { opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reducedMotion ? 0 : .9, delay: reducedMotion ? 0 : .25 }}
            style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(52px,7.5vw,100px)", lineHeight: 1.02, fontWeight: 900 }}>
            {campaign.title.replace(campaign.accent, "")}<br /><span className="gold-shimmer">{campaign.accent}</span>
          </motion.h1>

          <motion.p initial={reducedMotion ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reducedMotion ? 0 : .7, delay: reducedMotion ? 0 : .45 }}
            className="mt-6 text-base leading-relaxed max-w-md"
            style={{ color: "rgba(240,234,216,.5)" }}>
            {campaign.copy}
          </motion.p>

          <motion.div initial={reducedMotion ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reducedMotion ? 0 : .6, delay: reducedMotion ? 0 : .65 }}
            className="mt-10 flex flex-wrap items-center gap-4">
            <a href="#models" className="flex items-center gap-3 px-8 py-4 text-xs tracking-widest uppercase font-semibold transition-all duration-300 pulse-cta"
              style={{ background: "#c9a84c", color: "#050508" }}>
              Explore Models <ArrowRight size={13} />
            </a>
            <a href="#experience" className="flex items-center gap-3 px-8 py-4 text-xs tracking-widest uppercase transition-all duration-300"
              style={{ border: "1px solid rgba(201,168,76,.25)", color: "rgba(240,234,216,.65)" }}>
              <Play size={13} /> Virtual Tour
            </a>
          </motion.div>
        </div>

        <motion.div initial={reducedMotion ? false : { opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: reducedMotion ? 0 : .85, delay: reducedMotion ? 0 : .55 }}
          className="hidden lg:flex flex-col gap-4">
          <div className="float-img">
            <img src={campaign.vehicle}
              alt={`${campaign.time} featured Velorum vehicle`} width="720" height="430" decoding="async"
              style={{ width: "100%", maxWidth: 500, aspectRatio: "720 / 430", objectFit: "cover", display: "block", border: "1px solid rgba(201,168,76,.15)" }} />
          </div>
          <div className="flex gap-3 justify-end">
            {campaign.stats.map((stat, statIndex) => (
              <div key={stat.label} className="px-4 py-3 flex flex-col gap-1"
                style={{ background: "rgba(13,13,20,.92)", border: highlightStat === statIndex ? "1px solid rgba(201,168,76,.55)" : "1px solid rgba(201,168,76,.12)", backdropFilter: "blur(10px)", transform: highlightStat === statIndex ? "translateY(-4px)" : "translateY(0)", transition: "all .45s ease" }}>
                <span className="text-xs" style={{ color: "rgba(240,234,216,.35)", fontFamily: "'DM Mono',monospace" }}>{stat.label}</span>
                <span style={{ color: "#c9a84c", fontFamily: "'DM Mono',monospace", fontSize: 18, fontWeight: 500 }}>{stat.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <div className="h-10 w-px" style={{ background: "linear-gradient(to bottom,rgba(201,168,76,.5),transparent)" }} />
        <span className="text-xs tracking-widest uppercase" style={{ color: "rgba(240,234,216,.25)", fontFamily: "'DM Mono',monospace" }}>scroll</span>
      </div>
    </section>
  );
}
