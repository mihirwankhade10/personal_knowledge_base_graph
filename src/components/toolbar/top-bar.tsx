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
    <header className="h-14 flex items-center justify-between px-4 glass-strong border-b border-white/5 z-50 shrink-0">
      {/* Left: Logo + Stats */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center">
            <Network className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-semibold gradient-text leading-tight">
              Knowledge Graph
            </h1>
            <p className="text-[10px] text-muted-foreground leading-tight">
              {nodes.length} nodes &middot; {edges.length} edges
            </p>
          </div>
        </div>
      </div>

      {/* Center: Search */}
      <div className="flex-1 flex justify-center max-w-md mx-4">
        <button
          className="w-full max-w-sm h-8 px-3 text-muted-foreground hover:text-foreground glass rounded-lg flex items-center gap-2 text-xs transition-colors cursor-pointer"
          onClick={onOpenSearch}
        >
          <Search className="h-3.5 w-3.5" />
          <span>Search nodes...</span>
          <Badge
            variant="outline"
            className="ml-auto text-[10px] px-1.5 py-0 h-5 border-white/10"
          >
            Ctrl+K
          </Badge>
        </button>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1.5">
        {/* Layout selector */}
        <select
          value={layoutName}
          onChange={(e) => setLayout(e.target.value)}
          className="h-8 px-2 text-xs bg-white/5 border border-white/10 rounded-lg text-foreground outline-none cursor-pointer hover:bg-white/10 transition-colors"
        >
          {LAYOUT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-[#1a1a2e]">
              {opt.label}
            </option>
          ))}
        </select>

        <div className="w-px h-6 bg-white/10 mx-1" />

        {/* Add Node */}
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-3 text-xs gap-1.5 hover:bg-blue-500/10 hover:text-blue-400 cursor-pointer"
          onClick={onOpenAddNode}
        >
          <Plus className="h-3.5 w-3.5" />
          Node
        </Button>

        {/* Add Edge */}
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-3 text-xs gap-1.5 hover:bg-violet-500/10 hover:text-violet-400 cursor-pointer"
          onClick={onOpenAddEdge}
        >
          <Plus className="h-3.5 w-3.5" />
          Edge
        </Button>

        <div className="w-px h-6 bg-white/10 mx-1" />

        {/* More menu */}
        <DropdownMenu>
          <DropdownMenuTrigger className="h-8 w-8 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors cursor-pointer">
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
