export function Header() {
  return (
    <header className="sticky top-2 border-b bg-background px-6 py-3 before:absolute before:content-[''] before:-inset-x-px before:-top-2 before:h-2 before:bg-background before:border-b before:border-border">
      <div className="flex items-center justify-between">
        <span className="font-heading text-xl">Mint</span>
        <nav className="flex items-center gap-1">
          <a
            href="#features"
            className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Features
          </a>
          <a
            href="#pricing"
            className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Pricing
          </a>
        </nav>
      </div>
      <span className="corner-square bottom-0 left-0 [--sq-y:50%]" />
      <span className="corner-square bottom-0 right-0 [--sq-x:50%] [--sq-y:50%]" />
    </header>
  );
}
