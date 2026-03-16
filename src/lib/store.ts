import { create } from "zustand";
import { GraphState, KBNode, KBEdge } from "./types";

let idCounter = 100;
function generateId(): string {
  return `node_${Date.now()}_${idCounter++}`;
}

function generateEdgeId(): string {
  return `edge_${Date.now()}_${idCounter++}`;
}

export const useGraphStore = create<GraphState>((set) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,
  selectedEdgeId: null,
  layoutName: "dagre",
  isLoaded: false,

  addNode: (nodeData) => {
    const newNode: KBNode = {
      ...nodeData,
      id: generateId(),
      createdAt: Date.now(),
    };
    set((state) => ({ nodes: [...state.nodes, newNode] }));
  },

  updateNode: (id, patch) => {
    set((state) => ({
      nodes: state.nodes.map((n) => (n.id === id ? { ...n, ...patch } : n)),
    }));
  },

  deleteNode: (id) => {
    set((state) => ({
      nodes: state.nodes.filter((n) => n.id !== id),
      edges: state.edges.filter((e) => e.source !== id && e.target !== id),
      selectedNodeId: state.selectedNodeId === id ? null : state.selectedNodeId,
    }));
  },

  addEdge: (edgeData) => {
    const newEdge: KBEdge = {
      ...edgeData,
      id: generateEdgeId(),
      createdAt: Date.now(),
    };
    set((state) => ({ edges: [...state.edges, newEdge] }));
  },

  updateEdge: (id, patch) => {
    set((state) => ({
      edges: state.edges.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    }));
  },

  deleteEdge: (id) => {
    set((state) => ({
      edges: state.edges.filter((e) => e.id !== id),
      selectedEdgeId: state.selectedEdgeId === id ? null : state.selectedEdgeId,
    }));
  },

  selectNode: (id) => {
    set({ selectedNodeId: id, selectedEdgeId: null });
  },

  selectEdge: (id) => {
    set({ selectedEdgeId: id, selectedNodeId: null });
  },

  setLayout: (name) => {
    set({ layoutName: name });
  },

  setNodes: (nodes) => {
    set({ nodes });
  },

  setEdges: (edges) => {
    set({ edges });
  },

  setIsLoaded: (loaded) => {
    set({ isLoaded: loaded });
  },

  importData: (data) => {
    set({
      nodes: data.nodes,
      edges: data.edges,
      selectedNodeId: null,
      selectedEdgeId: null,
    });
  },
}));
