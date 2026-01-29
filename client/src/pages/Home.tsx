import Hero from "@/components/Hero";
import PracticeAreas from "@/components/PracticeAreas";
import Statistics from "@/components/Statistics";
import About from "@/components/About";
import BadgeCarousel from "@/components/BadgeCarousel";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <PracticeAreas />
      <Statistics />
      <About />
      <BadgeCarousel />
      <Testimonials />
      <Contact />
    </>
  );
}
