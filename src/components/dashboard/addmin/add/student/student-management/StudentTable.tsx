'use client';

import React from 'react';
import {
  Mail,
  Building2,
  Phone,
  Trash2,
  Edit3,
  Loader2,
  Eye,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

import {
  DashboardTableWrapper,
  EmptyState,
} from '@/components/dashboard/common';

export interface APIStudent {
  _id: string;
  name: string;
  email: string;
  guradianName: string;
  phone: string;
  institution: string;
  className: string;
  batch?: string;
  group?: string;
  photo?: string;
  monthlyFee?: number;
  admissionDate: string;
}

interface StudentTableProps {
  students: APIStudent[];
  deletingId: string | null;
  onEdit: (student: APIStudent) => void;
  onDelete: (id: string) => void;
}

export default function StudentTable({
  students,
  deletingId,
  onEdit,
  onDelete,
}: StudentTableProps) {
  const router = useRouter();

const handleViewProfile = (studentEmail: string) => {
  router.push(
    `/dashboard/admin/students/profile?studentEmail=${encodeURIComponent(
      studentEmail
    )}`
  );
};


  return (
    <DashboardTableWrapper>
      <table className="w-full min-w-212.5 text-left text-sm text-white/80">
        <thead className="border-b border-white/10 bg-white/5 text-xs uppercase tracking-wider text-white/50">
          <tr>
            <th className="px-6 py-4">Student Info</th>
            <th className="px-6 py-4">Class &amp; Group</th>
            <th className="px-6 py-4">Institution</th>
            <th className="px-6 py-4">Guardian Details</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-white/5">
          {students.map((student) => (
            <tr
              key={student._id}
              className="transition-colors hover:bg-white/5"
            >
              {/* Student Info */}
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-gradient-to-tr from-blue-600 to-indigo-600 font-bold text-white">
                    {student.photo ? (
                      <img
                        src={student.photo}
                        alt={student.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      student.name.charAt(0).toUpperCase()
                    )}
                  </div>

                  <div>
                    <div className="font-semibold text-white">
                      {student.name}
                    </div>

                    <div className="mt-0.5 flex items-center gap-1 text-xs text-white/50">
                      <Mail className="h-3 w-3 text-blue-400" />
                      {student.email}
                    </div>
                  </div>
                </div>
              </td>

              {/* Class & Group */}
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <span className="rounded-lg border border-blue-500/20 bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-400">
                    Class {student.className}
                  </span>

                  <span className="text-xs uppercase text-white/50">
                    {student.group || 'GENERAL'}
                  </span>
                </div>

                {student.batch && (
                  <div className="mt-1 text-xs text-white/40">
                    Batch: {student.batch}
                  </div>
                )}
              </td>

              {/* Institution */}
              <td className="px-6 py-4">
                <div className="flex items-center gap-1.5 text-white/90">
                  <Building2 className="h-3.5 w-3.5 shrink-0 text-white/40" />

                  <span className="max-w-[200px] truncate">
                    {student.institution}
                  </span>
                </div>
              </td>

              {/* Guardian */}
              <td className="px-6 py-4">
                <div className="text-white/90">
                  {student.guradianName}
                </div>

                <div className="mt-0.5 flex items-center gap-1 text-xs text-white/50">
                  <Phone className="h-3 w-3" />
                  {student.phone}
                </div>
              </td>

              {/* Actions */}
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">

                  {/* Edit */}
                  <button
                    type="button"
                    onClick={() => onEdit(student)}
                    className="cursor-pointer rounded-lg p-2 text-white/50 transition-colors hover:bg-blue-500/20 hover:text-blue-400"
                    title="Edit Student"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>

                  {/* View Profile */}
                  <button
                    type="button"
                    onClick={() => handleViewProfile(student.email)}
                    className="cursor-pointer rounded-lg p-2 text-white/50 transition-colors hover:bg-emerald-500/20 hover:text-emerald-400"
                    title="View Student Profile"
                  >
                    <Eye className="h-4 w-4" />
                  </button>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => onDelete(student._id)}
                    disabled={deletingId === student._id}
                    className="cursor-pointer rounded-lg p-2 text-white/50 transition-colors hover:bg-rose-500/20 hover:text-rose-400 disabled:opacity-50"
                    title="Delete Student"
                  >
                    {deletingId === student._id ? (
                      <Loader2 className="h-4 w-4 animate-spin text-rose-400" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>

                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {students.length === 0 && (
        <EmptyState
          title="No matching student records found"
          description="Try changing your search or class filter."
        />
      )}
    </DashboardTableWrapper>
  );
}