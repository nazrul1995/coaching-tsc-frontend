'use client';
import React, { useEffect, useState } from 'react';
import { Trophy, Users, Target, RefreshCw } from 'lucide-react';
import Swal from 'sweetalert2';
import axiosSecure from '@/lib/axiosSecure';
import { DashboardPageHeader, DashboardStatCard, DashboardStatGrid, FilterSelect, LoadingState } from '../common';
import LeaderboardTable from './LeaderboardTable';
import { OverallLeaderboardRow } from './result.types';

export default function OverallLeaderboardPage() {
  const [rows, setRows] = useState<OverallLeaderboardRow[]>([]);
  const [className, setClassName] = useState('');
  const [batch, setBatch] = useState('');
  const [examType, setExamType] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (className) params.set('className', className);
      if (batch) params.set('batch', batch);
      if (examType) params.set('examType', examType);
      const response = await axiosSecure.get(`/exams/leaderboard/overall${params.toString() ? `?${params}` : ''}`);
      const data = response.data?.data ?? [];
      setRows(Array.isArray(data) ? data : []);
    } catch (error: any) {
      setRows([]);
      Swal.fire({ icon: 'error', title: 'Unable to load leaderboard', text: error?.response?.data?.message || 'Please try again.', background: '#0b1326', color: '#fff', confirmButtonColor: '#6ffbbe' });
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [className, batch, examType]);

  const top = rows[0];
  const average = rows.length ? rows.reduce((sum, item) => sum + Number(item.averagePercentage || 0), 0) / rows.length : 0;

  if (loading) return <LoadingState label="Loading overall leaderboard..." />;

  return <div className="space-y-6 text-white">
    <DashboardPageHeader title="Overall Leaderboard" description="Compare published exam performance across students." icon={Trophy} />
    <DashboardStatGrid>
      <DashboardStatCard title="Ranked Students" value={String(rows.length)} subtitle="Published result records" icon={Users} color="blue" />
      <DashboardStatCard title="Top Student" value={top?.student?.name || '—'} subtitle={top ? `${top.averagePercentage}% average` : 'No data'} icon={Trophy} color="green" />
      <DashboardStatCard title="Leaderboard Average" value={`${average.toFixed(2)}%`} subtitle="Average of displayed ranks" icon={Target} color="amber" />
      <DashboardStatCard title="Top Exams" value={String(top?.totalExams || 0)} subtitle="Completed published exams" icon={Target} color="rose" />
    </DashboardStatGrid>

    <section className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-4 sm:p-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div><h2 className="text-sm font-black">Leaderboard Filters</h2><p className="mt-1 text-[10px] text-white/30">Only published and non-absent results are included by the backend.</p></div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <FilterSelect value={className} onChange={setClassName} options={['6','7','8','9','10','11','12'].map(value => ({ value, label: `Class ${value}` }))} placeholder="All Classes" />
          <FilterSelect value={batch} onChange={setBatch} options={[]} placeholder="All Batches" />
          <FilterSelect value={examType} onChange={setExamType} options={[{ value: 'weekly', label: 'Weekly' }, { value: 'model_test', label: 'Model Test' }]} placeholder="All Exam Types" />
          <button onClick={load} className="flex h-10 items-center justify-center gap-2 rounded-xl border border-white/10 px-3 text-xs font-bold text-white/60 hover:bg-white/5"><RefreshCw size={14}/> Refresh</button>
        </div>
      </div>
    </section>
    <LeaderboardTable rows={rows} overall />
  </div>;
}
