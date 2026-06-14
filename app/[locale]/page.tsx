import { getContent, isLocale } from "@/lib/content";
import { notFound } from "next/navigation";
import Hero from "@/components/sections/Hero";
import ProblemCostSection from "@/components/sections/ProblemCostSection";
import BreaksFixesSection from "@/components/sections/BreaksFixesSection";
import WhyRaisedSection from "@/components/sections/WhyRaisedSection";
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
      <BreaksFixesSection breaksFixes={content.breaksFixes} />
      <WhyRaisedSection whyRaised={content.whyRaised} />
      <AuditSection audit={content.audit} process={content.process} />
      <FinalCtaSection finalCta={content.finalCta} />
    </>
  );
}
