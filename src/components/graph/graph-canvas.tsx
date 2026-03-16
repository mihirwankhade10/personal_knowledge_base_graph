"use client";

import { useRef } from "react";
import { useGraph } from "@/hooks/use-graph";
import { GraphControls } from "./graph-controls";
import { GraphMinimap } from "./graph-minimap";

export default function GraphCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { cyRef, fitGraph, zoomIn, zoomOut, centerOnNode, rerunLayout } =
    useGraph(containerRef);

  return (
    <div className="relative w-full h-full graph-container">
      {/* HUD corner brackets */}
      <div className="hud-corner hud-corner--tl" />
      <div className="hud-corner hud-corner--tr" />
      <div className="hud-corner hud-corner--bl" />
      <div className="hud-corner hud-corner--br" />

      {/* Main graph */}
      <div ref={containerRef} className="cytoscape-container w-full h-full" />

      {/* Controls */}
      <GraphControls
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onFit={fitGraph}
        onRerunLayout={rerunLayout}
        centerOnNode={centerOnNode}
      />

      {/* Minimap */}
      <GraphMinimap mainCy={cyRef} />
    </div>
  );
}
