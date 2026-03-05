const features = [
  {
    title: "Track",
    description:
      "Log every expense the moment it happens. No categories to wrestle with, no setup required — just capture it and move on.",
  },
  {
    title: "Budget",
    description:
      "Set monthly spending limits that actually stick. Get a clear signal before you overspend, not after the damage is done.",
  },
  {
    title: "Insights",
    description:
      "Understand your patterns at a glance. See where your money quietly disappears each month and decide what to change.",
  },
];

export function Features() {
  return (
    <section className="grid md:h-(--features-height) md:grid-cols-3 md:divide-x max-md:divide-y border-t bg-background">
      {features.map(({ title, description }) => (
        <div key={title} className="flex flex-col gap-1.5 p-4 max-md:h-36">
          <p className="font-mono text-sm font-medium">{title}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      ))}
    </section>
  );
}
