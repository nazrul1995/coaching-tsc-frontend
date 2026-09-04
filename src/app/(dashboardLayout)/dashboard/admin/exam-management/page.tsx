'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import Swal from 'sweetalert2';

import axiosSecure from '@/lib/axiosSecure';
import { Exam, ExamResultEntry } from '@/components/dashboard/addmin/exam-management';
import {
  DashboardPageHeader,
  DashboardToolbar,
  EmptyState,
  FilterSelect,
  LoadingState,
  RefreshButton,
  SearchInput,
} from '@/components/dashboard/common';
import ExamStats from '@/components/dashboard/addmin/exam-management/ExamStats';
import ExamFormModal from '@/components/dashboard/addmin/exam-management/ExamFormModal';
import ExamTable from '@/components/dashboard/addmin/exam-management/ExamTable';
import ExamWorkflowPanel from '@/components/dashboard/addmin/exam-management/ExamWorkflowPanel';

export default function ExamManagementPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filter States
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [type, setType] = useState('all');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedBatch, setSelectedBatch] = useState('all');
  const [selectedGroup, setSelectedGroup] = useState('all');

  // Modals & Panels States
  const [formOpen, setFormOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);

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
  // Extract Dynamic Options
  // -----------------------------

  const classOptions = useMemo(() => {
    const classes = Array.from(
      new Set(exams.map((e) => e.className).filter(Boolean))
    );
    return [
      { value: 'all', label: 'All Classes' },
      ...classes.map((c) => ({ value: c, label: `Class ${c}` })),
    ];
  }, [exams]);

  const batchOptions = useMemo(() => {
    const batches = Array.from(
      new Set(exams.map((e) => e.batch).filter(Boolean))
    );
    return [
      { value: 'all', label: 'All Batches' },
      ...batches.map((b) => ({ value: b, label: b })),
    ];
  }, [exams]);

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

      const matchesStatus = status === 'all' || exam.status === status;
      const matchesType = type === 'all' || exam.type === type;
      const matchesClass =
        selectedClass === 'all' || exam.className === selectedClass;
      const matchesBatch =
        selectedBatch === 'all' || exam.batch === selectedBatch;
      const matchesGroup =
        selectedGroup === 'all' ||
        exam.group?.toLowerCase() === selectedGroup.toLowerCase();

      return (
        matchesSearch &&
        matchesStatus &&
        matchesType &&
        matchesClass &&
        matchesBatch &&
        matchesGroup
      );
    });
  }, [exams, search, status, type, selectedClass, selectedBatch, selectedGroup]);

  // -----------------------------
  // Statistics
  // -----------------------------

  const stats = {
    total: exams.length,
    published: exams.filter((exam) => exam.status === 'published').length,
    draft: exams.filter((exam) => exam.status === 'draft').length,
  };

  // -----------------------------
  // Modal Open Handlers
  // -----------------------------

  const handleOpenCreateModal = () => {
    setEditingExam(null);
    setFormOpen(true);
  };

  const handleOpenEditModal = (exam: Exam) => {
    setEditingExam(exam);
    setFormOpen(true);
  };

  // -----------------------------
  // Save Exam (Create & Update)
  // -----------------------------

  const handleSaveExam = async (payload: Record<string, unknown>) => {
    setSubmitting(true);

    try {
      if (editingExam) {
        // Update existing exam
        const response = await axiosSecure.put(`/exams/${editingExam._id}`, payload);
        const updatedExam = response.data?.data;

        setExams((previous) =>
          previous.map((item) => (item._id === editingExam._id ? updatedExam : item))
        );

        Swal.fire({
          icon: 'success',
          title: 'Exam updated',
          text: response.data?.message || 'Exam updated successfully.',
          background: '#0b1326',
          color: '#fff',
          confirmButtonColor: '#6ffbbe',
        });
      } else {
        // Create new exam
        const response = await axiosSecure.post('/exams', payload);

        if (response.data?.data) {
          setExams((previous) => [response.data.data, ...previous]);
        }

        Swal.fire({
          icon: 'success',
          title: 'Exam created',
          text: response.data?.message || 'Exam created as draft.',
          background: '#0b1326',
          color: '#fff',
          confirmButtonColor: '#6ffbbe',
        });
      }

      setFormOpen(false);
      setEditingExam(null);
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: editingExam ? 'Update failed' : 'Creation failed',
        text: error?.response?.data?.message || 'Something went wrong.',
        background: '#0b1326',
        color: '#fff',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // -----------------------------
  // Delete Exam
  // -----------------------------

  const handleDeleteExam = async (exam: Exam) => {
    const confirmation = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you really want to delete "${exam.title}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel',
      background: '#0b1326',
      color: '#fff',
      confirmButtonColor: '#ff5555',
      cancelButtonColor: '#2b354f',
    });

    if (!confirmation.isConfirmed) return;

    try {
      await axiosSecure.delete(`/exams/${exam._id}`);

      setExams((previous) => previous.filter((item) => item._id !== exam._id));

      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'Exam has been deleted.',
        background: '#0b1326',
        color: '#fff',
        confirmButtonColor: '#6ffbbe',
      });
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Delete failed',
        text: error?.response?.data?.message || 'Unable to delete exam.',
        background: '#0b1326',
        color: '#fff',
      });
    }
  };

  // -----------------------------
  // Publish Exam
  // -----------------------------

  const publish = async (exam: Exam) => {
    const confirmation = await Swal.fire({
      title: 'Publish exam?',
      text: 'Once published, eligible students can receive result entries.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Publish',
      background: '#0b1326',
      color: '#fff',
      confirmButtonColor: '#6ffbbe',
    });

    if (!confirmation.isConfirmed) return;

    try {
      const response = await axiosSecure.patch(`/exams/${exam._id}/publish`);

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
        text: error?.response?.data?.message || 'Unable to publish exam.',
        background: '#0b1326',
        color: '#fff',
      });
    }
  };

  // -----------------------------
  // Loading State
  // -----------------------------

  if (loading) {
    return <LoadingState message="Loading exams..." />;
  }

  // -----------------------------
  // Page Render
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
            onClick={handleOpenCreateModal}
            className="flex h-11 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#adc6ff] to-[#6ffbbe] px-5 text-xs font-black text-[#0b1326] shadow-lg shadow-[#6ffbbe]/10 transition-transform active:scale-95"
          >
            <Plus size={16} />
            Create Exam
          </button>
        }
      />

      {/* Statistics */}
      <ExamStats {...stats} onCreate={handleOpenCreateModal} />

      {/* Filters & Actions Toolbar */}
      <DashboardToolbar>
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search exam, subject, class..."
        />

        {/* Type Filter */}
        <FilterSelect
          value={type}
          onChange={setType}
          options={[
            { value: 'all', label: 'All Types' },
            { value: 'weekly', label: 'Weekly Tutorial' },
            { value: 'monthly', label: 'Monthly Exam' },
            { value: 'model_test', label: 'Model Test' },
            { value: 'term_final', label: 'Term Final' },
          ]}
        />

        {/* Status Filter */}
        <FilterSelect
          value={status}
          onChange={setStatus}
          options={[
            { value: 'all', label: 'All Status' },
            { value: 'draft', label: 'Draft' },
            { value: 'published', label: 'Published' },
            { value: 'archived', label: 'Archived' },
          ]}
        />

        {/* Dynamic Class Filter */}
        <FilterSelect
          value={selectedClass}
          onChange={setSelectedClass}
          options={classOptions}
        />

        {/* Group Filter */}
        <FilterSelect
          value={selectedGroup}
          onChange={setSelectedGroup}
          options={[
            { value: 'all', label: 'All Groups' },
            { value: 'science', label: 'Science' },
            { value: 'commerce', label: 'Business Studies' },
            { value: 'arts', label: 'Humanities' },
            { value: 'general', label: 'General' },
          ]}
        />

        {/* Refresh Button */}
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
          onEdit={handleOpenEditModal}
          onDelete={handleDeleteExam}
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

      {/* Reusable Exam Form Modal (Create / Edit) */}
      <ExamFormModal
        open={formOpen}
        initialData={editingExam}
        submitting={submitting}
        onClose={() => {
          setFormOpen(false);
          setEditingExam(null);
        }}
        onSubmit={handleSaveExam}
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

      {/* Workflow Panel */}
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