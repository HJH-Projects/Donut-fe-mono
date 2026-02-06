"use client";

import * as React from "react";
import { Switch as BaseUISwitch } from "@base-ui/react/Switch";

import { cn } from "./utils";

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof BaseUISwitch.Root>) {
  return (
    <BaseUISwitch.Root
      data-slot="switch"
      className={cn(
        "peer data-[checked]:bg-primary data-[unchecked]:bg-switch-background focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[unchecked]:bg-input/80 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <BaseUISwitch.Thumb
        data-slot="switch-thumb"
        className={cn(
          "bg-card dark:data-[unchecked]:bg-card-foreground dark:data-[checked]:bg-primary-foreground pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[checked]:translate-x-[calc(100%-2px)] data-[unchecked]:translate-x-0",
        )}
      />
    </BaseUISwitch.Root>
  );
}

export { Switch };
