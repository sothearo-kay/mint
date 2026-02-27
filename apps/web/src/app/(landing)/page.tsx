import { Footer } from "./_components/footer";
import { Header } from "./_components/header";
import { Hero } from "./_components/hero";

export default function Home() {
  return (
    <div className="my-2 container flex min-h-[calc(100svh-1rem)] flex-col border border-t-0">
      <Header />
      <Hero />
      <Footer />
    </div>
  );
}
