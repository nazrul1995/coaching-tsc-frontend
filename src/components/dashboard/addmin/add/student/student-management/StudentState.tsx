'use client';

import React from 'react';
import { GraduationCap, CheckCircle2, BookOpen, UserPlus, Users } from 'lucide-react';

interface StudentStatsProps {
  stats: {
    total: number;
    scienceCount: number;
    commerceCount: number;
    humanitiesCount?: number;
  };
  onOpenModal: () => void;
}

export default function StudentStats({ stats, onOpenModal }: StudentStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* Total Enrolled */}
      <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-white/60">Total Enrolled</span>
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
            <GraduationCap className="w-5 h-5" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-white mt-2">{stats.total}</h3>
      </div>

      {/* Science Group */}
      <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-white/60">Science Group</span>
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-white mt-2">{stats.scienceCount}</h3>
      </div>

      {/* Commerce Group */}
      <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-white/60">Commerce Group</span>
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-white mt-2">{stats.commerceCount}</h3>
      </div>

      {/* Humanities Group */}
      <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-white/60">Humanities Group</span>
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
            <Users className="w-5 h-5" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-white mt-2">{stats.humanitiesCount ?? 0}</h3>
      </div>

      {/* Action Button */}
      <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl flex flex-col justify-between">
        <span className="text-sm font-medium text-white/60">Actions</span>
        <button
          onClick={onOpenModal}
          className="w-full mt-2 py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 text-sm cursor-pointer"
        >
          <UserPlus className="w-4 h-4" /> Add New Student
        </button>
      </div>
    </div>
  );
}