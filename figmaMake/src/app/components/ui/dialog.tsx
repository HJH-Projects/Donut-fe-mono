"use client";

import * as React from "react";
import { Dialog } from "@base-ui/react/dialog";
import { XIcon } from "lucide-react";

import { cn } from "./utils";

function DialogRoot({
  ...props
}: React.ComponentProps<typeof Dialog.Root>) {
  return <Dialog.Root data-slot="dialog" {...props} />;
}

function DialogTrigger({
  ...props
}: React.ComponentProps<typeof Dialog.Trigger>) {
  return <Dialog.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal({
  children,
  ...props
}: { children: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>) {
  return <div data-slot="dialog-portal" {...props}>{children}</div>;
}

function DialogClose({
  ...props
}: React.ComponentProps<typeof Dialog.Close>) {
  return <Dialog.Close data-slot="dialog-close" {...props} />;
}

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof Dialog.Backdrop>) {
  return (
    <Dialog.Backdrop
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-black/50 transition-opacity duration-200",
        "data-[starting-style]:opacity-0 data-[ending-style]:opacity-0",
        className,
      )}
      {...props}
    />
  );
}

function DialogContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Dialog.Popup>) {
  return (
    <Dialog.Portal>
      <DialogOverlay />
      <Dialog.Popup
        data-slot="dialog-content"
        className={cn(
          "bg-background fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
          "transition-[opacity,transform]",
          "data-[starting-style]:opacity-0 data-[starting-style]:scale-95",
          "data-[ending-style]:opacity-0 data-[ending-style]:scale-95",
          className,
        )}
        {...props}
      >
        {children}
        <Dialog.Close className="ring-offset-background focus:ring-ring absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
          <XIcon />
          <span className="sr-only">Close</span>
        </Dialog.Close>
      </Dialog.Popup>
    </Dialog.Portal>
  );
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  );
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className,
      )}
      {...props}
    />
  );
}

function DialogTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      data-slot="dialog-title"
      className={cn("text-lg leading-none font-semibold", className)}
      {...props}
    />
  );
}

function DialogDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      data-slot="dialog-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

export {
  DialogRoot as Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};