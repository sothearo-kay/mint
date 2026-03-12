"use client";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@mint/ui/components/ui/button";
import { Icon } from "@mint/ui/components/ui/icon";
import { cn } from "@mint/ui/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";

type DialogContextValue = {
  isOpen: boolean;
  close: () => void;
  unmount: () => void;
};

const DialogOpenContext = React.createContext<DialogContextValue>({
  isOpen: false,
  close: () => {},
  unmount: () => {},
});

function Dialog({
  open,
  onOpenChange,
  defaultOpen,
  ...props
}: DialogPrimitive.Root.Props) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen ?? false);
  const isOpen = open ?? internalOpen;
  const actionsRef = React.useRef<DialogPrimitive.Root.Actions | null>(null);

  return (
    <DialogOpenContext
      value={{
        isOpen,
        close: () => actionsRef.current?.close(),
        unmount: () => actionsRef.current?.unmount(),
      }}
    >
      <DialogPrimitive.Root
        data-slot="dialog"
        open={isOpen}
        onOpenChange={(nextOpen, eventDetails) => {
          if (open === undefined)
            setInternalOpen(nextOpen);
          onOpenChange?.(nextOpen, eventDetails);
        }}
        defaultOpen={defaultOpen}
        actionsRef={actionsRef}
        {...props}
      />
    </DialogOpenContext>
  );
}

function DialogTrigger({ ...props }: DialogPrimitive.Trigger.Props) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal({ ...props }: DialogPrimitive.Portal.Props) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" keepMounted {...props} />;
}

function DialogClose({ ...props }: DialogPrimitive.Close.Props) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogOverlay({ className }: { className?: string }) {
  const { isOpen, close, unmount } = React.use(DialogOpenContext);
  return (
    <motion.div
      data-slot="dialog-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onAnimationComplete={() => {
        if (!isOpen)
          unmount();
      }}
      onClick={close}
      className={cn("fixed inset-0 isolate z-50 bg-black/10 supports-backdrop-filter:backdrop-blur-xs", className)}
    />
  );
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: DialogPrimitive.Popup.Props & {
  showCloseButton?: boolean;
}) {
  const { isOpen } = React.use(DialogOpenContext);
  return (
    <AnimatePresence>
      {isOpen && (
        <DialogPortal>
          <DialogOverlay />
          <DialogPrimitive.Popup
            data-slot="dialog-content"
            className={cn(
              "bg-background data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 ring-foreground/10 fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-5 rounded-xl p-5 text-sm ring-1 duration-150 outline-none sm:max-w-sm",
              className,
            )}
            {...props}
          >
            {children}
            {showCloseButton && (
              <DialogPrimitive.Close
                data-slot="dialog-close"
                render={(
                  <Button
                    variant="ghost"
                    className="absolute top-3 right-3"
                    size="icon"
                  />
                )}
              >
                <Icon icon={Cancel01Icon} />
                <span className="sr-only">Close</span>
              </DialogPrimitive.Close>
            )}
          </DialogPrimitive.Popup>
        </DialogPortal>
      )}
    </AnimatePresence>
  );
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

function DialogFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  showCloseButton?: boolean;
}) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "bg-muted/50 -mx-4 -mb-4 flex flex-col-reverse gap-2 rounded-b-xl border-t p-4 sm:flex-row sm:justify-end",
        className,
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close render={<Button variant="outline" />}>
          Close
        </DialogPrimitive.Close>
      )}
    </div>
  );
}

function DialogTitle({ className, ...props }: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-base leading-none font-medium", className)}
      {...props}
    />
  );
}

function DialogDescription({
  className,
  ...props
}: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn(
        "text-muted-foreground *:[a]:hover:text-foreground text-sm *:[a]:underline *:[a]:underline-offset-3",
        className,
      )}
      {...props}
    />
  );
}

export {
  Dialog,
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
