'use client';

import { useStudentOverview } from '@/hooks/useOverview';
import { 
  Award, 
  BookOpen, 
  AlertCircle, 
  Trophy, 
  User,
  RefreshCw,
  CheckCircle2,
  TrendingUp,
  PieChart as PieIcon
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

export default function StudentDashboardPage() {
  const { data, loading, error, refetch } = useStudentOverview();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-slate-400">
        <div className="flex items-center gap-3 font-medium">
          <RefreshCw className="w-5 h-5 animate-spin text-emerald-400" />
          <span>ড্যাশবোর্ড লোড হচ্ছে...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-screen items-center justify-center gap-4 text-slate-300">
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

  const { studentProfile, academicOverview, financialOverview, recentResults } = data;

  // Recharts Progress Data
  const chartData = recentResults
    .filter((r) => !r.isAbsent)
    .map((r) => ({
      name: r.examTitle.length > 10 ? r.examTitle.substring(0, 10) + "..." : r.examTitle,
      percentage: r.percentage,
    }))
    .reverse();

  return (
    <div className="p-6 space-y-6 text-slate-100 min-h-screen">
      {/* Top Banner Profile (Dark Card UI with Emerald Accents) */}
      <div className="bg-[#121827] p-6 rounded-2xl border border-slate-800/80 shadow-xl flex flex-col lg:flex-row items-center gap-6 justify-between">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-[#1E293B] border border-slate-700 flex items-center justify-center text-white font-bold text-2xl shadow-inner">
            {studentProfile.photo ? (
              <img src={studentProfile.photo} alt={studentProfile.name} className="w-full h-full rounded-2xl object-cover" />
            ) : (
              <span>{studentProfile.name.charAt(0)}</span>
            )}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white">{studentProfile.name}</h1>
              <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-semibold">
                Active Student
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {studentProfile.className} {studentProfile.batch && `• ${studentProfile.batch}`} {studentProfile.group && `• ${studentProfile.group}`}
            </p>
            <p className="text-xs text-slate-500">{studentProfile.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-6 bg-[#0F1422] px-6 py-4 rounded-xl border border-slate-800/80 w-full lg:w-auto justify-around">
          <div className="text-center">
            <p className="text-xs uppercase text-slate-500 font-semibold tracking-wider">Average</p>
            <p className="text-xl font-bold text-emerald-400 mt-1">{academicOverview.averagePercentage}%</p>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div className="text-center">
            <p className="text-xs uppercase text-slate-500 font-semibold tracking-wider">Class Rank</p>
            <p className="text-xl font-bold text-white mt-1">#{academicOverview.rankInClass ?? 'N/A'}</p>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div className="text-center">
            <p className="text-xs uppercase text-slate-500 font-semibold tracking-wider">Outstanding</p>
            <p className="text-xl font-bold text-rose-400 mt-1">৳{financialOverview.totalDue.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="অংশগ্রহণকৃত পরীক্ষা" value={academicOverview.totalExamsTaken} icon={<BookOpen className="w-5 h-5 text-blue-400" />} />
        <StatCard title="গড় নম্বর (%)" value={`${academicOverview.averagePercentage}%`} icon={<Award className="w-5 h-5 text-emerald-400" />} />
        <StatCard title="সর্বোচ্চ নম্বর (%)" value={`${academicOverview.highestPercentage}%`} icon={<Trophy className="w-5 h-5 text-amber-400" />} />
        <StatCard title="মোট বকেয়া ফি" value={`৳${financialOverview.totalDue.toLocaleString()}`} icon={<AlertCircle className="w-5 h-5 text-rose-400" />} />
      </div>

      {/* Middle Visual Section: Performance Progress Graph & Attendance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recharts Performance Progress Line Graph */}
        <div className="lg:col-span-2 bg-[#121827] p-5 rounded-2xl border border-slate-800/80 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-white">পারফরম্যান্স অগ্রগতি Graph</h2>
              <p className="text-xs text-slate-400">প্রকাশিত পরীক্ষাসমূহের শতকরা নম্বর</p>
            </div>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="studentProgress" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="name" stroke="#64748B" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={12} tickLine={false} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', borderRadius: '8px', color: '#fff' }} />
                <Area type="monotone" dataKey="percentage" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#studentProgress)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Student Ranking Indicator Cards */}
        <div className="bg-[#121827] p-5 rounded-2xl border border-slate-800/80 shadow-xl space-y-4 flex flex-col justify-between">
          <h2 className="text-base font-semibold text-white">র‍্যাঙ্কিং ও অবস্থান</h2>
          <div className="space-y-4">
            <RankProgressBar title="Class Rank" rank={academicOverview.rankInClass} color="emerald" />
            <RankProgressBar title="Coaching Rank" rank={academicOverview.rankInCoaching} color="indigo" />
          </div>
          <div className="bg-[#0F1422] p-4 rounded-xl border border-slate-800/80 text-xs text-slate-400 space-y-1">
            <p className="font-semibold text-white">ফি তথ্য:</p>
            <p>পরিশোধিত: ৳{financialOverview.totalPaid.toLocaleString()}</p>
            <p>মেয়াদোত্তীর্ণ সাইকেল: {financialOverview.overdueCyclesCount} টি</p>
          </div>
        </div>
      </div>

      {/* Recent Exam Results Table */}
      <div className="bg-[#121827] rounded-2xl border border-slate-800/80 shadow-xl overflow-hidden">
        <div className="p-5 border-b border-slate-800/80">
          <h2 className="text-base font-semibold text-white">সাম্প্রতিক পরীক্ষা সমূহের নম্বরপত্র</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-[#0F1422] text-slate-400 text-xs uppercase border-b border-slate-800/80">
              <tr>
                <th className="p-4">পরীক্ষার নাম</th>
                <th className="p-4">তারিখ</th>
                <th className="p-4 text-center">প্রাপ্ত নম্বর</th>
                <th className="p-4 text-center">শতকরা (%)</th>
                <th className="p-4 text-right">গ্রেড / স্ট্যাটাস</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {recentResults.map((result) => (
                <tr key={result.resultId} className="hover:bg-slate-800/30 transition">
                  <td className="p-4 font-medium text-white">{result.examTitle}</td>
                  <td className="p-4 text-slate-400">{new Date(result.examDate).toLocaleDateString('bn-BD')}</td>
                  <td className="p-4 text-center font-semibold">{result.marks} / {result.totalMarks}</td>
                  <td className="p-4 text-center font-semibold text-emerald-400">{result.percentage}%</td>
                  <td className="p-4 text-right">
                    {result.isAbsent ? (
                      <span className="text-xs bg-rose-500/10 text-rose-400 border border-rose-500/20 font-semibold px-2.5 py-1 rounded-md">
                        অনুপস্থিত
                      </span>
                    ) : (
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-md border ${
                        result.grade === 'F' 
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' 
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      }`}>
                        {result.grade}
                      </span>
                    )}
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

function StatCard({ title, value, icon }: { title: string; value: string | number; icon: React.ReactNode }) {
  return (
    <div className="bg-[#121827] p-5 rounded-2xl border border-slate-800/80 shadow-xl flex items-center justify-between">
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</p>
        <p className="text-2xl font-bold text-white mt-1">{value}</p>
      </div>
      <div className="p-3 bg-slate-800/40 border border-slate-800 rounded-xl">{icon}</div>
    </div>
  );
}

function RankProgressBar({ title, rank, color }: { title: string; rank: number | null; color: string }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-xs">
        <span className="text-slate-400">{title}</span>
        <span className="font-bold text-white">#{rank ?? 'N/A'}</span>
      </div>
      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
        <div 
          className={`h-full ${color === 'emerald' ? 'bg-emerald-500' : 'bg-indigo-500'} rounded-full`} 
          style={{ width: `${rank ? Math.max(10, 100 - rank * 15) : 0}%` }}
        />
      </div>
    </div>
  );
}