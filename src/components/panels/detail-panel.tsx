"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, ArrowRight, Link } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGraphStore } from "@/lib/store";
import { CATEGORY_LABELS, CATEGORY_COLORS } from "@/lib/constants";
import { NodeCategory } from "@/lib/types";

interface DetailPanelProps {
  onCenterNode: (nodeId: string) => void;
}

const categories = Object.entries(CATEGORY_LABELS) as [NodeCategory, string][];

export function DetailPanel({ onCenterNode }: DetailPanelProps) {
  const selectedNodeId = useGraphStore((s) => s.selectedNodeId);
  const selectedEdgeId = useGraphStore((s) => s.selectedEdgeId);
  const nodes = useGraphStore((s) => s.nodes);
  const edges = useGraphStore((s) => s.edges);
  const updateNode = useGraphStore((s) => s.updateNode);
  const updateEdge = useGraphStore((s) => s.updateEdge);
  const deleteNode = useGraphStore((s) => s.deleteNode);
  const deleteEdge = useGraphStore((s) => s.deleteEdge);
  const selectNode = useGraphStore((s) => s.selectNode);
  const selectEdge = useGraphStore((s) => s.selectEdge);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);
  const selectedEdge = edges.find((e) => e.id === selectedEdgeId);

  const isOpen = !!(selectedNode || selectedEdge);

  // Get connected nodes/edges for selected node
  const connectedEdges = selectedNode
    ? edges.filter(
        (e) => e.source === selectedNode.id || e.target === selectedNode.id
      )
    : [];

  const connectedNodeIds = selectedNode
    ? new Set(
        connectedEdges
          .flatMap((e) => [e.source, e.target])
          .filter((id) => id !== selectedNode.id)
      )
    : new Set<string>();

  const connectedNodes = nodes.filter((n) => connectedNodeIds.has(n.id));

  const handleClose = () => {
    selectNode(null);
    selectEdge(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: 350, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 350, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="w-[320px] h-full glass-strong border-l border-white/5 flex flex-col shrink-0 z-40"
        >
          <ScrollArea className="flex-1">
            <div className="p-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  {selectedNode ? "Node Details" : "Edge Details"}
                </h2>
                <button
                  className="h-7 w-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors cursor-pointer"
                  onClick={handleClose}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Node details */}
              {selectedNode && (
                <div className="space-y-4">
                  {/* Category */}
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{
                        backgroundColor:
                          CATEGORY_COLORS[selectedNode.category],
                      }}
                    />
                    <select
                      value={selectedNode.category}
                      onChange={(e) =>
                        updateNode(selectedNode.id, {
                          category: e.target.value as NodeCategory,
                        })
                      }
                      className="h-7 px-1 text-xs bg-transparent border-none text-foreground outline-none cursor-pointer"
                    >
                      {categories.map(([key, label]) => (
                        <option key={key} value={key} className="bg-[#1a1a2e]">
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Title */}
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">
                      Title
                    </Label>
                    <Input
                      value={selectedNode.title}
                      onChange={(e) =>
                        updateNode(selectedNode.id, { title: e.target.value })
                      }
                      className="text-lg font-semibold h-auto py-2"
                    />
                  </div>

                  {/* Notes */}
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">
                      Notes
                    </Label>
                    <Textarea
                      value={selectedNode.notes}
                      onChange={(e) =>
                        updateNode(selectedNode.id, { notes: e.target.value })
                      }
                      rows={5}
                      className="resize-none text-sm leading-relaxed"
                      placeholder="Add notes about this topic..."
                    />
                  </div>

                  <Separator className="bg-white/5" />

                  {/* Connected nodes */}
                  {connectedNodes.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <Link className="h-3 w-3" />
                        Connected Nodes ({connectedNodes.length})
                      </Label>
                      <div className="flex flex-wrap gap-1.5">
                        {connectedNodes.map((node) => {
                          const edge = connectedEdges.find(
                            (e) =>
                              e.source === node.id || e.target === node.id
                          );
                          return (
                            <Badge
                              key={node.id}
                              variant="outline"
                              className="cursor-pointer hover:bg-white/10 transition-colors border-white/10 text-xs gap-1"
                              onClick={() => {
                                selectNode(node.id);
                                onCenterNode(node.id);
                              }}
                            >
                              <div
                                className="w-1.5 h-1.5 rounded-full"
                                style={{
                                  backgroundColor:
                                    CATEGORY_COLORS[node.category],
                                }}
                              />
                              {node.title}
                              {edge && (
                                <span className="text-muted-foreground ml-0.5">
                                  ({edge.label})
                                </span>
                              )}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <Separator className="bg-white/5" />

                  {/* Meta */}
                  <div className="text-xs text-muted-foreground">
                    Created{" "}
                    {new Date(selectedNode.createdAt).toLocaleDateString()}
                  </div>

                  {/* Delete */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 gap-2 cursor-pointer"
                    onClick={() => {
                      deleteNode(selectedNode.id);
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete Node
                  </Button>
                </div>
              )}

              {/* Edge details */}
              {selectedEdge && (
                <div className="space-y-4">
                  {/* Source → Target */}
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-white/5">
                    <Badge
                      variant="outline"
                      className="border-white/10 cursor-pointer hover:bg-white/10"
                      onClick={() => {
                        selectNode(selectedEdge.source);
                        onCenterNode(selectedEdge.source);
                      }}
                    >
                      {nodes.find((n) => n.id === selectedEdge.source)?.title ||
                        "Unknown"}
                    </Badge>
                    <ArrowRight className="h-3 w-3 text-muted-foreground shrink-0" />
                    <Badge
                      variant="outline"
                      className="border-white/10 cursor-pointer hover:bg-white/10"
                      onClick={() => {
                        selectNode(selectedEdge.target);
                        onCenterNode(selectedEdge.target);
                      }}
                    >
                      {nodes.find((n) => n.id === selectedEdge.target)?.title ||
                        "Unknown"}
                    </Badge>
                  </div>

                  {/* Label */}
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">
                      Relationship Label
                    </Label>
                    <Input
                      value={selectedEdge.label}
                      onChange={(e) =>
                        updateEdge(selectedEdge.id, { label: e.target.value })
                      }
                    />
                  </div>

                  <Separator className="bg-white/5" />

                  {/* Meta */}
                  <div className="text-xs text-muted-foreground">
                    Created{" "}
                    {new Date(selectedEdge.createdAt).toLocaleDateString()}
                  </div>

                  {/* Delete */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 gap-2 cursor-pointer"
                    onClick={() => {
                      deleteEdge(selectedEdge.id);
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete Edge
                  </Button>
                </div>
              )}
            </div>
          </ScrollArea>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
