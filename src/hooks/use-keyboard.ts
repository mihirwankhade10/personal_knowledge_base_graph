"use client";

import { useEffect } from "react";
import { useGraphStore } from "@/lib/store";

interface UseKeyboardOptions {
  onOpenSearch: () => void;
  onOpenAddNode: () => void;
  onOpenAddEdge: () => void;
}

export function useKeyboard({
  onOpenSearch,
  onOpenAddNode,
  onOpenAddEdge,
}: UseKeyboardOptions) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      // Cmd/Ctrl + K: Search
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpenSearch();
        return;
      }

      // Skip single-key shortcuts when in input
      if (isInput) return;

      switch (e.key) {
        case "n":
        case "N":
          e.preventDefault();
          onOpenAddNode();
          break;
        case "e":
        case "E":
          e.preventDefault();
          onOpenAddEdge();
          break;
        case "Delete":
        case "Backspace": {
          const state = useGraphStore.getState();
          if (state.selectedNodeId) {
            state.deleteNode(state.selectedNodeId);
          } else if (state.selectedEdgeId) {
            state.deleteEdge(state.selectedEdgeId);
          }
          break;
        }
        case "Escape": {
          useGraphStore.getState().selectNode(null);
          useGraphStore.getState().selectEdge(null);
          break;
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onOpenSearch, onOpenAddNode, onOpenAddEdge]);
}
