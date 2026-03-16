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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useGraphStore } from "@/lib/store";
import { CATEGORY_LABELS, CATEGORY_COLORS } from "@/lib/constants";
import { NodeCategory } from "@/lib/types";

interface AddNodeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const categories = Object.entries(CATEGORY_LABELS) as [NodeCategory, string][];

export function AddNodeDialog({ open, onOpenChange }: AddNodeDialogProps) {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [category, setCategory] = useState<NodeCategory>("concept");

  const addNode = useGraphStore((s) => s.addNode);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addNode({
      title: title.trim(),
      notes: notes.trim(),
      category,
    });

    setTitle("");
    setNotes("");
    setCategory("concept");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            Add New Node
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="node-title">Title</Label>
            <Input
              id="node-title"
              placeholder="e.g., GraphQL, Docker, REST API..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="node-category">Category</Label>
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: CATEGORY_COLORS[category] }}
              />
              <select
                id="node-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as NodeCategory)}
                className="flex-1 h-8 px-2 text-sm bg-white/5 border border-white/10 rounded-lg text-foreground outline-none cursor-pointer"
              >
                {categories.map(([key, label]) => (
                  <option key={key} value={key} className="bg-[#1a1a2e]">
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="node-notes">Notes (optional)</Label>
            <Textarea
              id="node-notes"
              placeholder="Add some notes about this topic..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="resize-none"
            />
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
              disabled={!title.trim()}
              className="bg-blue-600 hover:bg-blue-500 text-white"
            >
              Add Node
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
