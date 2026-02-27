import { Button } from "@mint/ui/components/button";

export function Hero() {
  return (
    <section className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-24 text-center">
      <h1 className="font-heading text-7xl tracking-tight">Mint</h1>
      <p className="max-w-sm text-muted-foreground">
        A minimalist expense tracker to help you stay on top of your finances.
      </p>
      <div className="flex items-center gap-3">
        <Button>Get Started</Button>
        <Button variant="outline">Learn More</Button>
      </div>
    </section>
  );
}
