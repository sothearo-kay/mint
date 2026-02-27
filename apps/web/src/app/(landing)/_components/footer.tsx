import { ThemeToggle } from "./theme-toggle";

export function Footer() {
  return (
    <footer className="relative border-t px-6 py-3">
      <span className="corner-square top-0 left-0" />
      <span className="corner-square top-0 right-0 [--sq-x:50%]" />
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          &copy; Mint 2026. All rights reserved.
        </span>
        <ThemeToggle />
      </div>
    </footer>
  );
}
