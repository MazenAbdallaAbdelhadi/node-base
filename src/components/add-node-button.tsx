"use client";

import { memo, useState } from "react";
import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

import { NodeSelector } from "./node-selector";

export const AddNodeButton = memo(() => {
  const [open, setOpen] = useState(false);

  return (
    <NodeSelector open={open} onOpenChange={setOpen}>
      <Button
        onClick={() => setOpen(true)}
        size="icon"
        variant="outline"
        className="bg-background dark:bg-background dark:hover:bg-background"
      >
        <PlusIcon />
      </Button>
    </NodeSelector>
  );
});

AddNodeButton.displayName = "AddNodeButton";
