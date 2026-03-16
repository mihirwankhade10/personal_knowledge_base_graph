"use client";

import { ZoomIn, ZoomOut, Maximize2, RotateCcw } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface GraphControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFit: () => void;
  onRerunLayout: () => void;
  centerOnNode: (nodeId: string) => void;
}

export function GraphControls({
  onZoomIn,
  onZoomOut,
  onFit,
  onRerunLayout,
}: GraphControlsProps) {
  const controls = [
    { icon: ZoomIn, onClick: onZoomIn, label: "Zoom In" },
    { icon: ZoomOut, onClick: onZoomOut, label: "Zoom Out" },
    { icon: Maximize2, onClick: onFit, label: "Fit to Screen" },
    { icon: RotateCcw, onClick: onRerunLayout, label: "Re-run Layout" },
  ];

  return (
    <div className="absolute bottom-5 left-5 flex flex-col gap-0.5 glass rounded-xl p-1.5 animate-border-pulse z-10">
      {controls.map(({ icon: Icon, onClick, label }) => (
        <Tooltip key={label}>
          <TooltipTrigger
            className="control-btn h-8 w-8 flex items-center justify-center rounded-lg text-[#4a7a9f] transition-all duration-200 cursor-pointer"
            onClick={onClick}
          >
            <Icon className="h-4 w-4" />
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={8}>
            {label}
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}
