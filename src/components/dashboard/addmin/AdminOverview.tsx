'use client';

import { useAdminOverview } from '@/hooks/useOverview';
import { 
  Users, 
  BookOpen, 
  DollarSign, 
  AlertCircle, 
  TrendingUp,
  RefreshCw,
  Award,
  CheckCircle2
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export default function AdminDashboardPage() {
  const { data, loading, error, refetch } = useAdminOverview();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0B0F19] text-slate-400">
        <div className="flex items-center gap-3 font-medium">
          <RefreshCw className="w-5 h-5 animate-spin text-emerald-400" />
          <span>ডাটা লোড হচ্ছে...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-screen items-center justify-center gap-4 bg-[#0B0F19] text-slate-300">
        <p className="text-rose-400 font-medium">{error}</p>
        <button 
          onClick={refetch}
          className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold rounded-lg text-sm transition"
        >
          আবার চেষ্টা করুন
        </button>
      </div>
    );
  }

  if (!data) return null;

  const { metrics, financialSummary, recentExamResults } = data;

  // Recharts Analytics Formatting
  const chartData = recentExamResults.map((exam) => ({
    name: exam.title.length > 12 ? exam.title.substring(0, 12) + "..." : exam.title,
    avg: exam.averagePercentage,
  })).reverse();

  const financialPieData = [
    { name: 'Paid', value: financialSummary.paidCycles, color: '#10b981' },
    { name: 'Partial', value: financialSummary.partialCycles, color: '#f59e0b' },
    { name: 'Unpaid', value: financialSummary.unpaidCycles, color: '#3b82f6' },
    { name: 'Overdue', value: financialSummary.overdueCycles, color: '#f43f5e' },
  ];

  return (
    <div className="p-6 space-y-6 bg-[#0B0F19] text-slate-100 min-h-screen">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <div>
          <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Dashboard / Overview</span>
          <h1 className="text-2xl font-bold text-white mt-1">এডমিন ড্যাশবোর্ড</h1>
        </div>
        <button 
          onClick={refetch}
          className="flex items-center gap-2 text-xs bg-[#151C2C] border border-slate-800 hover:bg-slate-800/60 text-slate-300 font-medium px-4 py-2 rounded-lg transition"
        >
          <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
          <span>রিফ্রেশ</span>
        </button>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="মোট শিক্ষার্থী"
          value={metrics.totalStudents}
          icon={<Users className="w-5 h-5 text-emerald-400" />}
          iconBg="bg-emerald-500/10 border-emerald-500/20"
        />
        <MetricCard
          title="প্রকাশিত পরীক্ষা"
          value={`${metrics.publishedExams} / ${metrics.totalExams}`}
          icon={<BookOpen className="w-5 h-5 text-blue-400" />}
          iconBg="bg-blue-500/10 border-blue-500/20"
        />
        <MetricCard
          title="মোট আদায়কৃত ফি"
          value={`৳${metrics.totalRevenue.toLocaleString()}`}
          icon={<DollarSign className="w-5 h-5 text-indigo-400" />}
          iconBg="bg-indigo-500/10 border-indigo-500/20"
        />
        <MetricCard
          title="মোট বকেয়া ফি"
          value={`৳${metrics.totalOutstanding.toLocaleString()}`}
          icon={<AlertCircle className="w-5 h-5 text-rose-400" />}
          iconBg="bg-rose-500/10 border-rose-500/20"
        />
      </div>

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Progress Area Chart */}
        <div className="lg:col-span-2 bg-[#121827] p-5 rounded-2xl border border-slate-800/80 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-white">পরীক্ষার গড় নম্বর ট্রেন্ড</h2>
              <p className="text-xs text-slate-400">সাম্প্রতিক পরীক্ষার গড় নম্বর শতাংশ</p>
            </div>
            <div className="p-2 bg-slate-800/40 rounded-lg border border-slate-800">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="name" stroke="#64748B" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={12} tickLine={false} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', borderRadius: '8px', color: '#fff' }} 
                />
                <Area type="monotone" dataKey="avg" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorAvg)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Financial Distribution Chart */}
        <div className="bg-[#121827] p-5 rounded-2xl border border-slate-800/80 shadow-xl flex flex-col justify-between">
          <div>
            <h2 className="text-base font-semibold text-white">ফি ডিস্ট্রিবিউশন</h2>
            <p className="text-xs text-slate-400">স্টুডেন্ট ফি সাইকেল অনুপাত</p>
          </div>
          <div className="h-44 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={financialPieData} innerRadius={50} outerRadius={70} paddingAngle={4} dataKey="value">
                  {financialPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#121827" strokeWidth={2} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800/80">
            {financialPieData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-400">{item.name}:</span>
                <span className="font-semibold text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Exam Results Table */}
      <div className="bg-[#121827] rounded-2xl border border-slate-800/80 shadow-xl overflow-hidden">
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <h2 className="text-base font-semibold text-white">সাম্প্রতিক পরীক্ষা সমূহের সারাংশ</h2>
          <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full font-medium">
            লাইভ তথ্য
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-[#0F1422] text-slate-400 text-xs uppercase border-b border-slate-800/80">
              <tr>
                <th className="p-4">পরীক্ষার নাম</th>
                <th className="p-4">ক্লাস</th>
                <th className="p-4 text-center">পরীক্ষার্থী</th>
                <th className="p-4 text-center">উত্তীর্ণ</th>
                <th className="p-4 text-right">গড় নম্বর (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {recentExamResults.map((exam) => (
                <tr key={exam.examId} className="hover:bg-slate-800/30 transition">
                  <td className="p-4 font-medium text-white">{exam.title}</td>
                  <td className="p-4 text-slate-400">{exam.className}</td>
                  <td className="p-4 text-center font-medium">{exam.totalParticipants} জন</td>
                  <td className="p-4 text-center text-emerald-400 font-semibold">{exam.passedParticipants} জন</td>
                  <td className="p-4 text-right">
                    <span className="bg-emerald-500/10 text-emerald-400 font-bold px-2.5 py-1 rounded-md border border-emerald-500/20">
                      {exam.averagePercentage}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon, iconBg }: { title: string; value: string | number; icon: React.ReactNode; iconBg: string }) {
  return (
    <div className="bg-[#121827] p-5 rounded-2xl border border-slate-800/80 shadow-xl flex items-center justify-between">
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
      <div className={`p-3 rounded-xl border ${iconBg}`}>{icon}</div>
    </div>
  );
}