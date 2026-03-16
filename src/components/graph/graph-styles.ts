import { CATEGORY_COLORS } from "@/lib/constants";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const cytoscapeStyles: any[] = [
  // Base node style
  {
    selector: "node",
    style: {
      label: "data(label)",
      "text-valign": "center",
      "text-halign": "center",
      "background-color": "data(color)",
      "background-opacity": 0.15,
      color: "#e0e8ff",
      "font-size": "11px",
      "font-weight": "600",
      "font-family": "var(--font-geist-sans), Inter, system-ui, sans-serif",
      "text-wrap": "wrap",
      "text-max-width": "110px",
      width: "60px",
      height: "60px",
      shape: "round-rectangle",
      "border-width": "1.5px",
      "border-color": "data(color)",
      "border-opacity": 0.7,
      "shadow-blur": "20px",
      "shadow-color": "data(color)",
      "shadow-opacity": 0.5,
      "shadow-offset-x": "0px",
      "shadow-offset-y": "0px",
      "text-outline-color": "#050510",
      "text-outline-width": "3px",
      "overlay-padding": "8px",
      "transition-property":
        "background-color, border-color, shadow-opacity, shadow-blur, width, height, opacity, border-width",
      "transition-duration": "300ms",
      "transition-timing-function": "ease-in-out-sine",
      padding: "14px",
    },
  },

  // Node hover
  {
    selector: "node:active",
    style: {
      "overlay-color": "#00d4ff",
      "overlay-opacity": 0.06,
    },
  },

  // Selected node
  {
    selector: "node:selected",
    style: {
      "border-width": "2px",
      "border-color": "#00d4ff",
      "border-opacity": 1,
      "shadow-blur": "35px",
      "shadow-color": "#00d4ff",
      "shadow-opacity": 0.8,
      "background-opacity": 0.25,
      "z-index": 999,
    },
  },

  // Category-specific node styles
  ...Object.entries(CATEGORY_COLORS).map(
    ([category, color]) =>
      ({
        selector: `node[category="${category}"]`,
        style: {
          "background-color": color,
          "border-color": color,
          "shadow-color": color,
        },
      })
  ),

  // Highlighted node (connected to selected)
  {
    selector: "node.highlighted",
    style: {
      "background-opacity": 0.2,
      "border-opacity": 0.9,
      "shadow-opacity": 0.7,
      opacity: 1,
    },
  },

  // Dimmed node (not connected to selected)
  {
    selector: "node.dimmed",
    style: {
      opacity: 0.12,
      "shadow-opacity": 0,
    },
  },

  // Node entering animation start state
  {
    selector: "node.entering",
    style: {
      opacity: 0,
    },
  },

  // Base edge style
  {
    selector: "edge",
    style: {
      label: "data(label)",
      "curve-style": "bezier",
      "target-arrow-shape": "triangle",
      "target-arrow-color": "#1a3a5c",
      "line-color": "#1a3a5c",
      "line-opacity": 0.6,
      "line-style": "solid",
      width: "1.5px",
      "font-size": "9px",
      "font-family": "var(--font-geist-sans), Inter, system-ui, sans-serif",
      color: "#4a7a9f",
      "text-rotation": "autorotate",
      "text-margin-y": "-10px",
      "text-outline-color": "#050510",
      "text-outline-width": "3px",
      "text-background-color": "#050510",
      "text-background-opacity": 0.8,
      "text-background-padding": "4px",
      "text-background-shape": "roundrectangle",
      "arrow-scale": 1,
      "transition-property": "line-color, target-arrow-color, opacity, width",
      "transition-duration": "300ms",
      "overlay-padding": "4px",
    },
  },

  // Selected edge
  {
    selector: "edge:selected",
    style: {
      "line-color": "#00d4ff",
      "target-arrow-color": "#00d4ff",
      width: "2.5px",
      "line-opacity": 1,
      color: "#e0e8ff",
      "z-index": 999,
    },
  },

  // Highlighted edge (connected to selected node)
  {
    selector: "edge.highlighted",
    style: {
      "line-color": "#00d4ff",
      "target-arrow-color": "#00d4ff",
      "line-opacity": 0.8,
      width: "2px",
      color: "#8ac4de",
      opacity: 1,
    },
  },

  // Dimmed edge
  {
    selector: "edge.dimmed",
    style: {
      opacity: 0.06,
    },
  },
];
