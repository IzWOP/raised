import { getContent } from "@/lib/content";
import Hero from "@/components/sections/Hero";

export default function Home() {
  const content = getContent("en");
  return <Hero hero={content.hero} hud={content.hud} />;
}
