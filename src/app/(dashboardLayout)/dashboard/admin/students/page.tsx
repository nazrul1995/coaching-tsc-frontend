'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Users } from 'lucide-react';
import Swal from 'sweetalert2';

import axiosSecure from '@/lib/axiosSecure';

import {
  DashboardPageHeader,
  DashboardToolbar,
  SearchInput,
  FilterSelect,
  RefreshButton,
} from '@/components/dashboard/common';

import StudentTable, {
  APIStudent,
} from '@/components/dashboard/addmin/add/student/student-management/StudentTable';

import StudentFormModal from '@/components/dashboard/addmin/add/student/StudentFormModal';
import StudentStats from '@/components/dashboard/addmin/add/student/student-management/StudentState';


// ============================================================
// CLASS OPTIONS
// ============================================================

const CLASS_OPTIONS = [
  {
    label: 'All Classes',
    value: 'ALL',
  },

  {
    label: 'Class 6',
    value: '6',
  },

  {
    label: 'Class 7',
    value: '7',
  },

  {
    label: 'Class 8',
    value: '8',
  },

  {
    label: 'Class 9',
    value: '9',
  },

  {
    label: 'Class 10',
    value: '10',
  },

  {
    label: 'Class 11',
    value: '11',
  },

  {
    label: 'Class 12',
    value: '12',
  },
];

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function StudentManagementPage() {
  // ==========================================================
  // 1. STATE
  // ==========================================================

  // All students from API
  const [students, setStudents] = useState<APIStudent[]>([]);

  // Search input
  const [searchTerm, setSearchTerm] = useState('');

  // Selected class filter
  const [selectedClass, setSelectedClass] = useState('ALL');

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // Currently deleting student ID
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Student modal open/close
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Student currently being edited
  //
  // null = Add new student
  // object = Edit existing student
  const [editStudent, setEditStudent] =
    useState<APIStudent | null>(null);

  // ==========================================================
  // 2. FETCH STUDENTS
  // ==========================================================

  const fetchStudents = async () => {
    setIsLoading(true);

    try {
      const response = await axiosSecure.get('/students');

      // Check API response
      if (
        response.data?.success &&
        Array.isArray(response.data.data)
      ) {
        setStudents(response.data.data);
      }
    } catch (error) {
      console.warn('API Fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // ==========================================================
  // 3. FETCH STUDENTS WHEN PAGE LOADS
  // ==========================================================

  useEffect(() => {
    fetchStudents();
  }, []);

  // ==========================================================
  // 4. FILTER STUDENTS
  // ==========================================================

  const filteredStudents = useMemo(() => {
    // Convert search text to lowercase
    const search = searchTerm.toLowerCase().trim();

    return students.filter((student) => {
      // -----------------------------------------------
      // Search by name
      // -----------------------------------------------

      const matchesName = (student.name || '')
        .toLowerCase()
        .includes(search);

      // -----------------------------------------------
      // Search by email
      // -----------------------------------------------

      const matchesEmail = (student.email || '')
        .toLowerCase()
        .includes(search);

      // -----------------------------------------------
      // Search by phone
      // -----------------------------------------------

      const matchesPhone = (student.phone || '')
        .includes(searchTerm);

      // -----------------------------------------------
      // Search by institution
      // -----------------------------------------------

      const matchesInstitution = (student.institution || '')
        .toLowerCase()
        .includes(search);

      // Student must match at least one search field
      const matchesSearch =
        matchesName ||
        matchesEmail ||
        matchesPhone ||
        matchesInstitution;

      // -----------------------------------------------
      // Class filter
      // -----------------------------------------------

      const matchesClass =
        selectedClass === 'ALL' ||
        student.className === selectedClass;

      // Student must match both conditions
      return matchesSearch && matchesClass;
    });
  }, [students, searchTerm, selectedClass]);

  // ==========================================================
  // 5. STUDENT STATISTICS
  // ==========================================================

  const stats = useMemo(() => {
    // Total students
    const total = students.length;

    // Science students
    const scienceCount = students.filter(
      (student) =>
        student.group?.toLowerCase() === 'science'
    ).length;

    // Commerce students
    const commerceCount = students.filter(
      (student) =>
        student.group?.toLowerCase() === 'commerce'
    ).length;

    // Humanities / Arts students
    const humanitiesCount = students.filter(
      (student) =>
        ['humanities', 'arts'].includes(
          student.group?.toLowerCase() || ''
        )
    ).length;

    return {
      total,
      scienceCount,
      commerceCount,
      humanitiesCount,
    };
  }, [students]);

  // ==========================================================
  // 6. OPEN ADD STUDENT MODAL
  // ==========================================================

  const handleAddStudent = () => {
    // No existing student
    setEditStudent(null);

    // Open modal
    setIsModalOpen(true);
  };

  // ==========================================================
  // 7. OPEN EDIT STUDENT MODAL
  // ==========================================================

  const handleEditStudent = (student: APIStudent) => {
    // Store selected student
    setEditStudent(student);

    // Open modal
    setIsModalOpen(true);
  };

  // ==========================================================
  // 8. CLOSE STUDENT MODAL
  // ==========================================================

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // ==========================================================
  // 9. SAVE STUDENT
  // ==========================================================

  const handleSaveStudent = async (payload: any) => {
    // ========================================================
    // EDIT EXISTING STUDENT
    // ========================================================

    if (editStudent) {
      const response = await axiosSecure.patch(
        `/students/${editStudent._id}`,
        payload
      );

      // If update successful
      if (
        response.data?.success &&
        response.data?.student
      ) {
        const updatedStudent = response.data.student;

        // Replace old student with updated student
        setStudents((previousStudents) =>
          previousStudents.map((student) =>
            student._id === editStudent._id
              ? updatedStudent
              : student
          )
        );
      } else {
        // If API response is unexpected,
        // fetch latest students
        await fetchStudents();
      }

      return;
    }

    // ========================================================
    // ADD NEW STUDENT
    // ========================================================

    const response = await axiosSecure.post(
      '/students/admin/add',
      payload
    );

    // If add successful
    if (
      response.data?.success &&
      response.data?.student
    ) {
      const newStudent = response.data.student;

      // Add new student to beginning of array
      setStudents((previousStudents) => [
        newStudent,
        ...previousStudents,
      ]);
    } else {
      // If API response is unexpected,
      // fetch latest students
      await fetchStudents();
    }
  };

  // ==========================================================
  // 10. DELETE STUDENT
  // ==========================================================

  const handleDeleteStudent = async (studentId: string) => {
    // --------------------------------------------------------
    // Ask for confirmation
    // --------------------------------------------------------

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
    });

    // User clicked Cancel
    if (!result.isConfirmed) {
      return;
    }

    // Set deleting student ID
    setDeletingId(studentId);

    try {
      // ------------------------------------------------------
      // Delete request
      // ------------------------------------------------------

      const response = await axiosSecure.delete(
        `/students/${studentId}`
      );

      // ------------------------------------------------------
      // Delete successful
      // ------------------------------------------------------

      if (response.data?.success) {
        // Remove student from local state
        setStudents((previousStudents) =>
          previousStudents.filter(
            (student) => student._id !== studentId
          )
        );

        // Show success message
        await Swal.fire({
          icon: 'success',

          title: 'Deleted!',

          text: 'Student record has been deleted.',

          background: '#0b1326',
          color: '#fff',

          confirmButtonColor: '#2563eb',
        });
      } else {
        // API response unsuccessful
        await fetchStudents();
      }
    } catch (error: any) {
      // ------------------------------------------------------
      // Delete failed
      // ------------------------------------------------------

      await Swal.fire({
        icon: 'error',

        title: 'Delete Failed',

        text:
          error?.response?.data?.message ||
          'Could not delete the student record.',

        background: '#0b1326',
        color: '#fff',

        confirmButtonColor: '#ef4444',
      });
    } finally {
      // Reset deleting state
      setDeletingId(null);
    }
  };

  // ==========================================================
  // 11. RENDER UI
  // ==========================================================

  return (
    <div className="space-y-6">

      {/* ====================================================
          PAGE HEADER
      ==================================================== */}

      <DashboardPageHeader
        eyebrow="Student Management"
        title="Students"
        description="Manage enrolled students, classes, groups and student records."
        icon={Users}
      />

      {/* ====================================================
          STUDENT STATISTICS
      ==================================================== */}

      <StudentStats
        stats={stats}
        onOpenModal={handleAddStudent}
      />

      {/* ====================================================
          SEARCH / FILTER / REFRESH
      ==================================================== */}

      <DashboardToolbar>

        {/* Search box */}
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search name, email, phone, school..."
        />

        <div className="flex items-center gap-3">

          {/* Refresh button */}
          <RefreshButton
            onClick={fetchStudents}
            loading={isLoading}
            title="Refetch students"
          />

          {/* Class filter */}
          <FilterSelect
            value={selectedClass}
            onChange={setSelectedClass}
            options={CLASS_OPTIONS}
          />

        </div>
      </DashboardToolbar>

      {/* ====================================================
          STUDENT TABLE
      ==================================================== */}

      <StudentTable
        students={filteredStudents}
        deletingId={deletingId}
        onEdit={handleEditStudent}
        onDelete={handleDeleteStudent}
      />

      {/* ====================================================
          ADD / EDIT STUDENT MODAL
      ==================================================== */}

      <StudentFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSaveStudent}
        editStudent={editStudent}
      />
    </div>
  );
}
