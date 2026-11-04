import { SothearoMark } from "@/components/sothearo-mark";
import { ThemeToggle } from "@/components/theme-toggle";

export function Footer() {
  return (
    <footer className="relative flex h-(--footer-height) items-center border-t border-dashed px-4">
      <span className="corner-square top-0 left-0" />
      <span className="corner-square top-0 right-0 [--sq-x:50%]" />
      <div className="flex w-full items-center justify-between">
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          &copy; 2026 Mint. Made by
          <a
            href="https://sothearo.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 transition-colors hover:text-foreground"
          >
            <SothearoMark className="size-4 text-foreground" />
            Sothearo
          </a>
        </p>
        <ThemeToggle />
      </div>
    </footer>
  );
}
