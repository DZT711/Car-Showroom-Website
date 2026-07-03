import React from "react";
import { motion } from "motion/react";
import { Check, Send, Share2, Save } from "lucide-react";
import {
  configurationGroups,
  configurationProfiles,
  getConfigurationAccent,
  getConfigurationOption,
  type ConfigCategory,
  type VehicleConfiguration,
} from "../../data/configurations";
import type { Vehicle } from "../../data/vehicles";

const categories: Array<{ id: ConfigCategory; label: string }> = [
  { id: "exterior", label: "Exterior" },
  { id: "interior", label: "Interior" },
  { id: "performance", label: "Performance" },
  { id: "experience", label: "Experience" },
];

type ConfiguratorSectionProps = {
  configuration: VehicleConfiguration;
  onChange: <K extends keyof VehicleConfiguration>(key: K, value: VehicleConfiguration[K]) => void;
  onApplyProfile: (values: Partial<VehicleConfiguration>) => void;
  reducedMotion: boolean;
  modelName: string;
  vehicles: Vehicle[];
  selectedVehicleId: string;
  onVehicleChange: (vehicleId: string) => void;
};

export function ConfiguratorSection({ configuration, onChange, onApplyProfile, reducedMotion, modelName, vehicles, selectedVehicleId, onVehicleChange }: ConfiguratorSectionProps) {
  const accent = getConfigurationAccent(configuration);
  const selectedPaint = getConfigurationOption("paint", configuration.paint);
  const selectedLeather = getConfigurationOption("leather", configuration.leather);
  const selectedWheels = getConfigurationOption("wheels", configuration.wheels);
  const selectedEnvironment = getConfigurationOption("environment", configuration.environment);
  const selectedTrim = getConfigurationOption("trim", configuration.trim);
  const selectedAmbient = getConfigurationOption("ambientLight", configuration.ambientLight);
  const selectedFinish = getConfigurationOption("finish", configuration.finish);

  return (
    <section id="configurator" className="py-28 relative overflow-hidden" style={{ background: "#07070f" }}>
      <div className="absolute inset-0 pointer-events-none opacity-60" style={{ background: `radial-gradient(circle at 20% 15%, ${accent}18, transparent 34%), radial-gradient(circle at 82% 72%, rgba(196,30,58,.09), transparent 30%)` }} />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-14">
        <motion.div initial={reducedMotion ? false : { opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: reducedMotion ? 0 : .45 }} className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-10" style={{ background: accent }} />
            <span className="text-xs tracking-widest uppercase" style={{ color: accent, fontFamily: "'DM Mono',monospace" }}>Atelier Configurator</span>
          </div>
          <div className="grid lg:grid-cols-[1fr_.72fr] gap-8 items-end">
            <div>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(32px,4.5vw,58px)", fontWeight: 700 }}>
                Compose the Presence.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed" style={{ color: "rgba(240,234,216,.42)" }}>
                Build a showroom-ready specification for {modelName}. Every selection updates the shared vehicle experience without entering any purchase flow.
              </p>
            </div>

            <div className="p-5" style={{ background: "rgba(5,5,8,.68)", border: "1px solid rgba(201,168,76,.12)", backdropFilter: "blur(14px)" }}>
              <div className="text-[10px] tracking-widest uppercase mb-3" style={{ color: "rgba(240,234,216,.35)", fontFamily: "'DM Mono',monospace" }}>Live specification</div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                {[
                  ["Paint", selectedPaint?.label],
                  ["Cabin", selectedLeather?.label],
                  ["Wheels", selectedWheels?.label],
                  ["Scene", selectedEnvironment?.label],
                ].map(([label, value]) => (
                  <div key={label}>
                    <div style={{ color: "rgba(240,234,216,.28)", fontFamily: "'DM Mono',monospace" }}>{label}</div>
                    <div className="mt-1" style={{ color: "#f0ead8" }}>{value}</div>
                  </div>
                ))}
              </div>
              <div className="mt-5 grid grid-cols-2 gap-px" style={{ background: "rgba(201,168,76,.08)" }}>
                <div className="p-3" style={{ background: "rgba(5,5,8,.7)" }}>
                  <div className="text-[10px] tracking-widest uppercase" style={{ color: accent, fontFamily: "'DM Mono',monospace" }}>Material macro</div>
                  <div className="mt-2 text-xs" style={{ color: "rgba(240,234,216,.7)" }}>{selectedTrim?.label} · {selectedFinish?.label}</div>
                </div>
                <div className="p-3" style={{ background: "rgba(5,5,8,.7)" }}>
                  <div className="text-[10px] tracking-widest uppercase" style={{ color: selectedAmbient?.accent ?? accent, fontFamily: "'DM Mono',monospace" }}>Interior mode</div>
                  <div className="mt-2 text-xs" style={{ color: "rgba(240,234,216,.7)" }}>{selectedLeather?.label} · {selectedAmbient?.label}</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid xl:grid-cols-[.78fr_1.22fr] gap-px" style={{ background: "rgba(201,168,76,.08)" }}>
          <aside className="p-6 lg:p-8" style={{ background: "rgba(5,5,8,.96)" }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-2" style={{ background: accent, boxShadow: `0 0 14px ${accent}` }} />
              <h3 className="text-xs tracking-widest uppercase" style={{ color: "#c9a84c", fontFamily: "'DM Mono',monospace" }}>Vehicle</h3>
            </div>
            <div className="grid gap-2 mb-8">
              {vehicles.map(vehicle => {
                const selected = vehicle.id === selectedVehicleId;
                return (
                  <button key={vehicle.id} type="button" onClick={() => onVehicleChange(vehicle.id)} aria-pressed={selected}
                    className="p-4 text-left transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                    style={{ background: selected ? "rgba(201,168,76,.1)" : "rgba(13,13,20,.78)", border: selected ? "1px solid rgba(201,168,76,.45)" : "1px solid rgba(201,168,76,.08)", outlineColor: "#c9a84c" }}>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm" style={{ color: selected ? "#c9a84c" : "#f0ead8" }}>{vehicle.name}</span>
                      {selected && <Check size={14} style={{ color: "#c9a84c" }} />}
                    </div>
                    <p className="mt-2 text-xs leading-relaxed" style={{ color: "rgba(240,234,216,.36)" }}>{vehicle.tagline}</p>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-2" style={{ background: accent, boxShadow: `0 0 14px ${accent}` }} />
              <h3 className="text-xs tracking-widest uppercase" style={{ color: "#c9a84c", fontFamily: "'DM Mono',monospace" }}>Curated profiles</h3>
            </div>
            <div className="grid sm:grid-cols-2 xl:grid-cols-1 gap-3">
              {configurationProfiles.map(profile => (
                <button key={profile.id} type="button" onClick={() => onApplyProfile(profile.values)} aria-pressed={configuration.profile === profile.id}
                  className="p-4 text-left transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                  style={{ background: configuration.profile === profile.id ? "rgba(201,168,76,.1)" : "rgba(13,13,20,.78)", border: configuration.profile === profile.id ? "1px solid rgba(201,168,76,.45)" : "1px solid rgba(201,168,76,.08)", outlineColor: "#c9a84c" }}>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm" style={{ color: configuration.profile === profile.id ? "#c9a84c" : "#f0ead8" }}>{profile.label}</span>
                    {configuration.profile === profile.id && <Check size={14} style={{ color: "#c9a84c" }} />}
                  </div>
                  <p className="mt-2 text-xs leading-relaxed" style={{ color: "rgba(240,234,216,.36)" }}>{profile.description}</p>
                </button>
              ))}
            </div>

            <div className="mt-8 grid grid-cols-3 gap-2">
              {[
                { icon: <Save size={14} />, label: "Save" },
                { icon: <Share2 size={14} />, label: "Share" },
                { icon: <Send size={14} />, label: "Request" },
              ].map(action => (
                <button key={action.label} type="button" className="py-3 flex flex-col items-center gap-2 text-[10px] tracking-widest uppercase transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2" style={{ color: "rgba(240,234,216,.48)", border: "1px solid rgba(201,168,76,.1)", outlineColor: "#c9a84c", fontFamily: "'DM Mono',monospace" }}>
                  {action.icon}
                  {action.label}
                </button>
              ))}
            </div>
          </aside>

          <div className="p-6 lg:p-8" style={{ background: "rgba(13,13,20,.96)" }}>
            <div className="space-y-10">
              {categories.map(category => (
                <div key={category.id}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-px w-8" style={{ background: accent }} />
                    <h3 className="text-xs tracking-widest uppercase" style={{ color: "rgba(240,234,216,.55)", fontFamily: "'DM Mono',monospace" }}>{category.label}</h3>
                  </div>

                  <div className="grid md:grid-cols-2 gap-3">
                    {configurationGroups.filter(group => group.category === category.id).map(group => (
                      <div key={group.id} className="p-4" style={{ background: "rgba(5,5,8,.62)", border: "1px solid rgba(201,168,76,.07)" }}>
                        <div className="text-xs tracking-widest uppercase mb-3" style={{ color: "#c9a84c", fontFamily: "'DM Mono',monospace" }}>{group.title}</div>
                        <div className="grid gap-2">
                          {group.options.map(option => {
                            const selected = configuration[group.id] === option.id;
                            return (
                              <button key={option.id} type="button" onClick={() => onChange(group.id, option.id as VehicleConfiguration[typeof group.id])} aria-pressed={selected}
                                className="w-full p-3 text-left flex items-start gap-3 transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                                style={{ background: selected ? "rgba(201,168,76,.09)" : "rgba(13,13,20,.55)", border: selected ? `1px solid ${option.accent ?? accent}88` : "1px solid rgba(201,168,76,.06)", outlineColor: "#c9a84c" }}>
                                {option.swatch && <span className="mt-0.5 h-5 w-5 shrink-0" style={{ background: option.swatch, border: "1px solid rgba(240,234,216,.18)", boxShadow: selected ? `0 0 18px ${option.accent ?? option.swatch}66` : "none" }} />}
                                <span className="min-w-0">
                                  <span className="flex items-center gap-2 text-sm" style={{ color: selected ? option.accent ?? accent : "#f0ead8" }}>
                                    {option.label}
                                    {selected && <Check size={13} />}
                                  </span>
                                  <span className="block mt-1 text-xs leading-relaxed" style={{ color: "rgba(240,234,216,.34)" }}>{option.description}</span>
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
