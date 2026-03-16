export type NodeCategory =
  | "framework"
  | "language"
  | "concept"
  | "tooling"
  | "pattern"
  | "other";

export interface KBNode {
  id: string;
  title: string;
  notes: string;
  category: NodeCategory;
  position?: { x: number; y: number };
  createdAt: number;
}

export interface KBEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  createdAt: number;
}

export interface GraphState {
  nodes: KBNode[];
  edges: KBEdge[];
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  layoutName: string;
  isLoaded: boolean;

  // Actions
  addNode: (node: Omit<KBNode, "id" | "createdAt">) => void;
  updateNode: (id: string, patch: Partial<KBNode>) => void;
  deleteNode: (id: string) => void;
  addEdge: (edge: Omit<KBEdge, "id" | "createdAt">) => void;
  updateEdge: (id: string, patch: Partial<KBEdge>) => void;
  deleteEdge: (id: string) => void;
  selectNode: (id: string | null) => void;
  selectEdge: (id: string | null) => void;
  setLayout: (name: string) => void;
  setNodes: (nodes: KBNode[]) => void;
  setEdges: (edges: KBEdge[]) => void;
  setIsLoaded: (loaded: boolean) => void;
  importData: (data: { nodes: KBNode[]; edges: KBEdge[] }) => void;
}
