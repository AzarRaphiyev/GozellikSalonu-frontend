"use client";

import { HeroSection } from "@/components/landing/HeroSection";
import { WhyChooseUs } from "@/components/landing/WhyChooseUs";
import { ServicesOverview } from "@/components/landing/ServicesOverview";
import { CinematicGallery } from "@/components/landing/CinematicGallery";
import { SpecialOfferBanner } from "@/components/landing/SpecialOfferBanner";
import { TeamSection } from "@/components/landing/TeamSection";
import { TestimonialsMarquee } from "@/components/landing/TestimonialsMarquee";
import { BlogTrends } from "@/components/landing/BlogTrends";
import { FaqAccordion } from "@/components/landing/FaqAccordion";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <WhyChooseUs />
      <ServicesOverview />
      <CinematicGallery />
      <SpecialOfferBanner />
      <TeamSection />
      <TestimonialsMarquee />
      <BlogTrends />
      <FaqAccordion />
    </div>
  );
}
