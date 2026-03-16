"use client";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useGraphStore } from "@/lib/store";
import { CATEGORY_COLORS, CATEGORY_LABELS } from "@/lib/constants";

interface SearchCommandProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectNode: (nodeId: string) => void;
}

export function SearchCommand({
  open,
  onOpenChange,
  onSelectNode,
}: SearchCommandProps) {
  const nodes = useGraphStore((s) => s.nodes);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search nodes..." />
      <CommandList>
        <CommandEmpty>No nodes found.</CommandEmpty>
        <CommandGroup heading="Nodes">
          {nodes.map((node) => (
            <CommandItem
              key={node.id}
              value={node.title}
              onSelect={() => onSelectNode(node.id)}
              className="flex items-center gap-3 cursor-pointer"
            >
              <div
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{
                  backgroundColor: CATEGORY_COLORS[node.category],
                }}
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium">{node.title}</div>
                <div className="text-xs text-muted-foreground truncate">
                  {node.notes || CATEGORY_LABELS[node.category]}
                </div>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
