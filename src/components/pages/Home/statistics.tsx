import React from "react";

const stats = [
  { value: "50K+", label: "Active Students" },
  { value: "120+", label: "Expert Teachers" },
  { value: "95%", label: "Success Rate" },
  { value: "1M+", label: "Classes Completed" },
];

const Stats = () => {
  return (
    <section className="relative py-24 bg-[#0b1326] text-white overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-[#adc6ff]/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-[#6ffbbe]/20 blur-[120px] rounded-full" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight">
            Trusted by Thousands of Students
          </h2>
          <p className="text-white/70 mt-4 text-lg">
            Our platform delivers real results with consistent performance and expert guidance.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((item, index) => (
            <div
              key={index}
              className="relative p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl text-center hover:scale-105 transition-all duration-300"
            >
              {/* Glow Effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#adc6ff]/10 to-[#6ffbbe]/10 opacity-0 hover:opacity-100 transition" />

              <h3 className="text-4xl md:text-5xl font-extrabold text-[#adc6ff]">
                {item.value}
              </h3>
              <p className="mt-3 text-white/70 text-sm tracking-wide">
                {item.label}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Stats;