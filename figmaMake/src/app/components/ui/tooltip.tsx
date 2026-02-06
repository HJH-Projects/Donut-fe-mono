"use client";

import * as React from "react";
import { Tooltip as BaseUITooltip } from "@base-ui/react/Tooltip";

import { cn } from "./utils";

function TooltipProvider({
  delayDuration = 0,
  children,
}: {
  delayDuration?: number;
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

function Tooltip({
  ...props
}: React.ComponentProps<typeof BaseUITooltip.Root>) {
  return (
    <TooltipProvider>
      <BaseUITooltip.Root data-slot="tooltip" {...props} />
    </TooltipProvider>
  );
}

function TooltipTrigger({
  ...props
}: React.ComponentProps<typeof BaseUITooltip.Trigger>) {
  return <BaseUITooltip.Trigger data-slot="tooltip-trigger" {...props} />;
}

function TooltipContent({
  className,
  sideOffset = 0,
  children,
  ...props
}: React.ComponentProps<typeof BaseUITooltip.Popup> & {
  sideOffset?: number;
}) {
  return (
    <BaseUITooltip.Portal>
      <BaseUITooltip.Popup
        data-slot="tooltip-content"
        className={cn(
          "bg-primary text-primary-foreground z-50 w-fit rounded-md px-3 py-1.5 text-xs text-balance",
          "transition-[opacity,transform] duration-200",
          "data-[starting-style]:opacity-0 data-[starting-style]:scale-95",
          "data-[ending-style]:opacity-0 data-[ending-style]:scale-95",
          className,
        )}
        {...props}
      >
        {children}
        <BaseUITooltip.Arrow className="bg-primary fill-primary z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" />
      </BaseUITooltip.Popup>
    </BaseUITooltip.Portal>
  );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
