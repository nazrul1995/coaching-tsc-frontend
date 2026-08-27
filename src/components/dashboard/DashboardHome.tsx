'use client';
export default function DashboardHome() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-[#adc6ff]">Dashboard HoME</h1>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 shadow-lg flex flex-col">
          <span className="text-white/70 text-sm">Total Courses</span>
          <span className="text-2xl font-bold mt-2 text-[#6ffbbe]">12</span>
        </div>
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 shadow-lg flex flex-col">
          <span className="text-white/70 text-sm">Enrolled Students</span>
          <span className="text-2xl font-bold mt-2 text-[#adc6ff]">41</span>
        </div>
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 shadow-lg flex flex-col">
          <span className="text-white/70 text-sm">Upcoming Events</span>
          <span className="text-2xl font-bold mt-2 text-[#6ffbbe]">3</span>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white/5 p-6 rounded-2xl border border-white/10 shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-[#adc6ff]">Recent Activities</h2>
        <ul className="space-y-2 text-white/70">
          <li>✅ Completed &quot;Math Basics&quot; course</li>
          <li>📝 Submitted &quot;Science Project&quot; assignment</li>
          <li>📅 Registered for &quot;Free Exam April 2026&quot;</li>
        </ul>
      </div>
    </div>
  );
}