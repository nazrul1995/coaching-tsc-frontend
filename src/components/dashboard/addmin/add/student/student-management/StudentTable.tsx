'use client';

import React from 'react';
import { Mail, Building2, Phone, Trash2, Edit3, Loader2 } from 'lucide-react';

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
  monthlyFee?:number;
  admissionDate: string;
}

interface StudentTableProps {
  students: APIStudent[];
  deletingId: string | null;
  onEdit: (student: APIStudent) => void;
  onDelete: (id: string) => void;
}

export default function StudentTable({ students, deletingId, onEdit, onDelete }: StudentTableProps) {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-white/80">
          <thead className="bg-white/5 border-b border-white/10 text-white/50 uppercase text-xs tracking-wider">
            <tr>
              <th className="px-6 py-4">Student Info</th>
              <th className="px-6 py-4">Class & Group</th>
              <th className="px-6 py-4">Institution</th>
              <th className="px-6 py-4">Guardian Details</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {students.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-white/40">
                  No matching student records found.
                </td>
              </tr>
            ) : (
              students.map((student) => (
                <tr key={student._id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white overflow-hidden border border-white/20 shrink-0">
                        {student.photo ? (
                          <img src={student.photo} alt={student.name} className="w-full h-full object-cover" />
                        ) : (
                          student.name.charAt(0)
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-white">{student.name}</div>
                        <div className="text-xs text-white/50 flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3 text-blue-400" /> {student.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-lg text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        Class {student.className}
                      </span>
                      <span className="text-xs text-white/50 uppercase">{student.group || 'GENERAL'}</span>
                    </div>
                    {student.batch && <div className="text-xs text-white/40 mt-1">Batch: {student.batch}</div>}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-white/90 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-white/40 shrink-0" />
                      <span className="truncate max-w-[200px]">{student.institution}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-white/90">{student.guradianName}</div>
                    <div className="text-xs text-white/50 flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3" /> {student.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(student)}
                        className="p-2 hover:bg-blue-500/20 rounded-lg text-white/50 hover:text-blue-400 transition-colors cursor-pointer"
                        title="Edit Student"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(student._id)}
                        disabled={deletingId === student._id}
                        className="p-2 hover:bg-rose-500/20 rounded-lg text-white/50 hover:text-rose-400 transition-colors cursor-pointer disabled:opacity-50"
                        title="Delete Student"
                      >
                        {deletingId === student._id ? (
                          <Loader2 className="w-4 h-4 animate-spin text-rose-400" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}