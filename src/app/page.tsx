import { Hero } from "@/components/sections/Hero";
import { TheTurn } from "@/components/sections/TheTurn";
import { Story } from "@/components/sections/Story";
import { Products } from "@/components/sections/Products";
import { Presence } from "@/components/sections/Presence";
import { LeadCapture } from "@/components/sections/LeadCapture";
import { ReviewBar } from "@/components/ReviewBar";

export default function Page() {
  return (
    <>
      <a
        href="#why"
        className="label-tag sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:bg-ink focus:px-5 focus:py-4 focus:text-paper"
      >
        Skip the hero sequence
      </a>

      <main className="flex-1">
        <Hero />
        <TheTurn />
        <Story />
        <Products />
        <Presence />
        <LeadCapture />
      </main>

      <ReviewBar />
    </>
  );
}
