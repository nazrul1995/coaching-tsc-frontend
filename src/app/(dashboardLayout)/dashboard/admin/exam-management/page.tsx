'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import Swal from 'sweetalert2';

import axiosSecure from '@/lib/axiosSecure';
import { Exam, ExamResultEntry } from '@/components/dashboard/addmin/exam-management';
import { DashboardPageHeader, DashboardToolbar, EmptyState, FilterSelect, LoadingState, RefreshButton, SearchInput } from '@/components/dashboard/common';
import ExamStats from '@/components/dashboard/addmin/exam-management/ExamStats';
import ExamFormModal from '@/components/dashboard/addmin/exam-management/ExamFormModal';
import ExamTable from '@/components/dashboard/addmin/exam-management/ExamTable';
import ExamWorkflowPanel from '@/components/dashboard/addmin/exam-management/ExamWorkflowPanel';

export default function ExamManagementPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [type, setType] = useState('all');

  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  const [selected, setSelected] = useState<Exam | null>(null);
  const [entryOpen, setEntryOpen] = useState(false);
  const [workflowOpen, setWorkflowOpen] = useState(false);

  // -----------------------------
  // Fetch Exams
  // -----------------------------

  const fetchExams = async () => {
    setLoading(true);

    try {
      const response = await axiosSecure.get('/exams');

      setExams(response.data?.data || []);
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

  useEffect(() => {
    fetchExams();
  }, []);

  // -----------------------------
  // Filter Exams
  // -----------------------------

  const filtered = useMemo(() => {
    const query = search.toLowerCase().trim();

    return exams.filter((exam) => {
      const matchesSearch =
        !query ||
        exam.title.toLowerCase().includes(query) ||
        exam.subject.toLowerCase().includes(query) ||
        exam.className.toLowerCase().includes(query);

      const matchesStatus =
        status === 'all' || exam.status === status;

      const matchesType =
        type === 'all' || exam.type === type;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesType
      );
    });
  }, [exams, search, status, type]);

  // -----------------------------
  // Statistics
  // -----------------------------

  const stats = {
    total: exams.length,
    published: exams.filter(
      (exam) => exam.status === 'published'
    ).length,
    draft: exams.filter(
      (exam) => exam.status === 'draft'
    ).length,
  };

  // -----------------------------
  // Create Exam
  // -----------------------------

  const create = async (
    payload: Record<string, unknown>
  ) => {
    setCreating(true);

    try {
      const response = await axiosSecure.post(
        '/exams',
        payload
      );

      if (response.data?.data) {
        setExams((previous) => [
          response.data.data,
          ...previous,
        ]);
      }

      setCreateOpen(false);

      await Swal.fire({
        icon: 'success',
        title: 'Exam created',
        text:
          response.data?.message ||
          'Exam created as draft.',
        background: '#0b1326',
        color: '#fff',
        confirmButtonColor: '#6ffbbe',
      });
    } catch (error) {
      throw error;
    } finally {
      setCreating(false);
    }
  };

  // -----------------------------
  // Publish Exam
  // -----------------------------

  const publish = async (exam: Exam) => {
    const confirmation = await Swal.fire({
      title: 'Publish exam?',
      text:
        'Once published, eligible students can receive result entries.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Publish',
      background: '#0b1326',
      color: '#fff',
      confirmButtonColor: '#6ffbbe',
    });

    if (!confirmation.isConfirmed) {
      return;
    }

    try {
      const response = await axiosSecure.patch(
        `/exams/${exam._id}/publish`
      );

      setExams((previous) =>
        previous.map((item) =>
          item._id === exam._id
            ? response.data?.data || {
                ...item,
                status: 'published',
              }
            : item
        )
      );

      Swal.fire({
        icon: 'success',
        title: 'Exam published',
        background: '#0b1326',
        color: '#fff',
        confirmButtonColor: '#6ffbbe',
      });
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Publish failed',
        text:
          error?.response?.data?.message ||
          'Unable to publish exam.',
        background: '#0b1326',
        color: '#fff',
      });
    }
  };

  // -----------------------------
  // Loading State
  // -----------------------------

  if (loading) {
    return (
      <LoadingState message="Loading exams..." />
    );
  }

  // -----------------------------
  // Page
  // -----------------------------

  return (
    <div className="space-y-6">
      {/* Page Header */}

      <DashboardPageHeader
        eyebrow="Academic Management"
        title="Exam Management"
        description="Create exams, publish them, enter eligible student results and manage the result publishing workflow."
        icon={Plus}
        actions={
          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="flex h-11 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#adc6ff] to-[#6ffbbe] px-5 text-xs font-black text-[#0b1326]"
          >
            <Plus size={16} />
            Create Exam
          </button>
        }
      />

      {/* Statistics */}

      <ExamStats
        {...stats}
        onCreate={() => setCreateOpen(true)}
      />

      {/* Filters */}

      <DashboardToolbar>
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search exam, subject, class..."
        />

        <FilterSelect
          value={type}
          onChange={setType}
          options={[
            {
              value: 'all',
              label: 'All Types',
            },
            {
              value: 'weekly',
              label: 'Weekly',
            },
            {
              value: 'model_test',
              label: 'Model Test',
            },
          ]}
        />

        <FilterSelect
          value={status}
          onChange={setStatus}
          options={[
            {
              value: 'all',
              label: 'All Status',
            },
            {
              value: 'draft',
              label: 'Draft',
            },
            {
              value: 'published',
              label: 'Published',
            },
          ]}
        />

        <RefreshButton
          onClick={async () => {
            setRefreshing(true);

            await fetchExams();

            setRefreshing(false);
          }}
          loading={refreshing}
        />
      </DashboardToolbar>

      {/* Exam Table / Empty State */}

      {filtered.length > 0 ? (
        <ExamTable
          exams={filtered}
          onPublish={publish}
          onOpen={(exam) => {
            setSelected(exam);
            setWorkflowOpen(true);
          }}
          onResults={(exam) => {
            setSelected(exam);
            setEntryOpen(true);
          }}
        />
      ) : (
        <EmptyState
          title="No exams found"
          description="Try changing your filters or create a new exam."
        />
      )}

      {/* Create Exam Modal */}

      <ExamFormModal
        open={createOpen}
        submitting={creating}
        onClose={() => setCreateOpen(false)}
        onSubmit={create}
      />

      {/* Result Entry */}

      <ExamResultEntry
        exam={selected}
        open={entryOpen}
        onClose={() => {
          setEntryOpen(false);

          if (selected) {
            setWorkflowOpen(true);
          }
        }}
      />

      {/* Workflow */}

      <ExamWorkflowPanel
        exam={selected}
        open={workflowOpen}
        onClose={() => setWorkflowOpen(false)}
        onEnterResults={() => {
          setWorkflowOpen(false);
          setEntryOpen(true);
        }}
      />
    </div>
  );
}
