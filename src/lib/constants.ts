import { NodeCategory } from "./types";

export const CATEGORY_COLORS: Record<NodeCategory, string> = {
  framework: "#3b82f6",   // blue
  language: "#8b5cf6",    // violet
  concept: "#10b981",     // emerald
  tooling: "#f59e0b",     // amber
  pattern: "#ec4899",     // pink
  other: "#6b7280",       // gray
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
