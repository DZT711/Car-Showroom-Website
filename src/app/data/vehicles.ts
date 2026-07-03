export type Vehicle = {
  id: string;
  name: string;
  tagline: string;
  hp: number;
  torque: number;
  zeroToSixty: number;
  topSpeed: number;
  viewingStatus: string;
  image: string;
  accent: string;
  colorName: string;
  features: string[];
};

export type ViewerAngle = {
  label: string;
  image: string;
  preset: "exterior" | "interior" | "cockpit" | "wheel" | "engine";
};

export type HeroCampaign = {
  id: string;
  time: string;
  eyebrow: string;
  title: string;
  accent: string;
  copy: string;
  background: string;
  vehicle: string;
  stats: { label: string; value: string }[];
};

export type Hotspot = {
  id: string;
  title: string;
  desc: string;
  cameras: Partial<Record<string, { x: number; y: number }>>;
};

export const vehicles: Vehicle[] = [
  {
    id: "velox",
    name: "VELOX GT-R",
    tagline: "Born from fire. Bred for speed.",
    hp: 720,
    torque: 590,
    zeroToSixty: 2.8,
    topSpeed: 218,
    viewingStatus: "Private viewing available",
    image: "https://images.unsplash.com/photo-1610847499832-918a1c3c6811?w=1400&h=800&fit=crop&auto=format",
    accent: "#c41e3a",
    colorName: "Rosso Fuoco",
    features: ["Twin-Turbo V8", "Carbon Ceramic Brakes", "Active Aero", "Track Mode"],
  },
  {
    id: "apex",
    name: "APEX Shadow",
    tagline: "Darkness refined. Power unleashed.",
    hp: 850,
    torque: 720,
    zeroToSixty: 2.3,
    topSpeed: 235,
    viewingStatus: "Concierge allocation",
    image: "https://images.unsplash.com/photo-1764013290499-bc46136765b1?w=1400&h=800&fit=crop&auto=format",
    accent: "#4a9eff",
    colorName: "Midnight Obsidian",
    features: ["Biturbo V12", "Night Vision HUD", "Adaptive Suspension", "Launch Control"],
  },
  {
    id: "nova",
    name: "NOVA Coupe",
    tagline: "Sculpted by wind. Guided by stars.",
    hp: 580,
    torque: 480,
    zeroToSixty: 3.2,
    topSpeed: 196,
    viewingStatus: "Studio demonstrator",
    image: "https://images.unsplash.com/photo-1580446623001-3abf670c5c55?w=1400&h=800&fit=crop&auto=format",
    accent: "#c9a84c",
    colorName: "Solar Gold",
    features: ["Supercharged V6", "Panoramic Roof", "Sport Exhaust", "Head-Up Display"],
  },
  {
    id: "titan",
    name: "TITAN Roadster",
    tagline: "Electric soul. Infinite horizon.",
    hp: 1200,
    torque: 1100,
    zeroToSixty: 1.9,
    topSpeed: 250,
    viewingStatus: "Limited preview window",
    image: "https://images.unsplash.com/photo-1628890954311-74476fcbf0d4?w=1400&h=800&fit=crop&auto=format",
    accent: "#00e5cc",
    colorName: "Abyss Blue",
    features: ["Tri-Motor EV", "800V Fast Charge", "AI Drive Assist", "520mi Range"],
  },
];

export const heroCampaigns: HeroCampaign[] = [
  {
    id: "night-unveiling",
    time: "Night",
    eyebrow: "Private Night Unveiling",
    title: "Drive the Impossible.",
    accent: "Impossible.",
    copy: "Four decades of obsessive engineering, distilled into machines that don't merely transport — they transform the soul of their driver.",
    background: "https://images.unsplash.com/photo-1776102669015-21d5f6c0cdf8?w=1800&h=1000&fit=crop&auto=format",
    vehicle: "https://images.unsplash.com/photo-1765520771038-4cead38fc015?w=720&h=430&fit=crop&auto=format",
    stats: [{ label: "0→60", value: "2.3s" }, { label: "Horsepower", value: "850" }, { label: "Top Speed", value: "235mph" }],
  },
  {
    id: "sunset-grand-tour",
    time: "Sunset",
    eyebrow: "Grand Touring Campaign",
    title: "Silence with a Pulse.",
    accent: "Pulse.",
    copy: "A cinematic grand tour built around velvet acceleration, long-distance composure, and a cabin that turns every arrival into theatre.",
    background: "https://images.unsplash.com/photo-1775470520099-a09b7c410380?w=1800&h=1000&fit=crop&auto=format",
    vehicle: "https://images.unsplash.com/photo-1610847499832-918a1c3c6811?w=720&h=430&fit=crop&auto=format",
    stats: [{ label: "Range", value: "520mi" }, { label: "Torque", value: "1,100" }, { label: "Cabin", value: "Silent" }],
  },
  {
    id: "morning-atelier",
    time: "Morning",
    eyebrow: "Atelier Preview",
    title: "Crafted to Hypnotize.",
    accent: "Hypnotize.",
    copy: "Paint, leather, aero and light are composed like instruments — each detail tuned for clients who notice everything.",
    background: "https://images.unsplash.com/photo-1774874466880-73f693b223fa?w=1800&h=1000&fit=crop&auto=format",
    vehicle: "https://images.unsplash.com/photo-1580446623001-3abf670c5c55?w=720&h=430&fit=crop&auto=format",
    stats: [{ label: "Finish", value: "Bespoke" }, { label: "Leather", value: "Hand cut" }, { label: "Light", value: "Adaptive" }],
  },
];

