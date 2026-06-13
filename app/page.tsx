import { getContent } from "@/lib/content";
import Hero from "@/components/sections/Hero";
import ProblemCostSection from "@/components/sections/ProblemCostSection";
import BreakingSection from "@/components/sections/BreakingSection";

export default function Home() {
  const content = getContent("en");
  return (
    <>
      <Hero hero={content.hero} hud={content.hud} />
      <ProblemCostSection problem={content.problem} />
      <BreakingSection breaking={content.breaking} />
    </>
  );
}
