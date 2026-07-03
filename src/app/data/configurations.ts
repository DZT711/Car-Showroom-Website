export type ConfigCategory = "exterior" | "interior" | "performance" | "experience";

export type ConfigurationOption = {
  id: string;
  label: string;
  description: string;
  swatch?: string;
  accent?: string;
};

export type VehicleConfiguration = {
  paint: string;
  finish: string;
  roof: string;
  carbonPackage: string;
  leather: string;
  stitching: string;
  ambientLight: string;
  trim: string;
  wheels: string;
  calipers: string;
  suspension: string;
  environment: string;
  studioLighting: string;
  profile: string;
};

export type ConfigurationGroup = {
  id: keyof VehicleConfiguration;
  title: string;
  category: ConfigCategory;
  options: ConfigurationOption[];
};

export const defaultConfiguration: VehicleConfiguration = {
  paint: "obsidian",
  finish: "satin",
  roof: "panoramic",
  carbonPackage: "exposed-carbon",
  leather: "onyx",
  stitching: "champagne",
  ambientLight: "ember",
  trim: "carbon-weave",
  wheels: "forged-shadow",
  calipers: "crimson",
  suspension: "grand-touring",
  environment: "night-city",
  studioLighting: "cinematic",
  profile: "grand-touring",
};

export const configurationGroups: ConfigurationGroup[] = [
  {
    id: "paint",
    title: "Paint",
    category: "exterior",
    options: [
      { id: "obsidian", label: "Obsidian Black", description: "Deep black with warm metallic depth.", swatch: "#050508", accent: "#c9a84c" },
      { id: "rosso", label: "Rosso Fuoco", description: "A restrained crimson performance finish.", swatch: "#8f1228", accent: "#c41e3a" },
      { id: "solar", label: "Solar Champagne", description: "Soft gold tone for atelier previews.", swatch: "#c9a84c", accent: "#f5d880" },
      { id: "abyss", label: "Abyss Blue", description: "Blue-black pearl for electric roadsters.", swatch: "#071427", accent: "#4a9eff" },
    ],
  },
  {
    id: "finish",
    title: "Finish",
    category: "exterior",
    options: [
      { id: "satin", label: "Satin", description: "Soft reflection with sculptural highlights." },
      { id: "gloss", label: "Gloss", description: "Mirror depth for studio reveal lighting." },
      { id: "matte", label: "Matte", description: "Low-sheen stealth treatment." },
      { id: "pearl", label: "Pearl", description: "Subtle color shift under sunset light." },
    ],
  },
  {
    id: "roof",
    title: "Roof",
    category: "exterior",
    options: [
      { id: "panoramic", label: "Panoramic Glass", description: "Expansive cabin light with UV acoustic glass." },
      { id: "carbon", label: "Carbon Roof", description: "Lower center of gravity and motorsport character." },
      { id: "body-color", label: "Body Color", description: "A pure uninterrupted silhouette." },
    ],
  },
  {
    id: "carbonPackage",
    title: "Carbon Package",
    category: "exterior",
    options: [
      { id: "exposed-carbon", label: "Exposed Carbon", description: "Visible weave on splitter, sills, and diffuser." },
      { id: "painted-carbon", label: "Painted Carbon", description: "Hidden lightweight structure under flawless paint." },
      { id: "aero-carbon", label: "Aero Carbon", description: "Extended aero surfaces for high-speed stability." },
    ],
  },
  {
    id: "leather",
    title: "Leather",
    category: "interior",
    options: [
      { id: "onyx", label: "Onyx Nappa", description: "Dark hand-selected leather with minimal grain.", swatch: "#101015" },
      { id: "saddle", label: "Saddle Tan", description: "Warm touring cabin inspired by coachbuilding.", swatch: "#8b5b35" },
      { id: "ivory", label: "Ivory Smoke", description: "Light lounge interior with graphite accents.", swatch: "#d6d0bf" },
    ],
  },
  {
    id: "stitching",
    title: "Stitching",
    category: "interior",
    options: [
      { id: "champagne", label: "Champagne", description: "Fine contrast thread matched to exterior jewelry." },
      { id: "crimson", label: "Crimson", description: "Performance linework through seats and dash." },
      { id: "tonal", label: "Tonal", description: "Nearly invisible quiet luxury detailing." },
    ],
  },
  {
    id: "ambientLight",
    title: "Ambient Lighting",
    category: "interior",
    options: [
      { id: "ember", label: "Ember Gold", description: "Warm perimeter glow for night arrivals.", accent: "#c9a84c" },
      { id: "arctic", label: "Arctic Blue", description: "Cool technical light for electric silence.", accent: "#4a9eff" },
      { id: "theatre", label: "Theatre Red", description: "Low crimson light for performance mode.", accent: "#c41e3a" },
    ],
  },
  {
    id: "trim",
    title: "Dashboard Trim",
    category: "interior",
    options: [
      { id: "carbon-weave", label: "Carbon Weave", description: "Precision twill under satin clear coat." },
      { id: "open-pore-walnut", label: "Open-Pore Walnut", description: "Hand-finished wood with tactile warmth." },
      { id: "brushed-aluminum", label: "Brushed Aluminum", description: "Technical, cool, and architectural." },
    ],
  },
  {
    id: "wheels",
    title: "Wheels",
    category: "performance",
    options: [
      { id: "forged-shadow", label: "Forged Shadow", description: "Lightweight black forged split-spoke." },
      { id: "touring-dish", label: "Touring Dish", description: "Elegant aero-inspired grand touring wheel." },
      { id: "track-spoke", label: "Track Spoke", description: "Open spoke geometry for brake cooling." },
    ],
  },
  {
    id: "calipers",
    title: "Brake Calipers",
    category: "performance",
    options: [
      { id: "crimson", label: "Crimson", description: "Classic performance punctuation.", swatch: "#c41e3a" },
      { id: "champagne", label: "Champagne", description: "Subtle jewelry behind dark wheels.", swatch: "#c9a84c" },
      { id: "graphite", label: "Graphite", description: "Quiet technical finish.", swatch: "#3c3c46" },
    ],
  },
  {
    id: "suspension",
    title: "Suspension",
    category: "performance",
    options: [
      { id: "grand-touring", label: "Grand Touring", description: "Composed high-speed comfort." },
      { id: "sport", label: "Sport", description: "Sharper body control and throttle response." },
      { id: "track", label: "Track", description: "Lowest ride height with maximum damping." },
    ],
  },
  {
    id: "environment",
    title: "Environment",
    category: "experience",
    options: [
      { id: "studio", label: "Studio", description: "Controlled reflections and black floor." },
      { id: "luxury-garage", label: "Luxury Garage", description: "Private delivery bay atmosphere." },
      { id: "sunset-highway", label: "Sunset Highway", description: "Warm light and long-distance mood." },
      { id: "night-city", label: "Night City", description: "Low reflections, glass, and sodium highlights." },
    ],
  },
  {
    id: "studioLighting",
    title: "Studio Lighting",
    category: "experience",
    options: [
      { id: "cinematic", label: "Cinematic", description: "High contrast reveal beams." },
      { id: "softbox", label: "Softbox", description: "Smooth atelier paint inspection." },
      { id: "night", label: "Night", description: "Headlight-led silhouette study." },
    ],
  },
];

