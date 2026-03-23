"use client";

import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@mint/ui/components/ui/button";
import { Icon } from "@mint/ui/components/ui/icon";
import { cn } from "@mint/ui/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";
import { useCallback, useLayoutEffect, useRef } from "react";

function useResizeObserver<T extends HTMLElement>(
  callback: (target: T, entry: ResizeObserverEntry) => void,
) {
  const ref = useRef<T>(null);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element)
      return;

    const observer = new ResizeObserver((entries) => {
      callback(element, entries[0]);
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [callback]);

  return ref;
}

const backdropVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const containerVariants = {
  initial: { y: "calc(100% + 4rem)" },
  animate: { y: 0 },
  exit: { y: "calc(100% + 4rem)" },
};

const viewVariants = {
  initial: { opacity: 0, scale: 1, y: 0 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, y: 4, scale: 0.95 },
};

type TrayProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  containerStyle?: React.CSSProperties;
};

function Tray({ open, onClose, children, className, containerStyle }: TrayProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dragContainerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = dragContainerRef.current;
    if (!el)
      return;

    if (!open)
      return;

    const viewport = window.visualViewport;
    if (!viewport)
      return;

    const handleResize = () => {
      const keyboardHeight = Math.max(0, window.innerHeight - viewport.height);
      el.style.bottom = `${keyboardHeight + 16}px`;
    };

    handleResize();
    viewport.addEventListener("resize", handleResize);
    viewport.addEventListener("scroll", handleResize);

    return () => {
      viewport.removeEventListener("resize", handleResize);
      viewport.removeEventListener("scroll", handleResize);
    };
  }, [open]);

  const onResize = useCallback(
    (target: HTMLDivElement) => {
      if (wrapperRef.current) {
        wrapperRef.current.style.height = `${target.offsetHeight}px`;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [open],
  );

  const contentRef = useResizeObserver<HTMLDivElement>(onResize);

  return (
    <AnimatePresence mode="wait">
      {open && (
        <div className="fixed inset-0 z-50">
          <motion.div
            variants={backdropVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute inset-0 bg-black/30"
            onClick={onClose}
          />
          <motion.div
            ref={dragContainerRef}
            drag="y"
            dragConstraints={{ top: 0, bottom: 100 }}
            dragSnapToOrigin
            dragElastic={0.1}
            onDragEnd={(_, info) => info.offset.y > 100 && onClose()}
            className="absolute inset-x-0 z-100"
            style={{ ...containerStyle, bottom: "16px" }}
          >
            <motion.div
              ref={wrapperRef}
              variants={containerVariants}
              transition={{ duration: 0.15 }}
              initial="initial"
              animate="animate"
              exit="exit"
              className={cn("mx-auto relative overflow-hidden bg-card text-card-foreground rounded-3xl ring-1 ring-foreground/10 transition-[height] duration-250 ease-motion", className)}
            >
              <Button
                variant="ghost"
                size="icon-sm"
                className="absolute top-3 right-3 z-10"
                onClick={onClose}
              >
                <Icon icon={Cancel01Icon} />
                <span className="sr-only">Close</span>
              </Button>
              <motion.div ref={contentRef}>
                {children}
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

type TrayViewProps = {
  children: React.ReactNode;
  viewKey: string;
  className?: string;
};

function TrayView({ children, viewKey, className }: TrayViewProps) {
  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.div
        key={viewKey}
        variants={viewVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.15 }}
        style={{ maxHeight: "calc(100vh - 2rem)" }}
        className={cn("flex flex-col overflow-hidden", className)}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

function TrayBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="tray-body"
      className={cn("flex-1 min-h-0 overflow-y-auto flex flex-col gap-5 px-5 py-0", className)}
      {...props}
    />
  );
}

function TrayHeader({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="tray-header"
      className={cn(
        "flex flex-col gap-2 shrink-0 p-5",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function TrayTitle({ className, ...props }: React.ComponentProps<"h2">) {
  return (
    <h2
      data-slot="tray-title"
      className={cn("text-base leading-none font-medium", className)}
      {...props}
    />
  );
}

function TrayDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="tray-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

function TrayFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="tray-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end shrink-0 p-5",
        className,
      )}
      {...props}
    />
  );
}

export {
  Tray,
  TrayBody,
  TrayDescription,
  TrayFooter,
  TrayHeader,
  TrayTitle,
  TrayView,
};
