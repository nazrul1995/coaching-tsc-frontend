import HeroBanner from "@/components/pages/Home/banner";
import CoursesSection from "@/components/pages/Home/course";
import Gallery from "@/components/pages/Home/gallery";
import Leaderboard from "@/components/pages/Home/leaderboard";
import Stats from "@/components/pages/Home/statistics";
import Teachers from "@/components/pages/Home/teacher";
import Testimonials from "@/components/pages/Home/testimonial";
import WhyChooseUs from "@/components/pages/Home/why";

export default function Home() {
  return (
    <>
      <section>
        <HeroBanner />
      </section>
      <section>
        <Stats />
      </section>
      <section>
        <CoursesSection />
      </section>
      <section>
        <WhyChooseUs />
      </section>
      <section>
        <Leaderboard />
      </section>
      <section>
        <Gallery />
      </section>
      <section>
        <Teachers />
      </section>
      <section>
        <Testimonials />
      </section>
    </>
  );
}
