import React from "react";
import { Button } from "@/components/ui/button";

const courses = [
  {
    title: "Class 6–8 Foundation",
    description: "Strong basics in Math, Science & English with weekly exams.",
    price: "৳1,500/month",
  },
  {
    title: "Class 9–10 (SSC)",
    description: "Full SSC preparation with model tests & live doubt solving.",
    price: "৳2,500/month",
  },
  {
    title: "Class 11–12 (HSC)",
    description: "Advanced coaching for Science, Commerce & Arts students.",
    price: "৳3,000/month",
  },
  {
    title: "Admission Prep",
    description: "University admission coaching with full mock exams.",
    price: "৳4,000/month",
  },
];

const CoursesSection = () => {
  return (
    <section
      id="courses"
      className="relative py-28 px-6 bg-[#0b1326] text-white overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[#adc6ff]/10 blur-[120px] rounded-full" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-5xl md:text-6xl font-black tracking-tight">
            Our{" "}
            <span className="bg-gradient-to-r from-[#adc6ff] via-[#6ffbbe] to-[#ffb786] bg-clip-text text-transparent">
              Courses
            </span>
          </h2>
          <p className="text-white/70 mt-6 text-lg">
            Structured programs designed for Bangladesh National Curriculum students.
          </p>
        </div>

        {/* Course Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {courses.map((course, index) => (
            <div
              key={index}
              className="group p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl hover:border-[#adc6ff]/40 transition-all hover:-translate-y-2"
            >
              <h3 className="text-2xl font-bold mb-4">{course.title}</h3>
              <p className="text-white/70 text-sm leading-relaxed mb-6">
                {course.description}
              </p>

              <div className="flex items-center justify-between mt-auto">
                <span className="text-[#6ffbbe] font-bold text-lg">
                  {course.price}
                </span>

                <Button className="bg-[#adc6ff] hover:bg-[#adc6ff]/90 text-[#002e6a] font-semibold px-5 py-2 rounded-xl">
                  Enroll
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;