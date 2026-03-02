import { Button } from "@mint/ui/components/button";

export function Header() {
  return (
    <header className="sticky top-2 flex h-(--header-height) items-center border-b bg-background px-6 before:absolute before:content-[''] before:-inset-x-px before:-top-2 before:h-2 before:bg-background before:border-b before:border-border">
      <div className="flex w-full items-center justify-between">
        <span className="font-heading text-xl">Mint</span>
        <Button variant="outline" render={<a href="/app" />}>
          Track It
        </Button>
      </div>
      <span className="corner-square bottom-0 left-0 [--sq-y:50%]" />
      <span className="corner-square bottom-0 right-0 [--sq-x:50%] [--sq-y:50%]" />
    </header>
  );
}
