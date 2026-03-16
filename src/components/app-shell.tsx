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
  }, []);

  if (!isLoaded) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#050510]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00d4ff] to-[#bf5af2] flex items-center justify-center loading-icon">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <div className="loading-ring" />
          </div>
          <div className="text-center">
            <p className="text-xs font-mono text-[#00d4ff]/60 tracking-[0.3em] uppercase">
              Initializing
            </p>
            <p className="text-[10px] font-mono text-[#4a7a9f] mt-1 tracking-wider">
              Loading knowledge graph...
            </p>
          </div>
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
