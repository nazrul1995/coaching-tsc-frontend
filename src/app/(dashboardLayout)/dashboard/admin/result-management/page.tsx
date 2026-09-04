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
  
  // New Filter States
  const [selectedBatch, setSelectedBatch] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [loading, setLoading] = useState(true);
  const [resultLoading, setResultLoading] = useState(false);
  const [entryOpen, setEntryOpen] = useState(false);
  const [workflowOpen, setWorkflowOpen] = useState(false);

  const selectedExam = useMemo(
    () => exams.find((exam) => exam._id === selectedExamId) || null,
    [exams, selectedExamId]
  );

  console.log('selected exam', selectedExam);

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
      const [resultResponse, leaderboardResponse] = await Promise.all([
        axiosSecure.get(`/exams/${selectedExamId}/results`),
        axiosSecure.get(`/exams/${selectedExamId}/leaderboard`),
      ]);

      setResults(resultResponse.data?.data || []);
      setLeaderboard(leaderboardResponse.data?.data || []);
    } catch (error: any) {
      setResults([]);
      setLeaderboard([]);

      Swal.fire({
        icon: 'error',
        title: 'Unable to load results',
        text: error?.response?.data?.message || 'Please try again.',
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

  // Dynamic Batch List extraction from current exam results
  const batchOptions = useMemo(() => {
    const uniqueBatches = Array.from(
      new Set(
        results
          .map((r) => r.student?.batch)
          .filter((b): b is string => Boolean(b))
      )
    );
    return [
      { value: '', label: 'All Batches' },
      ...uniqueBatches.map((batch) => ({ value: batch, label: batch })),
    ];
  }, [results]);

  // Enhanced Multi-Filter Logic
  const filtered = useMemo(() => {
    const query = search.toLowerCase().trim();

    return results.filter((result) => {
      // Search Query Filter
      const matchesSearch =
        !query ||
        result.student?.name?.toLowerCase().includes(query) ||
        String(result.student?.className || '').includes(query) ||
        String(result.student?.batch || '').toLowerCase().includes(query);

      // Batch Filter
      const matchesBatch =
        !selectedBatch || result.student?.batch === selectedBatch;

      // Group Filter
      const matchesGroup =
        !selectedGroup ||
        result.student?.group?.toLowerCase() === selectedGroup.toLowerCase();

      // Attendance Filter
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'present' && !result.isAbsent) ||
        (statusFilter === 'absent' && result.isAbsent);

      return matchesSearch && matchesBatch && matchesGroup && matchesStatus;
    });
  }, [results, search, selectedBatch, selectedGroup, statusFilter]);

  const present = results.filter((result) => !result.isAbsent).length;
  const absent = results.filter((result) => result.isAbsent).length;

  if (loading) {
    return <LoadingState />;
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

      {/* Filter and Control Panel */}
      <div className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-4 sm:p-5 backdrop-blur-xl">
        {/* Filters Grid */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {/* 1. Exam Filter */}
          <FilterSelect
            value={selectedExamId}
            onChange={setSelectedExamId}
            options={exams.map((e) => ({
              value: e._id,
              label: `${e.title} · Class ${e.className}`,
            }))}
            placeholder="Select Exam"
          />

          {/* 2. Batch Filter */}
          <FilterSelect
            value={selectedBatch}
            onChange={setSelectedBatch}
            options={batchOptions}
            placeholder="All Batches"
          />

          {/* 3. Group Filter */}
          <FilterSelect
            value={selectedGroup}
            onChange={setSelectedGroup}
            options={[
              { value: '', label: 'All Groups' },
              { value: 'science', label: 'Science' },
              { value: 'commerce', label: 'Business Studies' },
              { value: 'arts', label: 'Humanities' },
              { value: 'general', label: 'General' },
            ]}
            placeholder="All Groups"
          />

          {/* 4. Result Status Filter */}
          <FilterSelect
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { value: 'all', label: 'All Attendance' },
              { value: 'present', label: 'Present Only' },
              { value: 'absent', label: 'Absent Only' },
            ]}
            placeholder="Attendance Status"
          />
        </div>

        {/* Actions and Tabs Bar */}
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-white/10 pt-4">
          {/* Tab Navigation */}
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => setTab('results')}
              className={`flex items-center gap-2 border-b-2 px-4 py-2 text-xs font-bold transition-all ${
                tab === 'results'
                  ? 'border-[#6ffbbe] text-[#6ffbbe]'
                  : 'border-transparent text-white/40 hover:text-white/70'
              }`}
            >
              Results
            </button>

            <button
              type="button"
              onClick={() => setTab('leaderboard')}
              className={`flex items-center gap-1.5 border-b-2 px-4 py-2 text-xs font-bold transition-all ${
                tab === 'leaderboard'
                  ? 'border-[#6ffbbe] text-[#6ffbbe]'
                  : 'border-transparent text-white/40 hover:text-white/70'
              }`}
            >
              <Trophy
                size={14}
                className={tab === 'leaderboard' ? 'text-[#6ffbbe]' : 'text-white/40'}
              />
              Leaderboard
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setEntryOpen(true)}
              disabled={!selectedExam || selectedExam.status === 'published'}
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#adc6ff] to-[#6ffbbe] px-4 py-2.5 text-xs font-black text-[#0b1326] shadow-lg shadow-[#6ffbbe]/10 transition-all hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Enter Results
            </button>

            <button
              type="button"
              onClick={loadResult}
              disabled={resultLoading || !selectedExamId}
              className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.02] px-4 py-2.5 text-xs font-bold text-white/70 transition-all hover:bg-white/10 hover:text-white active:scale-95 disabled:opacity-40"
            >
              {resultLoading ? 'Loading...' : 'Refresh'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
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

      {/* Loading Overlay Badge */}
      {resultLoading && (
        <div className="fixed bottom-5 right-5 rounded-xl border border-white/10 bg-[#0b1326] px-4 py-3 text-xs text-white/60 shadow-2xl backdrop-blur-md">
          Loading...
        </div>
      )}
    </div>
  );
}