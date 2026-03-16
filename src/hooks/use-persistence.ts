"use client";

import { useEffect, useRef } from "react";
import { useGraphStore } from "@/lib/store";
import { saveToLocalStorage, loadFromLocalStorage } from "@/lib/persistence";
import { seedNodes, seedEdges } from "@/lib/seed-data";

export function usePersistence() {
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLoaded = useGraphStore((s) => s.isLoaded);

  // Load on mount
  useEffect(() => {
    const stored = loadFromLocalStorage();
    if (stored && stored.nodes.length > 0) {
      useGraphStore.getState().setNodes(stored.nodes);
      useGraphStore.getState().setEdges(stored.edges);
      if (stored.layoutName) {
        useGraphStore.getState().setLayout(stored.layoutName);
      }
    } else {
      useGraphStore.getState().setNodes(seedNodes);
      useGraphStore.getState().setEdges(seedEdges);
    }
    useGraphStore.getState().setIsLoaded(true);
  }, []);

  // Auto-save on changes (debounced)
  useEffect(() => {
    if (!isLoaded) return;

    const unsub = useGraphStore.subscribe((state) => {
      if (!state.isLoaded) return;
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        saveToLocalStorage(state.nodes, state.edges, state.layoutName);
      }, 500);
    });

    return () => {
      unsub();
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [isLoaded]);
}
