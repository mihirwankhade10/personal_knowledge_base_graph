"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { usePersistence } from "@/hooks/use-persistence";
import { useKeyboard } from "@/hooks/use-keyboard";
import { useGraphStore } from "@/lib/store";
import { TopBar } from "@/components/toolbar/top-bar";
import { DetailPanel } from "@/components/panels/detail-panel";
import { AddNodeDialog } from "@/components/panels/add-node-dialog";
import { AddEdgeDialog } from "@/components/panels/add-edge-dialog";
import { SearchCommand } from "@/components/panels/search-command";

const GraphCanvas = dynamic(
  () => import("@/components/graph/graph-canvas"),
  { ssr: false }
);

export function AppShell() {
  const [addNodeOpen, setAddNodeOpen] = useState(false);
  const [addEdgeOpen, setAddEdgeOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Initialize persistence (load from localStorage or seed data)
  usePersistence();

  const isLoaded = useGraphStore((s) => s.isLoaded);

  // Keyboard shortcuts
  useKeyboard({
    onOpenSearch: () => setSearchOpen(true),
    onOpenAddNode: () => setAddNodeOpen(true),
    onOpenAddEdge: () => setAddEdgeOpen(true),
  });

  const handleCenterNode = useCallback((_nodeId: string) => {
    // centerOnNode is handled via the graph's internal hook
    // This is a placeholder for the TopBar/DetailPanel callbacks
  }, []);

  if (!isLoaded) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#07070f]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 animate-pulse" />
          <p className="text-sm text-muted-foreground">Loading graph...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      <TopBar
        onCenterNode={handleCenterNode}
        onOpenAddNode={() => setAddNodeOpen(true)}
        onOpenAddEdge={() => setAddEdgeOpen(true)}
        onOpenSearch={() => setSearchOpen(true)}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Graph Canvas */}
        <div className="flex-1 relative">
          <GraphCanvas />
        </div>

        {/* Detail Panel */}
        <DetailPanel onCenterNode={handleCenterNode} />
      </div>

      {/* Dialogs */}
      <AddNodeDialog open={addNodeOpen} onOpenChange={setAddNodeOpen} />
      <AddEdgeDialog open={addEdgeOpen} onOpenChange={setAddEdgeOpen} />
      <SearchCommand
        open={searchOpen}
        onOpenChange={setSearchOpen}
        onSelectNode={(nodeId) => {
          useGraphStore.getState().selectNode(nodeId);
          handleCenterNode(nodeId);
          setSearchOpen(false);
        }}
      />
    </div>
  );
}
