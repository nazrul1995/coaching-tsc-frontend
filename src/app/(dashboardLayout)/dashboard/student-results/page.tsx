'use client';
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

import { Plus, Edit, Trash2 } from 'lucide-react';

import { useAuth } from '@/context/AuthContext';
import axiosSecure from '@/lib/axiosSecure';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type Result = {
  _id: string;
  studentId: string;
  studentName: string;
  studentPhoto: string;
  className: string;
  batch: string;
  group: string;
  examName: string;
  subject: string;
  totalMarks: number;
  obtainedMarks: number;
  percentage: number;
  grade: string;
  examAppearedDate: string;
};

const StudentResultsPage = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResult, setEditingResult] = useState<Result | null>(null);
  const [selectedClass, setSelectedClass] = useState('');

  const [formData, setFormData] = useState({
    studentId: '',
    studentName: '',
    studentPhoto: '',
    className: '',
    batch: '',
    group: '',
    examName: '',
    subject: '',
    totalMarks: 100,
    obtainedMarks: 0,
    examAppearedDate: new Date().toISOString().split('T')[0],
  });

  // ================= CALCULATION =================
  const percentage = formData.totalMarks
    ? Math.round((formData.obtainedMarks / formData.totalMarks) * 100)
    : 0;

  const getGrade = (perc: number) => {
    if (perc >= 80) return 'A+';
    if (perc >= 70) return 'A';
    if (perc >= 60) return 'A-';
    if (perc >= 50) return 'B';
    if (perc >= 40) return 'C';
    if (perc >= 33) return 'D';
    return 'F';
  };

  // ================= FETCH RESULTS =================
  const { data: results = [], isLoading } = useQuery({
    queryKey: ['results'],
    queryFn: async () => {
      const res = await axiosSecure.get('/results');
      return res.data?.data || [];
    },
  });

  // ================= FETCH STUDENTS =================
  const { data: students = [], isLoading: studentsLoading } = useQuery({
    queryKey: ['students', selectedClass],
    enabled: !!selectedClass,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/students?class=${selectedClass}`
      );
      return res.data?.data || [];
    },
  });

  // ================= SELECT STUDENT =================
  const handleStudentSelect = (id: string) => {
    const student = students.find((s: any) => s._id === id);
    if (!student) return;

    setFormData((prev) => ({
      ...prev,
      studentId: student._id,
      studentName: student.name,
      studentPhoto: student.photo,
      className: student.className,
      batch: student.batch,
      group: student.group,
    }));
  };

  // ================= MUTATION =================
  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      if (editingResult) {
        return axiosSecure.patch(
          `/results/${editingResult._id}`,
          payload
        );
      }
      return axiosSecure.post('/results', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['results'] });
      setIsModalOpen(false);
      setEditingResult(null);
      setSelectedClass('');

      Swal.fire('Success', 'Result saved successfully', 'success');
    },
  });

  // ================= DELETE =================
  const handleDelete = async (id: string) => {
    const confirm = await Swal.fire({
      title: 'Delete Result?',
      icon: 'warning',
      showCancelButton: true,
    });

    if (confirm.isConfirmed) {
      await axiosSecure.delete(`/results/${id}`);
      queryClient.invalidateQueries({ queryKey: ['results'] });

      Swal.fire('Deleted', 'Result removed', 'success');
    }
  };

  // ================= OPEN MODAL =================
  const openModal = (result?: Result) => {
    if (result) {
      setEditingResult(result);
      setFormData(result);
      setSelectedClass(result.className);
    } else {
      setEditingResult(null);
      setSelectedClass('');

      setFormData({
        studentId: '',
        studentName: '',
        className: '',
        batch: '',
        group: '',
        examName: '',
        subject: '',
        totalMarks: 100,
        obtainedMarks: 0,
        examAppearedDate: new Date().toISOString().split('T')[0],
      });
    }

    setIsModalOpen(true);
  };

  // ================= SUBMIT =================
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    mutation.mutate({
      ...formData,
      percentage,
      grade: getGrade(percentage),
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6 text-white">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Student Results</h1>

        {user?.role === 'teacher' && (
          <Button onClick={() => openModal()}>
            <Plus size={16} /> Add Result
          </Button>
        )}
      </div>

      {/* TABLE */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student</TableHead>
            <TableHead>Class</TableHead>
            <TableHead>Exam</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Marks</TableHead>
            <TableHead>%</TableHead>
            <TableHead>Grade</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {results.map((r: Result) => (
            <TableRow key={r._id}>
              <TableCell>{r.studentName}</TableCell>
              <TableCell>{r.examName}</TableCell>
              <TableCell>{r.className}</TableCell>
              <TableCell>{r.examName}</TableCell>
              <TableCell>{r.subject}</TableCell>
              <TableCell>
                {r.obtainedMarks}/{r.totalMarks}
              </TableCell>
              <TableCell>{r.percentage}%</TableCell>
              <TableCell>{r.grade}</TableCell>

              <TableCell className="flex gap-2">
                <Button size="sm" onClick={() => openModal(r)}>
                  <Edit size={14} />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(r._id)}
                >
                  <Trash2 size={14} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* MODAL */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-[#0b1326] text-white">

          <DialogHeader>
            <DialogTitle>
              {editingResult ? 'Edit Result' : 'Add Result'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* CLASS + STUDENT */}
            <div className="grid grid-cols-2 gap-4">

              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="bg-gray-800 p-2 rounded"
              >
                <option value="">Select Class</option>
                <option value="10">Class 10</option>
                <option value="9">Class 9</option>
                <option value="8">Class 8</option>
              </select>

              <select
                value={formData.studentId}
                onChange={(e) =>
                  handleStudentSelect(e.target.value)
                }
                className="bg-gray-800 p-2 rounded"
                disabled={!selectedClass}
              >
                <option value="">Select Student</option>
                {students.map((s: any) => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* AUTO FIELDS */}
            <div className="grid grid-cols-3 gap-3">
              <Input value={formData.studentName} disabled />
              <Input value={formData.batch} disabled />
              <Input value={formData.group} disabled />
            </div>

            {/* EXAM */}
            <Input
              placeholder="Exam Name"
              value={formData.examName}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  examName: e.target.value,
                })
              }
            />

            <Input
              placeholder="Subject"
              value={formData.subject}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  subject: e.target.value,
                })
              }
            />

            {/* MARKS */}
            <div className="grid grid-cols-2 gap-3">
              <Input
                type="number"
                value={formData.totalMarks}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    totalMarks: Number(e.target.value),
                  })
                }
              />

              <Input
                type="number"
                value={formData.obtainedMarks}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    obtainedMarks: Number(e.target.value),
                  })
                }
              />
            </div>

            <p className="text-center">
              {percentage}% ({getGrade(percentage)})
            </p>

            <Button type="submit" disabled={mutation.isPending}>
              Save Result
            </Button>

          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentResultsPage;