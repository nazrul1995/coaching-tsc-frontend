'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, RefreshCw } from 'lucide-react';
import Swal from 'sweetalert2';
import axiosSecure from '@/lib/axiosSecure';
import StudentTable, { APIStudent } from '@/components/dashboard/addmin/add/student/student-management/StudentTable';
import StudentStats from '@/components/dashboard/addmin/add/student/student-management/StudentState';
import StudentFormModal from '@/components/dashboard/addmin/add/student/StudentFormModal';

export default function StudentManagementPage() {
  const [students, setStudents] = useState<APIStudent[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editStudent, setEditStudent] = useState<APIStudent | null>(null);

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const res = await axiosSecure.get('/students');
      if (res.data?.success && Array.isArray(res.data.data)) {
        setStudents(res.data.data);
      }
    } catch (error) {
      console.warn('API Fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Filter Computation
  const filteredStudents = useMemo(() => {
    const search = searchTerm.toLowerCase();
    return students.filter((student) => {
      const name = student?.name?.toLowerCase() || '';
      const email = student?.email?.toLowerCase() || '';
      const phone = student?.phone || '';
      const institution = student?.institution?.toLowerCase() || '';

      const matchesSearch =
        name.includes(search) ||
        email.includes(search) ||
        phone.includes(searchTerm) ||
        institution.includes(search);

      const matchesClass = selectedClass === 'ALL' || student.className === selectedClass;
      return matchesSearch && matchesClass;
    });
  }, [students, searchTerm, selectedClass]);

  const stats = useMemo(() => ({
    total: students.length,
    scienceCount: students.filter((s) => s.group?.toLowerCase() === 'science').length,
    commerceCount: students.filter((s) => s.group?.toLowerCase() === 'commerce').length,
    humanitiesCount: students.filter((s) => s.group?.toLowerCase() === 'humanities').length,
  }), [students]);

  // Combined Add/Update Handler
  const handleSaveStudent = async (payload: any) => {
    if (editStudent) {
      // PATCH /students/:id
      const res = await axiosSecure.patch(`/students/${editStudent._id}`, payload);
      
      if (res.data?.success && res.data?.student) {
        setStudents((prev) =>
          prev.map((s) => (s._id === editStudent._id ? res.data.student : s))
        );
      } else {
        await fetchStudents();
      }
    } else {
      // POST /students/admin/add
      const res = await axiosSecure.post('/students/admin/add', payload);
      
      if (res.data?.success && res.data?.student) {
        setStudents((prev) => [res.data.student, ...prev]);
      } else {
        await fetchStudents();
      }
    }
  };

  // SweetAlert2 Delete Handler
  const handleDeleteStudent = async (id: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This student record will be permanently deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#374151',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      background: '#0b1326',
      color: '#fff',
      customClass: {
        popup: 'border border-white/10 rounded-2xl shadow-2xl',
      },
    });

    if (!result.isConfirmed) return;

    setDeletingId(id);
    try {
      const res = await axiosSecure.delete(`/students/${id}`);
      if (res.data?.success) {
        setStudents((prev) => prev.filter((s) => s._id !== id));
        
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Student record has been deleted.',
          background: '#0b1326',
          color: '#fff',
          confirmButtonColor: '#2563eb',
          customClass: {
            popup: 'border border-white/10 rounded-2xl shadow-2xl',
          },
        });
      } else {
        await fetchStudents();
      }
    } catch (error: any) {
      console.error('Failed to delete student:', error);
      Swal.fire({
        icon: 'error',
        title: 'Delete Failed',
        text: error?.response?.data?.message || 'Could not delete the student record.',
        background: '#0b1326',
        color: '#fff',
        confirmButtonColor: '#ef4444',
        customClass: {
          popup: 'border border-white/10 rounded-2xl shadow-2xl',
        },
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleOpenAddModal = () => {
    setEditStudent(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (student: APIStudent) => {
    setEditStudent(student);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <StudentStats stats={stats} onOpenModal={handleOpenAddModal} />

      {/* Filter Toolbar */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
        <div className="relative w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            placeholder="Search name, email, phone, school..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 transition-colors"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchStudents}
            disabled={isLoading}
            className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/70 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
            title="Refetch API"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <Filter className="w-4 h-4 text-white/50" />
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-48 px-3 py-2 bg-[#0b1326] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500/50 cursor-pointer"
          >
            <option value="ALL">All Classes</option>
            {['6', '7', '8', '9', '10', '11', '12'].map((cls) => (
              <option key={cls} value={cls}>Class {cls}</option>
            ))}
          </select>
        </div>
      </div>

      <StudentTable
        students={filteredStudents}
        deletingId={deletingId}
        onEdit={handleOpenEditModal}
        onDelete={handleDeleteStudent}
      />

      <StudentFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveStudent}
        editStudent={editStudent}
      />
    </div>
  );
}