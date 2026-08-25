'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Users } from 'lucide-react';
import Swal from 'sweetalert2';
import axiosSecure from '@/lib/axiosSecure';
import StudentTable, { APIStudent } from './StudentTable';
import StudentStats from './StudentStats';
import StudentFormModal from '../StudentFormModal';
import { DashboardPageHeader, DashboardToolbar, SearchInput, FilterSelect, RefreshButton } from '@/components/dashboard/common';

export default function StudentManagementPage() {
  const [students, setStudents] = useState<APIStudent[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('ALL');
  const [isLoading, setIsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editStudent, setEditStudent] = useState<APIStudent | null>(null);

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const res = await axiosSecure.get('/students');
      if (res.data?.success && Array.isArray(res.data.data)) setStudents(res.data.data);
    } catch (error) {
      console.warn('API Fetch error:', error);
    } finally { setIsLoading(false); }
  };

  useEffect(() => { fetchStudents(); }, []);

  const filteredStudents = useMemo(() => {
    const search = searchTerm.toLowerCase();
    return students.filter((student) => {
      const matchesSearch =
        (student.name || '').toLowerCase().includes(search) ||
        (student.email || '').toLowerCase().includes(search) ||
        (student.phone || '').includes(searchTerm) ||
        (student.institution || '').toLowerCase().includes(search);
      return matchesSearch && (selectedClass === 'ALL' || student.className === selectedClass);
    });
  }, [students, searchTerm, selectedClass]);

  const stats = useMemo(() => ({
    total: students.length,
    scienceCount: students.filter((s) => s.group?.toLowerCase() === 'science').length,
    commerceCount: students.filter((s) => s.group?.toLowerCase() === 'commerce').length,
    humanitiesCount: students.filter((s) => ['humanities', 'arts'].includes(s.group?.toLowerCase() || '')).length,
  }), [students]);

  const handleSaveStudent = async (payload: any) => {
    if (editStudent) {
      const res = await axiosSecure.patch(`/students/${editStudent._id}`, payload);
      if (res.data?.success && res.data?.student) setStudents((prev) => prev.map((s) => s._id === editStudent._id ? res.data.student : s));
      else await fetchStudents();
    } else {
      const res = await axiosSecure.post('/students/admin/add', payload);
      if (res.data?.success && res.data?.student) setStudents((prev) => [res.data.student, ...prev]);
      else await fetchStudents();
    }
  };

  const handleDeleteStudent = async (id: string) => {
    const result = await Swal.fire({ title: 'Are you sure?', text: 'This student record will be permanently deleted!', icon: 'warning', showCancelButton: true, confirmButtonColor: '#ef4444', cancelButtonColor: '#374151', confirmButtonText: 'Yes, delete it!', cancelButtonText: 'Cancel', background: '#0b1326', color: '#fff' });
    if (!result.isConfirmed) return;
    setDeletingId(id);
    try {
      const res = await axiosSecure.delete(`/students/${id}`);
      if (res.data?.success) {
        setStudents((prev) => prev.filter((s) => s._id !== id));
        await Swal.fire({ icon: 'success', title: 'Deleted!', text: 'Student record has been deleted.', background: '#0b1326', color: '#fff', confirmButtonColor: '#2563eb' });
      } else await fetchStudents();
    } catch (error: any) {
      await Swal.fire({ icon: 'error', title: 'Delete Failed', text: error?.response?.data?.message || 'Could not delete the student record.', background: '#0b1326', color: '#fff', confirmButtonColor: '#ef4444' });
    } finally { setDeletingId(null); }
  };

  return (
    <div className="space-y-6">
      <DashboardPageHeader eyebrow="Student Management" title="Students" description="Manage enrolled students, classes, groups and student records." icon={Users} />
      <StudentStats stats={stats} onOpenModal={() => { setEditStudent(null); setIsModalOpen(true); }} />

      <DashboardToolbar>
        <SearchInput value={searchTerm} onChange={setSearchTerm} placeholder="Search name, email, phone, school..." />
        <div className="flex items-center gap-3">
          <RefreshButton onClick={fetchStudents} loading={isLoading} title="Refetch students" />
          <FilterSelect
            value={selectedClass}
            onChange={setSelectedClass}
            options={[{ label: 'All Classes', value: 'ALL' }, ...['6','7','8','9','10','11','12'].map((cls) => ({ label: `Class ${cls}`, value: cls }))]}
          />
        </div>
      </DashboardToolbar>

      <StudentTable students={filteredStudents} deletingId={deletingId} onEdit={(student) => { setEditStudent(student); setIsModalOpen(true); }} onDelete={handleDeleteStudent} />

      <StudentFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleSaveStudent} editStudent={editStudent} />
    </div>
  );
}
