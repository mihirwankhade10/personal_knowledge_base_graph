"use client";

import { useEffect, useRef } from "react";
import cytoscape, { Core } from "cytoscape";
import { useGraphStore } from "@/lib/store";
import { toCytoscapeElements } from "@/lib/cytoscape-utils";

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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      style: [
        {
          selector: "node",
          style: {
            "background-color": "data(color)",
            width: 6,
            height: 6,
            label: "",
            "border-width": 0,
            "shadow-blur": "8px",
            "shadow-color": "data(color)",
            "shadow-opacity": 0.6,
            "shadow-offset-x": "0px",
            "shadow-offset-y": "0px",
          },
        },
        {
          selector: "edge",
          style: {
            "line-color": "#0a2a4a",
            width: 0.5,
            "target-arrow-shape": "none",
            opacity: 0.4,
          },
        },
      ] as any[],
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
    <div className="absolute bottom-5 right-5 w-[160px] h-[160px] z-10">
      {/* Radar container */}
      <div className="relative w-full h-full rounded-full glass overflow-hidden animate-border-pulse">
        {/* Radar sweep */}
        <div className="minimap-radar absolute inset-0 rounded-full" />

        {/* Concentric rings */}
        <div
          className="minimap-ring"
          style={{ inset: "25%", opacity: 0.5 }}
        />
        <div
          className="minimap-ring"
          style={{ inset: "40%", opacity: 0.3 }}
        />

        {/* Cross-hair lines */}
        <div className="absolute top-1/2 left-2 right-2 h-px bg-[#00d4ff]/10 z-1" />
        <div className="absolute left-1/2 top-2 bottom-2 w-px bg-[#00d4ff]/10 z-1" />

        {/* Graph minimap */}
        <div ref={containerRef} className="absolute inset-2 rounded-full overflow-hidden z-3" />

        {/* Label */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[7px] font-mono text-[#00d4ff]/40 tracking-widest uppercase z-4">
          RADAR
        </div>
      </div>
    </div>
  );
}
