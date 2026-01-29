import Hero from "@/components/Hero";
import PracticeAreas from "@/components/PracticeAreas";
import Statistics from "@/components/Statistics";
import About from "@/components/About";
import NoFeeGuarantee from "@/components/NoFeeGuarantee";
import BadgeCarousel from "@/components/BadgeCarousel";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <PracticeAreas />
      <NoFeeGuarantee />
      <Statistics />
      <About />
      <BadgeCarousel />
      <Testimonials />
      <Contact />
    </>
  );
}
