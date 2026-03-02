import { ThemeToggle } from "./theme-toggle";

export function Footer() {
  return (
    <footer className="relative flex h-(--footer-height) items-center border-t px-6">
      <span className="corner-square top-0 left-0" />
      <span className="corner-square top-0 right-0 [--sq-x:50%]" />
      <div className="flex w-full items-center justify-between">
        <span className="text-sm text-muted-foreground">
          &copy; Mint 2026. All rights reserved.
        </span>
        <ThemeToggle />
      </div>
    </footer>
  );
}
