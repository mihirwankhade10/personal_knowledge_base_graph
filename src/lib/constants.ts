import { NodeCategory } from "./types";

export const CATEGORY_COLORS: Record<NodeCategory, string> = {
  framework: "#00d4ff",   // neon cyan-blue
  language: "#bf5af2",    // neon purple
  concept: "#30d158",     // neon green
  tooling: "#ff9f0a",     // neon amber
  pattern: "#ff2d55",     // neon pink
  other: "#64d2ff",       // light cyan
};

export const CATEGORY_LABELS: Record<NodeCategory, string> = {
  framework: "Framework",
  language: "Language",
  concept: "Concept",
  tooling: "Tooling",
  pattern: "Pattern",
  other: "Other",
};

export const LAYOUT_OPTIONS = [
  { value: "dagre", label: "Hierarchical" },
  { value: "cose", label: "Force-directed" },
  { value: "circle", label: "Circular" },
  { value: "grid", label: "Grid" },
  { value: "breadthfirst", label: "Breadth-first" },
] as const;

export const EDGE_LABEL_PRESETS = [
  "relates to",
  "depends on",
  "built on",
  "pairs well with",
  "uses",
  "guides",
  "improves",
  "requires",
  "styled with",
  "impacts",
  "see also",
  "extends",
  "tests",
  "complements",
];

export const STORAGE_KEY = "kb-graph-data";
export const STORAGE_VERSION = 1;
