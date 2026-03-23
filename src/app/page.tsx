import HeroBanner from "@/components/pages/Home/banner";
import CoursesSection from "@/components/pages/Home/course";
import Stats from "@/components/pages/Home/statistics";

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
    </>
  );
}
