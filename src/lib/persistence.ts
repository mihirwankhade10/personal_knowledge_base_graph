import { KBNode, KBEdge } from "./types";
import { STORAGE_KEY, STORAGE_VERSION } from "./constants";

interface StoredData {
  version: number;
  nodes: KBNode[];
  edges: KBEdge[];
  layoutName?: string;
}

export function saveToLocalStorage(
  nodes: KBNode[],
  edges: KBEdge[],
  layoutName: string
): void {
  try {
    const data: StoredData = {
      version: STORAGE_VERSION,
      nodes,
      edges,
      layoutName,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    console.warn("Failed to save to localStorage");
  }
}

export function loadFromLocalStorage(): StoredData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as StoredData;
    if (!data.nodes || !Array.isArray(data.nodes)) return null;
    return data;
  } catch {
    return null;
  }
}

export function clearLocalStorage(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function exportToJSON(nodes: KBNode[], edges: KBEdge[]): void {
  const data = { version: STORAGE_VERSION, nodes, edges };
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `knowledge-graph-${new Date().toISOString().split("T")[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importFromJSON(file: File): Promise<{ nodes: KBNode[]; edges: KBEdge[] }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (!data.nodes || !Array.isArray(data.nodes)) {
          reject(new Error("Invalid file format"));
          return;
        }
        resolve({ nodes: data.nodes, edges: data.edges || [] });
      } catch {
        reject(new Error("Failed to parse JSON"));
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file);
  });
}
