import { getContent, isLocale } from "@/lib/content";
import { notFound } from "next/navigation";
import Hero from "@/components/sections/Hero";
import ProblemCostSection from "@/components/sections/ProblemCostSection";
import BreakingSection from "@/components/sections/BreakingSection";
import SystemsSection from "@/components/sections/SystemsSection";
import WhyRaisedSection from "@/components/sections/WhyRaisedSection";
import ProcessSection from "@/components/sections/ProcessSection";
import AuditSection from "@/components/sections/AuditSection";
import FinalCtaSection from "@/components/sections/FinalCtaSection";

export default async function LocalePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const content = getContent(locale);
  return (
    <>
      <Hero hero={content.hero} hud={content.hud} />
      <ProblemCostSection problem={content.problem} />
      <BreakingSection breaking={content.breaking} />
      <SystemsSection systems={content.systems} />
      <WhyRaisedSection whyRaised={content.whyRaised} />
      <ProcessSection process={content.process} />
      <AuditSection audit={content.audit} />
      <FinalCtaSection finalCta={content.finalCta} />
    </>
  );
}
