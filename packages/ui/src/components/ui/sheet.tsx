"use client";

import { Dialog as SheetPrimitive } from "@base-ui/react/dialog";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@mint/ui/components/ui/button";
import { Icon } from "@mint/ui/components/ui/icon";
import { cn } from "@mint/ui/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";

type SheetContextValue = {
  isOpen: boolean;
  close: () => void;
  unmount: () => void;
};

const SheetOpenContext = React.createContext<SheetContextValue>({
  isOpen: false,
  close: () => {},
  unmount: () => {},
});

function Sheet({
  open,
  onOpenChange,
  defaultOpen,
  ...props
}: SheetPrimitive.Root.Props) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen ?? false);
  const isOpen = open ?? internalOpen;
  const actionsRef = React.useRef<SheetPrimitive.Root.Actions | null>(null);

  return (
    <SheetOpenContext
      value={{
        isOpen,
        close: () => actionsRef.current?.close(),
        unmount: () => actionsRef.current?.unmount(),
      }}
    >
      <SheetPrimitive.Root
        data-slot="sheet"
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
    </SheetOpenContext>
  );
}

function SheetTrigger({ ...props }: SheetPrimitive.Trigger.Props) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

function SheetClose({ ...props }: SheetPrimitive.Close.Props) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />;
}

function SheetPortal({ ...props }: SheetPrimitive.Portal.Props) {
  return (
    <SheetPrimitive.Portal data-slot="sheet-portal" keepMounted {...props} />
  );
}

function SheetOverlay({ className }: { className?: string }) {
  const { isOpen, close, unmount } = React.use(SheetOpenContext);
  return (
    <motion.div
      data-slot="sheet-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onAnimationComplete={() => {
        if (!isOpen)
          unmount();
      }}
      onClick={close}
      className={cn("fixed inset-0 z-50 bg-black/30", className)}
    />
  );
}

function SheetContent({
  className,
  overlayClassName,
  children,
  side = "right",
  showCloseButton = true,
  ...props
}: SheetPrimitive.Popup.Props & {
  side?: "top" | "right" | "bottom" | "left";
  showCloseButton?: boolean;
  overlayClassName?: string;
}) {
  const { isOpen } = React.use(SheetOpenContext);
  return (
    <AnimatePresence>
      {isOpen && (
        <SheetPortal>
          <SheetOverlay className={overlayClassName} />
          <SheetPrimitive.Popup
            data-slot="sheet-content"
            data-side={side}
            className={cn(
              "bg-background data-open:animate-in data-closed:animate-out data-[side=right]:data-closed:slide-out-to-right-10 data-[side=right]:data-open:slide-in-from-right-10 data-[side=left]:data-closed:slide-out-to-left-10 data-[side=left]:data-open:slide-in-from-left-10 data-[side=top]:data-closed:slide-out-to-top-10 data-[side=top]:data-open:slide-in-from-top-10 data-closed:fade-out-0 data-open:fade-in-0 data-[side=bottom]:data-closed:slide-out-to-bottom-10 data-[side=bottom]:data-open:slide-in-from-bottom-10 fixed z-50 flex flex-col gap-4 bg-clip-padding text-sm shadow-lg transition duration-150 ease-motion data-[side=bottom]:inset-x-0 data-[side=bottom]:bottom-0 data-[side=bottom]:h-auto data-[side=bottom]:border-t data-[side=left]:inset-y-0 data-[side=left]:left-0 data-[side=left]:h-full data-[side=left]:border-r data-[side=right]:inset-y-0 data-[side=right]:right-0 data-[side=right]:h-full data-[side=right]:border-l data-[side=top]:inset-x-0 data-[side=top]:top-0 data-[side=top]:h-auto data-[side=top]:border-b data-[side=left]:sm:max-w-sm data-[side=right]:sm:max-w-sm",
              className,
            )}
            {...props}
          >
            {children}
            {showCloseButton && (
              <SheetPrimitive.Close
                data-slot="sheet-close"
                render={(
                  <Button
                    variant="ghost"
                    className="absolute top-3 right-3"
                    size="icon-sm"
                  />
                )}
              >
                <Icon icon={Cancel01Icon} />
                <span className="sr-only">Close</span>
              </SheetPrimitive.Close>
            )}
          </SheetPrimitive.Popup>
        </SheetPortal>
      )}
    </AnimatePresence>
  );
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("flex flex-col gap-0.5 p-4", className)}
      {...props}
    />
  );
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      {...props}
    />
  );
}

function SheetTitle({ className, ...props }: SheetPrimitive.Title.Props) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn("text-foreground text-base font-medium", className)}
      {...props}
    />
  );
}

function SheetDescription({
  className,
  ...props
}: SheetPrimitive.Description.Props) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
};
