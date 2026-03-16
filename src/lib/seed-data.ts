import { KBNode, KBEdge } from "./types";

export const seedNodes: KBNode[] = [
  {
    id: "1",
    title: "React",
    notes: "A JavaScript library for building user interfaces using components.",
    category: "framework",
    createdAt: Date.now(),
  },
  {
    id: "2",
    title: "Next.js",
    notes: "React framework with SSR, routing, and API support built in.",
    category: "framework",
    createdAt: Date.now(),
  },
  {
    id: "3",
    title: "TypeScript",
    notes: "Typed superset of JavaScript that compiles to plain JS.",
    category: "language",
    createdAt: Date.now(),
  },
  {
    id: "4",
    title: "State Management",
    notes: "Patterns for managing shared application state (Context, Zustand, Redux).",
    category: "concept",
    createdAt: Date.now(),
  },
  {
    id: "5",
    title: "Component Design",
    notes: "Principles for building reusable, composable UI components.",
    category: "pattern",
    createdAt: Date.now(),
  },
  {
    id: "6",
    title: "Performance",
    notes: "Techniques like memoization, lazy loading, and virtualization.",
    category: "concept",
    createdAt: Date.now(),
  },
  {
    id: "7",
    title: "Testing",
    notes: "Unit, integration, and e2e testing strategies for frontend apps.",
    category: "tooling",
    createdAt: Date.now(),
  },
  {
    id: "8",
    title: "CSS & Styling",
    notes: "Styling approaches including Tailwind, CSS Modules, and styled-components.",
    category: "tooling",
    createdAt: Date.now(),
  },
];

export const seedEdges: KBEdge[] = [
  { id: "e1", source: "2", target: "1", label: "built on", createdAt: Date.now() },
  { id: "e2", source: "1", target: "3", label: "pairs well with", createdAt: Date.now() },
  { id: "e3", source: "1", target: "4", label: "uses", createdAt: Date.now() },
  { id: "e4", source: "1", target: "5", label: "guides", createdAt: Date.now() },
  { id: "e5", source: "2", target: "6", label: "improves", createdAt: Date.now() },
  { id: "e6", source: "1", target: "7", label: "requires", createdAt: Date.now() },
  { id: "e7", source: "1", target: "8", label: "styled with", createdAt: Date.now() },
  { id: "e8", source: "4", target: "6", label: "impacts", createdAt: Date.now() },
  { id: "e9", source: "5", target: "6", label: "impacts", createdAt: Date.now() },
];
