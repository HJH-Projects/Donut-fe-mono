"use client";

import * as React from "react";
import { Popover as BaseUIPopover } from "@base-ui/react/Popover";

import { cn } from "./utils";

function Popover({
  ...props
}: React.ComponentProps<typeof BaseUIPopover.Root>) {
  return <BaseUIPopover.Root data-slot="popover" {...props} />;
}

function PopoverTrigger({
  ...props
}: React.ComponentProps<typeof BaseUIPopover.Trigger>) {
  return <BaseUIPopover.Trigger data-slot="popover-trigger" {...props} />;
}

function PopoverContent({
  className,
  align = "center" as const,
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof BaseUIPopover.Popup> & {
  align?: "start" | "center" | "end";
  sideOffset?: number;
}) {
  return (
    <BaseUIPopover.Portal>
      <BaseUIPopover.Popup
        data-slot="popover-content"
        className={cn(
          "bg-popover text-popover-foreground z-50 w-72 rounded-md border p-4 shadow-md outline-hidden",
          "transition-[opacity,transform] duration-200",
          "data-[starting-style]:opacity-0 data-[starting-style]:scale-95",
          "data-[ending-style]:opacity-0 data-[ending-style]:scale-95",
          className,
        )}
        {...props}
      />
    </BaseUIPopover.Portal>
  );
}

function PopoverAnchor({
  ...props
}: React.ComponentProps<typeof BaseUIPopover.Anchor>) {
  return <BaseUIPopover.Anchor data-slot="popover-anchor" {...props} />;
}

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor };
