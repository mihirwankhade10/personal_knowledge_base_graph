"use client";

import { useEffect, useRef, useCallback } from "react";
import cytoscape, { Core, NodeSingular } from "cytoscape";
import dagre from "cytoscape-dagre";
import { useGraphStore } from "@/lib/store";
import { toCytoscapeElements } from "@/lib/cytoscape-utils";
import { cytoscapeStyles } from "@/components/graph/graph-styles";
import { CATEGORY_COLORS } from "@/lib/constants";

// Register dagre layout
if (typeof window !== "undefined") {
  try {
    cytoscape.use(dagre);
  } catch {
    // Already registered
  }
}

export function useGraph(containerRef: React.RefObject<HTMLDivElement | null>) {
  const cyRef = useRef<Core | null>(null);
  const skipSyncRef = useRef(false);

  const nodes = useGraphStore((s) => s.nodes);
  const edges = useGraphStore((s) => s.edges);
  const layoutName = useGraphStore((s) => s.layoutName);
  const isLoaded = useGraphStore((s) => s.isLoaded);
  const selectedNodeId = useGraphStore((s) => s.selectedNodeId);
  const selectedEdgeId = useGraphStore((s) => s.selectedEdgeId);

  // Initialize Cytoscape
  useEffect(() => {
    if (!containerRef.current || !isLoaded) return;
    if (cyRef.current) return; // Already initialized

    const cy = cytoscape({
      container: containerRef.current,
      style: cytoscapeStyles,
      elements: toCytoscapeElements(nodes, edges),
      layout: { name: "preset" }, // Use preset first, run layout after
      minZoom: 0.3,
      maxZoom: 3,
      wheelSensitivity: 0.3,
      boxSelectionEnabled: false,
      selectionType: "single",
    });

    // Event handlers
    cy.on("tap", "node", (evt) => {
      const nodeId = evt.target.id();
      useGraphStore.getState().selectNode(nodeId);
    });

    cy.on("tap", "edge", (evt) => {
      const edgeId = evt.target.id();
      useGraphStore.getState().selectEdge(edgeId);
    });

    cy.on("tap", (evt) => {
      if (evt.target === cy) {
        useGraphStore.getState().selectNode(null);
        useGraphStore.getState().selectEdge(null);
      }
    });

    cy.on("dragfree", "node", (evt) => {
      const node = evt.target as NodeSingular;
      const pos = node.position();
      skipSyncRef.current = true;
      useGraphStore.getState().updateNode(node.id(), {
        position: { x: pos.x, y: pos.y },
      });
      setTimeout(() => {
        skipSyncRef.current = false;
      }, 100);
    });

    cyRef.current = cy;

    // Check if any nodes have positions
    const hasPositions = nodes.some((n) => n.position);
    if (!hasPositions) {
      // Run initial layout
      runLayout(cy, layoutName);
    } else {
      cy.fit(undefined, 50);
    }

    return () => {
      cy.destroy();
      cyRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, containerRef]);

  // Sync store changes to Cytoscape
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy || !isLoaded || skipSyncRef.current) return;

    cy.batch(() => {
      // Get current cy element IDs
      const cyNodeIds = new Set(cy.nodes().map((n) => n.id()));
      const cyEdgeIds = new Set(cy.edges().map((e) => e.id()));

      // Add/update nodes
      const storeNodeIds = new Set(nodes.map((n) => n.id));
      for (const node of nodes) {
        if (cyNodeIds.has(node.id)) {
          // Update existing
          const cyNode = cy.getElementById(node.id);
          cyNode.data("label", node.title);
          cyNode.data("notes", node.notes);
          cyNode.data("category", node.category);
          cyNode.data("color", CATEGORY_COLORS[node.category]);
        } else {
          // Add new node
          const newNode = cy.add({
            data: {
              id: node.id,
              label: node.title,
              notes: node.notes,
              category: node.category,
              color: CATEGORY_COLORS[node.category],
            },
            position: node.position || {
              x: Math.random() * 400 + 200,
              y: Math.random() * 400 + 200,
            },
          });
          // Animate entry
          newNode.style("opacity", 0);
          newNode.animate(
            { style: { opacity: 1 } },
            { duration: 400, easing: "ease-out-cubic" }
          );
        }
      }

      // Remove nodes no longer in store
      cyNodeIds.forEach((id) => {
        if (!storeNodeIds.has(id)) {
          const el = cy.getElementById(id);
          el.animate(
            { style: { opacity: 0 } },
            {
              duration: 300,
              easing: "ease-in-cubic",
              complete: () => {
                cy.remove(el);
              },
            }
          );
        }
      });

      // Add/update edges
      const storeEdgeIds = new Set(edges.map((e) => e.id));
      for (const edge of edges) {
        if (cyEdgeIds.has(edge.id)) {
          const cyEdge = cy.getElementById(edge.id);
          cyEdge.data("label", edge.label);
        } else {
          // Only add if both source and target exist
          if (storeNodeIds.has(edge.source) && storeNodeIds.has(edge.target)) {
            const newEdge = cy.add({
              data: {
                id: edge.id,
                source: edge.source,
                target: edge.target,
                label: edge.label,
              },
            });
            newEdge.style("opacity", 0);
            newEdge.animate(
              { style: { opacity: 1 } },
              { duration: 400, easing: "ease-out-cubic" }
            );
          }
        }
      }

      // Remove edges no longer in store
      cyEdgeIds.forEach((id) => {
        if (!storeEdgeIds.has(id)) {
          cy.remove(cy.getElementById(id));
        }
      });
    });
  }, [nodes, edges, isLoaded]);

  // Handle selection highlighting
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;

    // Clear previous highlighting
    cy.elements().removeClass("highlighted dimmed");

    if (selectedNodeId) {
      const selectedNode = cy.getElementById(selectedNodeId);
      if (selectedNode.length > 0) {
        selectedNode.select();
        const connected = selectedNode.neighborhood().add(selectedNode);
        cy.elements().not(connected).addClass("dimmed");
        connected.addClass("highlighted");
      }
    } else {
      cy.nodes().deselect();
    }

    if (selectedEdgeId) {
      const selectedEdge = cy.getElementById(selectedEdgeId);
      if (selectedEdge.length > 0) {
        selectedEdge.select();
      }
    } else {
      cy.edges().deselect();
    }
  }, [selectedNodeId, selectedEdgeId]);

  // Handle layout changes
  const prevLayoutRef = useRef(layoutName);
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy || !isLoaded) return;
    if (prevLayoutRef.current === layoutName) return;
    prevLayoutRef.current = layoutName;
    runLayout(cy, layoutName);
  }, [layoutName, isLoaded]);

  const runLayout = useCallback((cy: Core, name: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const layoutOptions: Record<string, any> = {
      dagre: {
        name: "dagre",
        rankDir: "TB",
        nodeSep: 80,
        rankSep: 100,
        animate: true,
        animationDuration: 500,
        animationEasing: "ease-in-out-cubic",
        fit: true,
        padding: 50,
      },
      cose: {
        name: "cose",
        animate: true,
        animationDuration: 500,
        animationEasing: "ease-in-out-cubic",
        fit: true,
        padding: 50,
        nodeRepulsion: () => 8000,
        idealEdgeLength: () => 120,
        edgeElasticity: () => 100,
        gravity: 0.25,
        numIter: 1000,
      },
      circle: {
        name: "circle",
        animate: true,
        animationDuration: 500,
        animationEasing: "ease-in-out-cubic",
        fit: true,
        padding: 50,
      },
      grid: {
        name: "grid",
        animate: true,
        animationDuration: 500,
        animationEasing: "ease-in-out-cubic",
        fit: true,
        padding: 50,
        rows: 3,
      },
      breadthfirst: {
        name: "breadthfirst",
        animate: true,
        animationDuration: 500,
        animationEasing: "ease-in-out-cubic",
        fit: true,
        padding: 50,
        directed: true,
        spacingFactor: 1.5,
      },
    };

    const options = layoutOptions[name] || layoutOptions.dagre;
    cy.layout(options).run();
  }, []);

  const fitGraph = useCallback(() => {
    cyRef.current?.animate({
      fit: { eles: cyRef.current.elements(), padding: 50 },
      duration: 400,
      easing: "ease-in-out-cubic",
    });
  }, []);

  const zoomIn = useCallback(() => {
    const cy = cyRef.current;
    if (!cy) return;
    cy.animate({
      zoom: cy.zoom() * 1.3,
      center: { eles: cy.elements() },
      duration: 300,
    });
  }, []);

  const zoomOut = useCallback(() => {
    const cy = cyRef.current;
    if (!cy) return;
    cy.animate({
      zoom: cy.zoom() / 1.3,
      center: { eles: cy.elements() },
      duration: 300,
    });
  }, []);

  const centerOnNode = useCallback((nodeId: string) => {
    const cy = cyRef.current;
    if (!cy) return;
    const node = cy.getElementById(nodeId);
    if (node.length > 0) {
      cy.animate({
        center: { eles: node },
        zoom: 1.5,
        duration: 500,
        easing: "ease-in-out-cubic",
      });
    }
  }, []);

  const rerunLayout = useCallback(() => {
    const cy = cyRef.current;
    if (!cy) return;
    runLayout(cy, useGraphStore.getState().layoutName);
  }, [runLayout]);

  return {
    cyRef,
    fitGraph,
    zoomIn,
    zoomOut,
    centerOnNode,
    rerunLayout,
  };
}
