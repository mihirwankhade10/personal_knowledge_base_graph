# Personal Knowledge Base Graph

An interactive knowledge graph viewer for mapping topics and their relationships. Built with Next.js, TypeScript, and Cytoscape.js.

![Knowledge Graph](https://img.shields.io/badge/Next.js-16-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Cytoscape.js](https://img.shields.io/badge/Cytoscape.js-3-green)

## Features

### Core
- **Interactive Graph Canvas** — Render nodes and directed edges with relationship labels using Cytoscape.js
- **Node Detail Panel** — Click any node to view/edit its title, category, and notes inline
- **Full CRUD** — Add/edit/delete nodes and edges with intuitive dialogs
- **Persistence** — All graph state saved to localStorage and restored on page load
- **Multiple Layouts** — Hierarchical (dagre), force-directed, circular, grid, and breadth-first

### Stretch Goals
- **Animations** — Smooth node appear/remove (fade + scale), edge fade-in, animated layout transitions
- **Connected Highlighting** — Selecting a node dims unrelated nodes and highlights neighbors
- **Drag & Persist** — Drag nodes to reposition; positions persist across sessions
- **Search** — Cmd/Ctrl+K command palette to quickly find and focus nodes
- **Export/Import** — Download graph as JSON, import from file
- **Keyboard Shortcuts** — N (add node), E (add edge), Delete (remove selected), Escape (deselect)
- **Minimap** — Overview widget for navigation on larger graphs
- **Zoom Controls** — Zoom in/out/fit with floating controls

## Tech Stack

| Tool | Purpose |
|------|---------|
| Next.js 16 (App Router) | Framework |
| TypeScript | Type safety |
| Cytoscape.js + cytoscape-dagre | Graph rendering & layouts |
| Zustand | State management |
| Tailwind CSS + Shadcn/ui | Styling & UI components |
| Framer Motion | Panel animations |
| Lucide React | Icons |

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
git clone <repo-url>
cd personal_knowledge_base_graph
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## Seed Data

The app comes pre-loaded with 8 nodes (React, Next.js, TypeScript, State Management, Component Design, Performance, Testing, CSS & Styling) and 9 edges showing their relationships. This data loads automatically on first visit when no localStorage data exists.

## Architecture

```
Zustand Store (single source of truth)
    ↓ React subscription
useGraph hook diffs & batch-updates Cytoscape
    ↓
Cytoscape.js renders to canvas
    ↓ tap/dragfree events
Dispatch back to Zustand Store
```

Key decisions:
- **One-directional data flow**: Store drives Cytoscape, not vice versa
- **Dynamic import**: Graph canvas loaded client-side only (Cytoscape needs DOM)
- **Debounced persistence**: localStorage saves throttled to 500ms to avoid performance issues during drag
