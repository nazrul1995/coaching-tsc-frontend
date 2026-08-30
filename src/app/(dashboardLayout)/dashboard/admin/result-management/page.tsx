'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  BarChart3,
  ClipboardCheck,
  ListChecks,
  Trophy,
  Users,
} from 'lucide-react';
import Swal from 'sweetalert2';

import axiosSecure from '@/lib/axiosSecure';
import {
  DashboardPageHeader,
  DashboardStatCard,
  DashboardStatGrid,
  FilterSelect,
  LoadingState,
  SearchInput,
} from '@/components/dashboard/common';

import { Exam } from '../../../../../components/dashboard/addmin/exam-management/exam.types';
import {
  ExamResultRecord,
  LeaderboardRow,
} from '../../../../../components/dashboard/addmin/exam-management/result.types';

import ExamResultEntry from '../../../../../components/dashboard/addmin/exam-management/ExamResultEntry';
import ExamResultTable from '../../../../../components/dashboard/addmin/exam-management/ExamResultTable';
import LeaderboardTable from '../../../../../components/dashboard/addmin/exam-management/LeaderboardTable';

export default function ExamResultManagementPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [selectedExamId, setSelectedExamId] = useState('');
  const [results, setResults] = useState<ExamResultRecord[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardRow[]>([]);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'results' | 'leaderboard'>('results');
  const [loading, setLoading] = useState(true);
  const [resultLoading, setResultLoading] = useState(false);
  const [entryOpen, setEntryOpen] = useState(false);

  const selectedExam = useMemo(
    () =>
      exams.find((exam) => exam._id === selectedExamId) || null,
    [exams, selectedExamId]
  );
console.log("selected exma",selectedExam)
  const loadExams = async () => {
    setLoading(true);

    try {
      const response = await axiosSecure.get('/exams');
      const data = response.data?.data || response.data || [];

      setExams(Array.isArray(data) ? data : []);

      if (!selectedExamId && data?.length) {
        setSelectedExamId(data[0]._id);
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Unable to load exams',
        background: '#0b1326',
        color: '#fff',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadResult = async () => {
    if (!selectedExamId) {
      setResults([]);
      setLeaderboard([]);
      return;
    }

    setResultLoading(true);

    try {
      const [resultResponse, leaderboardResponse] =
        await Promise.all([
          axiosSecure.get(
            `/exams/${selectedExamId}/results`
          ),
          axiosSecure.get(
            `/exams/${selectedExamId}/leaderboard`
          ),
        ]);

      setResults(resultResponse.data?.data || []);
      setLeaderboard(leaderboardResponse.data?.data || []);
    } catch (error: any) {
      setResults([]);
      setLeaderboard([]);

      Swal.fire({
        icon: 'error',
        title: 'Unable to load results',
        text:
          error?.response?.data?.message ||
          'Please try again.',
        background: '#0b1326',
        color: '#fff',
      });
    } finally {
      setResultLoading(false);
    }
  };

  useEffect(() => {
    loadExams();
  }, []);

  useEffect(() => {
    loadResult();
  }, [selectedExamId]);

  const filtered = useMemo(() => {
    const query = search.toLowerCase().trim();

    return results.filter((result) => {
      return (
        !query ||
        result.student?.name?.toLowerCase().includes(query) ||
        String(result.student?.className || '').includes(query) ||
        String(result.student?.batch || '')
          .toLowerCase()
          .includes(query)
      );
    });
  }, [results, search]);

  const present = results.filter(
    (result) => !result.isAbsent
  ).length;

  const absent = results.filter(
    (result) => result.isAbsent
  ).length;

  if (loading) {
    return <LoadingState/>
  }

  return (
    <div className="space-y-6 text-white">
      <DashboardPageHeader
        title="Exam Results"
        description="Enter, review and analyze exam results and leaderboard performance."
        icon={ClipboardCheck}
      />

      <DashboardStatGrid>
        <DashboardStatCard
          title="Selected Exam"
          value={selectedExam?.title || '—'}
          subtitle={selectedExam?.status || '—'}
          icon={ClipboardCheck}
          accent="blue"
        />

        <DashboardStatCard
          title="Results"
          value={String(results.length)}
          subtitle="Loaded result records"
          icon={ListChecks}
          accent="green"
        />

        <DashboardStatCard
          title="Present"
          value={String(present)}
          subtitle="Students with marks"
          icon={Users}
          accent="blue"
        />

        <DashboardStatCard
          title="Absent"
          value={String(absent)}
          subtitle="Absent records"
          icon={BarChart3}
          accent="rose"
        />
      </DashboardStatGrid>

      <div className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-4 sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <FilterSelect
            value={selectedExamId}
            onChange={setSelectedExamId}
            options={exams.map((exam) => ({
              value: exam._id,
              label: `${exam.title} · ${exam.className}`,
            }))}
            placeholder="Slect Exam"
          />

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setEntryOpen(true)}
              disabled={!selectedExam}
              className="rounded-xl bg-linear-to-r from-[#adc6ff] to-[#6ffbbe] px-4 py-2.5 text-xs font-black text-[#0b1326] disabled:opacity-40"
            >
              Enter Results
            </button>

            <button
              type="button"
              onClick={loadResult}
              disabled={resultLoading || !selectedExamId}
              className="rounded-xl border border-white/10 px-4 py-2.5 text-xs font-bold text-white/60 hover:bg-white/5 disabled:opacity-40"
            >
              {resultLoading ? 'Loading...' : 'Refresh'}
            </button>
          </div>
        </div>

        <div className="mt-4 flex gap-2 border-b border-white/10">
          <button
            type="button"
            onClick={() => setTab('results')}
            className={`border-b-2 px-3 py-2 text-xs font-bold ${
              tab === 'results'
                ? 'border-[#6ffbbe] text-[#6ffbbe]'
                : 'border-transparent text-white/40'
            }`}
          >
            Results
          </button>

          <button
            type="button"
            onClick={() => setTab('leaderboard')}
            className={`flex items-center gap-1 border-b-2 px-3 py-2 text-xs font-bold ${
              tab === 'leaderboard'
                ? 'border-[#6ffbbe] text-[#6ffbbe]'
                : 'border-transparent text-white/40'
            }`}
          >
            <Trophy size={13} />
            Leaderboard
          </button>
        </div>
      </div>

      {tab === 'results' ? (
        <>
          <div className="flex justify-end">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search student..."
            />
          </div>

          <ExamResultTable results={filtered} />
        </>
      ) : (
        <LeaderboardTable rows={leaderboard} />
      )}

      {resultLoading && (
        <div className="fixed bottom-5 right-5 rounded-xl border border-white/10 bg-[#0b1326] px-4 py-3 text-xs text-white/60 shadow-2xl">
          Loading...
        </div>
      )}

      <ExamResultEntry
        exam={selectedExam}
        open={entryOpen}
        onClose={() => {
          setEntryOpen(false);
          loadResult();
        }}
      />
    </div>
  );
}
