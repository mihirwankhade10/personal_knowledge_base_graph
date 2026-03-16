import { KBNode, KBEdge } from "./types";
import { CATEGORY_COLORS } from "./constants";
import type { ElementDefinition } from "cytoscape";

export function nodesToCytoscapeElements(nodes: KBNode[]): ElementDefinition[] {
  return nodes.map((node) => ({
    data: {
      id: node.id,
      label: node.title,
      notes: node.notes,
      category: node.category,
      color: CATEGORY_COLORS[node.category],
    },
    position: node.position ? { x: node.position.x, y: node.position.y } : undefined,
  }));
}

export function edgesToCytoscapeElements(edges: KBEdge[]): ElementDefinition[] {
  return edges.map((edge) => ({
    data: {
      id: edge.id,
      source: edge.source,
      target: edge.target,
      label: edge.label,
    },
  }));
}

export function toCytoscapeElements(
  nodes: KBNode[],
  edges: KBEdge[]
): ElementDefinition[] {
  return [
    ...nodesToCytoscapeElements(nodes),
    ...edgesToCytoscapeElements(edges),
  ];
}
