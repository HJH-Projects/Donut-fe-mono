"use client";

import * as React from "react";
import { Accordion as BaseUIAccordion } from "@base-ui/react/Accordion";
import { ChevronDownIcon } from "lucide-react";

import { cn } from "./utils";

function Accordion({
  ...props
}: React.ComponentProps<typeof BaseUIAccordion.Root>) {
  return <BaseUIAccordion.Root data-slot="accordion" {...props} />;
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof BaseUIAccordion.Item>) {
  return (
    <BaseUIAccordion.Item
      data-slot="accordion-item"
      className={cn("border-b last:border-b-0", className)}
      {...props}
    />
  );
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof BaseUIAccordion.Trigger>) {
  return (
    <BaseUIAccordion.Header className="flex">
      <BaseUIAccordion.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&[data-panel-open]>svg]:rotate-180",
          className,
        )}
        {...props}
      >
        {children}
        <ChevronDownIcon className="text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200" />
      </BaseUIAccordion.Trigger>
    </BaseUIAccordion.Header>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof BaseUIAccordion.Panel>) {
  return (
    <BaseUIAccordion.Panel
      data-slot="accordion-content"
      className="overflow-hidden text-sm transition-all data-[starting-style]:h-0 data-[ending-style]:h-0"
      {...props}
    >
      <div className={cn("pt-0 pb-4", className)}>{children}</div>
    </BaseUIAccordion.Panel>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
