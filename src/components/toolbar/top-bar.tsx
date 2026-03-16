"use client";

import { useRef } from "react";
import {
  Plus,
  Search,
  Download,
  Upload,
  RotateCcw,
  Network,
  MoreHorizontal,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useGraphStore } from "@/lib/store";
import { LAYOUT_OPTIONS } from "@/lib/constants";
import { exportToJSON, importFromJSON, clearLocalStorage } from "@/lib/persistence";
import { seedNodes, seedEdges } from "@/lib/seed-data";

interface TopBarProps {
  onCenterNode: (nodeId: string) => void;
  onOpenAddNode: () => void;
  onOpenAddEdge: () => void;
  onOpenSearch: () => void;
}

export function TopBar({ onOpenAddNode, onOpenAddEdge, onOpenSearch }: TopBarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const nodes = useGraphStore((s) => s.nodes);
  const edges = useGraphStore((s) => s.edges);
  const layoutName = useGraphStore((s) => s.layoutName);
  const setLayout = useGraphStore((s) => s.setLayout);
  const importData = useGraphStore((s) => s.importData);

  const handleExport = () => {
    exportToJSON(nodes, edges);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const data = await importFromJSON(file);
      importData(data);
    } catch (err) {
      console.error("Import failed:", err);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleReset = () => {
    clearLocalStorage();
    importData({ nodes: seedNodes, edges: seedEdges });
  };

  return (
    <header className="h-14 flex items-center justify-between px-5 glass-strong hud-border-bottom z-50 shrink-0">
      {/* Left: Logo + Stats */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5">
          <div className="relative w-9 h-9 rounded-lg bg-gradient-to-br from-[#00d4ff] to-[#bf5af2] flex items-center justify-center animate-glow-pulse">
            <Network className="h-4.5 w-4.5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold gradient-text leading-tight tracking-wide">
              Knowledge Graph
            </h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#30d158] animate-pulse-glow" />
              <p className="text-[10px] text-[#4a7a9f] leading-tight font-mono tracking-wider">
                {nodes.length} nodes &middot; {edges.length} edges
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Center: Layout selector + Search */}
      <div className="flex-1 flex items-center justify-center gap-3 max-w-lg mx-4">
        {/* Layout selector */}
        <div className="flex items-center gap-1 h-8 px-1 bg-white/[0.03] border border-white/[0.06] rounded-lg shrink-0">
          {LAYOUT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setLayout(opt.value)}
              className={`h-6 px-2.5 text-[10px] font-medium rounded-md transition-all duration-200 cursor-pointer tracking-wide whitespace-nowrap shrink-0 ${
                layoutName === opt.value
                  ? "bg-[#00d4ff]/15 text-[#00d4ff] shadow-[0_0_10px_rgba(0,212,255,0.15)]"
                  : "text-[#4a7a9f] hover:text-[#8ac4de] hover:bg-white/[0.03]"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <button
          className="h-8 px-3 text-[#4a7a9f] hover:text-[#8ac4de] bg-white/[0.03] border border-white/[0.06] hover:border-[#00d4ff]/20 rounded-lg flex items-center gap-2 text-xs transition-all duration-200 cursor-pointer min-w-[180px]"
          onClick={onOpenSearch}
        >
          <Search className="h-3.5 w-3.5" />
          <span className="font-mono text-[10px] tracking-wider">Search nodes...</span>
          <Badge
            variant="outline"
            className="ml-auto text-[9px] px-1.5 py-0 h-4 border-white/[0.08] text-[#4a7a9f] font-mono"
          >
            /
          </Badge>
        </button>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1.5">
        {/* Add Node */}
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-3 text-[10px] gap-1.5 font-medium tracking-wider text-[#4a7a9f] hover:bg-[#00d4ff]/10 hover:text-[#00d4ff] cursor-pointer transition-all duration-200"
          onClick={onOpenAddNode}
        >
          <Plus className="h-3.5 w-3.5" />
          Node
        </Button>

        {/* Add Edge */}
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-3 text-[10px] gap-1.5 font-medium tracking-wider text-[#4a7a9f] hover:bg-[#bf5af2]/10 hover:text-[#bf5af2] cursor-pointer transition-all duration-200"
          onClick={onOpenAddEdge}
        >
          <Zap className="h-3.5 w-3.5" />
          Edge
        </Button>

        <div className="w-px h-5 bg-white/[0.06] mx-1" />

        {/* More menu */}
        <DropdownMenu>
          <DropdownMenuTrigger className="h-8 w-8 flex items-center justify-center rounded-lg text-[#4a7a9f] hover:text-[#00d4ff] hover:bg-[#00d4ff]/10 transition-all duration-200 cursor-pointer">
            <MoreHorizontal className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export JSON
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
              <Upload className="h-4 w-4 mr-2" />
              Import JSON
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleReset}
              variant="destructive"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset to Seed Data
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={handleImport}
      />
    </header>
  );
}
