"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGraphStore } from "@/lib/store";
import { EDGE_LABEL_PRESETS, CATEGORY_COLORS } from "@/lib/constants";
import { NodeCategory } from "@/lib/types";

interface AddEdgeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddEdgeDialog({ open, onOpenChange }: AddEdgeDialogProps) {
  const [source, setSource] = useState("");
  const [target, setTarget] = useState("");
  const [label, setLabel] = useState("");
  const [customLabel, setCustomLabel] = useState("");

  const nodes = useGraphStore((s) => s.nodes);
  const addEdge = useGraphStore((s) => s.addEdge);

  const effectiveLabel = label === "__custom__" ? customLabel : label;
  const isValid =
    source && target && source !== target && effectiveLabel.trim();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    addEdge({
      source,
      target,
      label: effectiveLabel.trim(),
    });

    setSource("");
    setTarget("");
    setLabel("");
    setCustomLabel("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#bf5af2] shadow-[0_0_8px_rgba(191,90,242,0.5)]" />
            Add New Edge
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Source Node</Label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full h-8 px-2 text-sm bg-white/5 border border-white/10 rounded-lg text-foreground outline-none cursor-pointer"
            >
              <option value="" className="bg-[#0a0f1e]">Select source node...</option>
              {nodes.map((node) => (
                <option key={node.id} value={node.id} className="bg-[#0a0f1e]">
                  {node.title}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label>Target Node</Label>
            <select
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="w-full h-8 px-2 text-sm bg-white/5 border border-white/10 rounded-lg text-foreground outline-none cursor-pointer"
            >
              <option value="" className="bg-[#0a0f1e]">Select target node...</option>
              {nodes
                .filter((n) => n.id !== source)
                .map((node) => (
                  <option key={node.id} value={node.id} className="bg-[#0a0f1e]">
                    {node.title}
                  </option>
                ))}
            </select>
            {source && target && source === target && (
              <p className="text-xs text-destructive">
                Source and target must be different
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Relationship Label</Label>
            <select
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full h-8 px-2 text-sm bg-white/5 border border-white/10 rounded-lg text-foreground outline-none cursor-pointer"
            >
              <option value="" className="bg-[#0a0f1e]">Select a label...</option>
              {EDGE_LABEL_PRESETS.map((preset) => (
                <option key={preset} value={preset} className="bg-[#0a0f1e]">
                  {preset}
                </option>
              ))}
              <option value="__custom__" className="bg-[#0a0f1e]">Custom label...</option>
            </select>
            {label === "__custom__" && (
              <Input
                placeholder="Enter custom label..."
                value={customLabel}
                onChange={(e) => setCustomLabel(e.target.value)}
                className="mt-2"
                autoFocus
              />
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isValid}
              className="bg-[#bf5af2]/20 hover:bg-[#bf5af2]/30 text-[#bf5af2] border border-[#bf5af2]/30 hover:border-[#bf5af2]/50 hover:shadow-[0_0_15px_rgba(191,90,242,0.2)] transition-all"
            >
              Add Edge
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