export const viewerAngles: ViewerAngle[] = [
  { label: "Front", preset: "exterior", image: "https://images.unsplash.com/photo-1765520771038-4cead38fc015?w=1300&h=700&fit=crop&auto=format" },
  { label: "3/4 Front", preset: "exterior", image: "https://images.unsplash.com/photo-1610847499832-918a1c3c6811?w=1300&h=700&fit=crop&auto=format" },
  { label: "Side", preset: "exterior", image: "https://images.unsplash.com/photo-1581439645268-ea7bbe6bd091?w=1300&h=700&fit=crop&auto=format" },
  { label: "3/4 Rear", preset: "exterior", image: "https://images.unsplash.com/photo-1628890954311-74476fcbf0d4?w=1300&h=700&fit=crop&auto=format" },
  { label: "Interior", preset: "interior", image: "https://images.unsplash.com/photo-1759673735031-b6eabfc82261?w=1300&h=700&fit=crop&auto=format" },
  { label: "Cockpit", preset: "cockpit", image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1300&h=700&fit=crop&auto=format" },
  { label: "Wheel", preset: "wheel", image: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=1300&h=700&fit=crop&auto=format" },
  { label: "Engine", preset: "engine", image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=1300&h=700&fit=crop&auto=format" },
];

export const hotspots: Hotspot[] = [
  {
    id: "front-led-signature",
    title: "Front LED Headlamp",
    desc: "The marker sits directly on the visible headlamp lens and its sharp upper daytime-running-light blade.",
    cameras: { Front: { x: 66, y: 52 }, "3/4 Front": { x: 43, y: 79 }, Wheel: { x: 82, y: 54 } },
  },
  {
    id: "front-wheel-caliper",
    title: "Front Wheel & Brake Caliper",
    desc: "The hotspot is anchored to the visible front wheel where the caliper can be inspected through the open spokes.",
    cameras: { "3/4 Front": { x: 58, y: 82 }, Wheel: { x: 55, y: 76 } },
  },
  {
    id: "side-air-intake",
    title: "Side Cooling Intake",
    desc: "The marker identifies the sculpted side intake feeding cooling air into the rear-mounted powertrain area.",
    cameras: { "3/4 Front": { x: 75, y: 65 }, Wheel: { x: 25, y: 79 } },
  },
  {
    id: "rear-lamp-cluster",
    title: "Rear Lamp Cluster",
    desc: "The callout is placed on the illuminated rear light cluster visible in this camera angle.",
    cameras: { Side: { x: 42, y: 69 }, "3/4 Rear": { x: 62, y: 43 }, Cockpit: { x: 44, y: 41 } },
  },
  {
    id: "rear-diffuser-exhaust",
    title: "Rear Diffuser & Exhaust",
    desc: "The hotspot lands on the visible lower rear aero section and exhaust outlets rather than an unseen drivetrain.",
    cameras: { Side: { x: 50, y: 79 }, "3/4 Rear": { x: 57, y: 73 } },
  },
  {
    id: "rear-engine-vents",
    title: "Rear Engine Vents",
    desc: "The marker points to the rear deck ventilation openings visible through rain and reflections.",
    cameras: { Side: { x: 54, y: 49 } },
  },
  {
    id: "quarter-glass-roofline",
    title: "Quarter Glass & Roofline",
    desc: "This close-up camera shows the exterior glass edge and roof contour, not the cabin interior.",
    cameras: { Interior: { x: 60, y: 15 } },
  },
  {
    id: "rear-deck-vent-closeup",
    title: "Rear Deck Vent Detail",
    desc: "The marker is aligned to the visible louvered vent at the edge of the rear deck panel.",
    cameras: { Interior: { x: 93, y: 43 } },
  },
  {
    id: "rolling-rear-wheel",
    title: "Rolling Rear Wheel",
    desc: "The callout identifies the visible rear wheel in motion on the rolling highway camera.",
    cameras: { Cockpit: { x: 62, y: 67 } },
  },
  {
    id: "front-splitter-intake",
    title: "Front Lower Intake",
    desc: "The hotspot sits on the lower front intake and splitter area visible beneath the nose.",
    cameras: { "3/4 Front": { x: 34, y: 89 }, Wheel: { x: 82, y: 73 } },
  },
  {
    id: "engine-belt-drive",
    title: "Accessory Belt Drive",
    desc: "The marker points to the exposed belt-and-pulley assembly visible in the engine bay close-up.",
    cameras: { Engine: { x: 52, y: 34 } },
  },
  {
    id: "engine-intake-hose",
    title: "Intake Hose Routing",
    desc: "The callout marks the visible intake hose crossing the upper engine bay.",
    cameras: { Engine: { x: 74, y: 18 } },
  },
];

export const gallery = [
  { id: "1776102669015-21d5f6c0cdf8", alt: "Luxury cars in dark showroom", tall: true },
  { id: "1774874604286-30ee598ae960", alt: "Black car motion blur", tall: false },
  { id: "1765520771038-4cead38fc015", alt: "Red sports car headlights in darkness", tall: false },
  { id: "1774874466880-73f693b223fa", alt: "Black car on wet brick street", tall: true },
  { id: "1775470520099-a09b7c410380", alt: "Two cars under bridge at dusk", tall: false },
  { id: "1764013290499-bc46136765b1", alt: "Black sports car parked at night", tall: false },
];
