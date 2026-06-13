"use client";

import type { Content, Locale } from "@/lib/content/types";
import SmoothScroll from "./SmoothScroll";
import SceneRoot from "./scene/SceneRoot";
import Grain from "./Grain";
import Cursor from "./ui/Cursor";
import BootSequence from "./BootSequence";
import Nav from "./Nav";
import ScrollRail from "./ScrollRail";

// All layout-level fixed/overlay chrome that sits outside the scrollable <main>.
export default function SiteChrome({
  content,
  locale,
}: {
  content: Content;
  locale: Locale;
}) {
  return (
    <>
      <SmoothScroll />
      <SceneRoot />
      <Grain />
      <Cursor />
      <BootSequence lines={content.boot} />
      <Nav nav={content.nav} locale={locale} />
      <ScrollRail ticks={content.rail} />
    </>
  );
}
