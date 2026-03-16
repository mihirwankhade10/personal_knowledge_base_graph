"use client";

import { useRef } from "react";
import { useGraph } from "@/hooks/use-graph";
import { GraphControls } from "./graph-controls";

export default function GraphCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { fitGraph, zoomIn, zoomOut, centerOnNode, rerunLayout } =
    useGraph(containerRef);

  return (
    <div className="relative w-full h-full graph-container">
      <div ref={containerRef} className="cytoscape-container w-full h-full" />
      <GraphControls
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onFit={fitGraph}
        onRerunLayout={rerunLayout}
        centerOnNode={centerOnNode}
      />
    </div>
  );
}