export const configurationProfiles: Array<{ id: string; label: string; description: string; values: Partial<VehicleConfiguration> }> = [
  { id: "executive", label: "Executive", description: "Quiet authority with ivory leather and soft light.", values: { leather: "ivory", trim: "open-pore-walnut", suspension: "grand-touring", studioLighting: "softbox", ambientLight: "ember", profile: "executive" } },
  { id: "grand-touring", label: "Grand Touring", description: "Balanced long-distance luxury with satin paint.", values: { finish: "satin", roof: "panoramic", wheels: "touring-dish", suspension: "grand-touring", environment: "sunset-highway", profile: "grand-touring" } },
  { id: "performance", label: "Performance", description: "Crimson details, exposed carbon, sharper response.", values: { paint: "rosso", carbonPackage: "aero-carbon", calipers: "crimson", suspension: "sport", ambientLight: "theatre", profile: "performance" } },
  { id: "night-drive", label: "Night Drive", description: "Obsidian surfaces with matrix light theatre.", values: { paint: "obsidian", finish: "gloss", environment: "night-city", studioLighting: "night", ambientLight: "ember", profile: "night-drive" } },
];

export function getConfigurationOption(groupId: keyof VehicleConfiguration, optionId: string) {
  return configurationGroups.find(group => group.id === groupId)?.options.find(option => option.id === optionId);
}

export function getConfigurationAccent(configuration: VehicleConfiguration) {
  return getConfigurationOption("ambientLight", configuration.ambientLight)?.accent
    ?? getConfigurationOption("paint", configuration.paint)?.accent
    ?? "#c9a84c";
}
