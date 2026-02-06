"use client";

import * as React from "react";
import { Select as BaseUISelect } from "@base-ui/react/Select";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "lucide-react";

import { cn } from "./utils";

function Select({
  ...props
}: React.ComponentProps<typeof BaseUISelect.Root>) {
  return <BaseUISelect.Root data-slot="select" {...props} />;
}

function SelectGroup({
  ...props
}: React.ComponentProps<typeof BaseUISelect.Group>) {
  return <BaseUISelect.Group data-slot="select-group" {...props} />;
}

function SelectValue({
  ...props
}: React.ComponentProps<typeof BaseUISelect.Value>) {
  return <BaseUISelect.Value data-slot="select-value" {...props} />;
}

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: React.ComponentProps<typeof BaseUISelect.Trigger> & {
  size?: "sm" | "default";
}) {
  return (
    <BaseUISelect.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-full items-center justify-between gap-2 rounded-md border bg-input-background px-3 py-2 text-sm whitespace-nowrap transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      {children}
      <ChevronDownIcon className="size-4 opacity-50" />
    </BaseUISelect.Trigger>
  );
}

function SelectContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof BaseUISelect.Popup>) {
  return (
    <BaseUISelect.Portal>
      <BaseUISelect.Popup
        data-slot="select-content"
        className={cn(
          "bg-popover text-popover-foreground relative z-50 max-h-96 min-w-[8rem] overflow-x-hidden overflow-y-auto rounded-md border shadow-md",
          "transition-[opacity,transform] duration-200",
          "data-[starting-style]:opacity-0 data-[starting-style]:scale-95",
          "data-[ending-style]:opacity-0 data-[ending-style]:scale-95",
          className,
        )}
        {...props}
      >
        {children}
      </BaseUISelect.Popup>
    </BaseUISelect.Portal>
  );
}

function SelectLabel({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="select-label"
      className={cn("text-muted-foreground px-2 py-1.5 text-xs", className)}
      {...props}
    />
  );
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof BaseUISelect.Option>) {
  return (
    <BaseUISelect.Option
      data-slot="select-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className,
      )}
      {...props}
    >
      {children}
      <BaseUISelect.OptionIndicator className="absolute right-2 flex size-3.5 items-center justify-center">
        <CheckIcon className="size-4" />
      </BaseUISelect.OptionIndicator>
    </BaseUISelect.Option>
  );
}

function SelectSeparator({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="select-separator"
      className={cn("bg-border pointer-events-none -mx-1 my-1 h-px", className)}
      {...props}
    />
  );
}

function SelectScrollUpButton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="select-scroll-up-button"
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className,
      )}
      {...props}
    >
      <ChevronUpIcon className="size-4" />
    </div>
  );
}

function SelectScrollDownButton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="select-scroll-down-button"
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className,
      )}
      {...props}
    >
      <ChevronDownIcon className="size-4" />
    </div>
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
