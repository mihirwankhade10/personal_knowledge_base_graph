"use client";

import { useEffect, useRef } from "react";
import cytoscape, { Core } from "cytoscape";
import { useGraphStore } from "@/lib/store";
import { toCytoscapeElements } from "@/lib/cytoscape-utils";
import { CATEGORY_COLORS } from "@/lib/constants";

interface GraphMinimapProps {
  mainCy: React.RefObject<Core | null>;
}

export function GraphMinimap({ mainCy }: GraphMinimapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const minimapCyRef = useRef<Core | null>(null);
  const nodes = useGraphStore((s) => s.nodes);
  const edges = useGraphStore((s) => s.edges);
  const isLoaded = useGraphStore((s) => s.isLoaded);

  useEffect(() => {
    if (!containerRef.current || !isLoaded) return;

    const cy = cytoscape({
      container: containerRef.current,
      elements: toCytoscapeElements(nodes, edges),
      style: [
        {
          selector: "node",
          style: {
            "background-color": "data(color)",
            width: 8,
            height: 8,
            label: "",
            "border-width": 0,
          },
        },
        {
          selector: "edge",
          style: {
            "line-color": "#374151",
            width: 1,
            "target-arrow-shape": "none",
            opacity: 0.3,
          },
        },
      ],
      layout: { name: "preset" },
      userPanningEnabled: false,
      userZoomingEnabled: false,
      boxSelectionEnabled: false,
      autoungrabify: true,
      autounselectify: true,
    });

    minimapCyRef.current = cy;
    cy.fit(undefined, 5);

    return () => {
      cy.destroy();
      minimapCyRef.current = null;
    };
  }, [isLoaded, nodes, edges]);

  // Sync positions from main cy
  useEffect(() => {
    const main = mainCy.current;
    const mini = minimapCyRef.current;
    if (!main || !mini) return;

    const syncPositions = () => {
      mini.batch(() => {
        main.nodes().forEach((mainNode) => {
          const miniNode = mini.getElementById(mainNode.id());
          if (miniNode.length > 0) {
            miniNode.position(mainNode.position());
          }
        });
      });
      mini.fit(undefined, 5);
    };

    main.on("layoutstop position", syncPositions);
    syncPositions();

    return () => {
      main.off("layoutstop position", syncPositions);
    };
  }, [mainCy, nodes]);

  return (
    <div className="absolute bottom-4 right-4 w-[180px] h-[120px] glass rounded-lg overflow-hidden border border-white/5">
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
}
