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
    <section className="grid h-(--features-height) grid-cols-3 divide-x border-t">
      {features.map(({ title, description }) => (
        <div key={title} className="flex flex-col justify-center gap-1.5 px-6">
          <p className="font-mono text-sm font-medium">{title}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      ))}
    </section>
  );
}
