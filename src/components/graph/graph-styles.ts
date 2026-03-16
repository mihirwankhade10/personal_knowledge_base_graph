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
      "background-opacity": 0.9,
      color: "#ffffff",
      "font-size": "12px",
      "font-weight": "600",
      "font-family": "Inter, system-ui, sans-serif",
      "text-wrap": "wrap",
      "text-max-width": "100px",
      width: "50px",
      height: "50px",
      shape: "round-rectangle",
      "border-width": "2px",
      "border-color": "data(color)",
      "border-opacity": 0.6,
      "shadow-blur": "12px",
      "shadow-color": "data(color)",
      "shadow-opacity": 0.4,
      "shadow-offset-x": "0px",
      "shadow-offset-y": "0px",
      "text-outline-color": "#0a0a0f",
      "text-outline-width": "2px",
      "overlay-padding": "6px",
      "transition-property":
        "background-color, border-color, shadow-opacity, width, height, opacity",
      "transition-duration": "300ms",
      "transition-timing-function": "ease-in-out-sine",
      "padding": "12px",
    },
  },

  // Node hover
  {
    selector: "node:active",
    style: {
      "overlay-color": "#ffffff",
      "overlay-opacity": 0.08,
    },
  },

  // Selected node
  {
    selector: "node:selected",
    style: {
      "border-width": "3px",
      "border-color": "#ffffff",
      "border-opacity": 1,
      "shadow-blur": "24px",
      "shadow-opacity": 0.7,
      "background-opacity": 1,
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
      "background-opacity": 1,
      "border-opacity": 1,
      "shadow-opacity": 0.6,
      opacity: 1,
    },
  },

  // Dimmed node (not connected to selected)
  {
    selector: "node.dimmed",
    style: {
      opacity: 0.2,
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
      "target-arrow-color": "#4b5563",
      "line-color": "#4b5563",
      "line-opacity": 0.6,
      width: "2px",
      "font-size": "10px",
      "font-family": "Inter, system-ui, sans-serif",
      color: "#9ca3af",
      "text-rotation": "autorotate",
      "text-margin-y": "-10px",
      "text-outline-color": "#0a0a0f",
      "text-outline-width": "2px",
      "text-background-color": "#0a0a0f",
      "text-background-opacity": 0.7,
      "text-background-padding": "3px",
      "text-background-shape": "roundrectangle",
      "arrow-scale": 1.2,
      "transition-property": "line-color, target-arrow-color, opacity, width",
      "transition-duration": "300ms",
      "overlay-padding": "4px",
    },
  },

  // Selected edge
  {
    selector: "edge:selected",
    style: {
      "line-color": "#60a5fa",
      "target-arrow-color": "#60a5fa",
      width: "3px",
      "line-opacity": 1,
      color: "#ffffff",
      "z-index": 999,
    },
  },

  // Highlighted edge (connected to selected node)
  {
    selector: "edge.highlighted",
    style: {
      "line-color": "#60a5fa",
      "target-arrow-color": "#60a5fa",
      "line-opacity": 0.9,
      width: "2.5px",
      color: "#d1d5db",
      opacity: 1,
    },
  },

  // Dimmed edge
  {
    selector: "edge.dimmed",
    style: {
      opacity: 0.1,
    },
  },
];
