'use client';

import { useState, useMemo } from 'react';
import { 
  Search, 
  Award, 
  BookOpen, 
  Filter, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  UserCheck
} from 'lucide-react';

// ডামি রেজাল্ট ডাটা ইন্টারফেস
interface PublicResult {
  id: string;
  studentName: string;
  rollNo: string;
  className: string;
  batch: string;
  examTitle: string;
  subject: string;
  marks: number;
  totalMarks: number;
  percentage: number;
  grade: string;
  rank: number;
  publishedDate: string;
}

// নমুনা ডাটা (এপিআই থেকে লোড করার সুবিধার্থে তৈরি)
const MOCK_RESULTS: PublicResult[] = [
  {
    id: '1',
    studentName: 'Yamim',
    rollNo: '101',
    className: 'Class 9',
    batch: 'SSC-2026',
    examTitle: 'Weekly Tutorial-1',
    subject: 'Physics',
    marks: 45,
    totalMarks: 50,
    percentage: 90,
    grade: 'A+',
    rank: 1,
    publishedDate: '2026-08-28',
  },
  {
    id: '2',
    studentName: 'Nazrul Islam',
    rollNo: '102',
    className: 'Class 9',
    batch: 'SSC-2026',
    examTitle: 'Weekly Tutorial-1',
    subject: 'Physics',
    marks: 40,
    totalMarks: 50,
    percentage: 80,
    grade: 'A+',
    rank: 2,
    publishedDate: '2026-08-28',
  },
  {
    id: '3',
    studentName: 'Tanvir Hossain',
    rollNo: '103',
    className: 'Class 10',
    batch: 'SSC-2025',
    examTitle: 'Model Test - 02',
    subject: 'Chemistry',
    marks: 35,
    totalMarks: 50,
    percentage: 70,
    grade: 'A',
    rank: 5,
    publishedDate: '2026-08-25',
  },
  {
    id: '4',
    studentName: 'Sadia Sultana',
    rollNo: '104',
    className: 'Class 9',
    batch: 'SSC-2026',
    examTitle: 'Weekly Tutorial-1',
    subject: 'Physics',
    marks: 30,
    totalMarks: 50,
    percentage: 60,
    grade: 'A-',
    rank: 3,
    publishedDate: '2026-08-28',
  },
];

export default function PublicResultPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // ફિલ્ટર અને સર્ચ લોજિક
  const filteredResults = useMemo(() => {
    return MOCK_RESULTS.filter((item) => {
      const matchesSearch = 
        item.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.rollNo.includes(searchTerm) ||
        item.examTitle.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesClass = selectedClass === 'ALL' || item.className === selectedClass;

      return matchesSearch && matchesClass;
    });
  }, [searchTerm, selectedClass]);

  const totalPages = Math.ceil(filteredResults.length / itemsPerPage);
  const paginatedResults = filteredResults.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 p-4 md:p-8 space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-3 max-w-2xl mx-auto pt-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>লেন্স কোচিং সেন্টার • প্রকাশ্য ফলাফল</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          পরীক্ষার ফলাফল ও মেধা তালিকা
        </h1>
        <p className="text-sm text-slate-400">
          আপনার রোল নম্বর, শিক্ষার্থীর নাম অথবা পরীক্ষার নাম দিয়ে সহজেই ফলাফল খুঁজুন।
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="max-w-6xl mx-auto bg-[#121827] p-4 rounded-2xl border border-slate-800/80 shadow-xl flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="নাম, রোল অথবা পরীক্ষার নাম..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0F1422] text-sm text-slate-200 pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-emerald-500 transition placeholder:text-slate-500"
          />
        </div>

        {/* Filter Dropdown */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <div className="flex items-center gap-2 bg-[#0F1422] px-3 py-2 rounded-xl border border-slate-800 text-xs text-slate-400">
            <Filter className="w-3.5 h-3.5 text-emerald-400" />
            <span>শ্রেণি:</span>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-[#121827]">সকল শ্রেণি</option>
              <option value="Class 9" className="bg-[#121827]">Class 9</option>
              <option value="Class 10" className="bg-[#121827]">Class 10</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Table Section */}
      <div className="max-w-6xl mx-auto bg-[#121827] rounded-2xl border border-slate-800/80 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-[#0F1422] text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800/80">
              <tr>
                <th className="p-4 text-center">র‍্যাঙ্ক</th>
                <th className="p-4">শিক্ষার্থী ও রোল</th>
                <th className="p-4">শ্রেণি ও ব্যাচ</th>
                <th className="p-4">পরীক্ষা ও বিষয়</th>
                <th className="p-4 text-center">প্রাপ্ত নম্বর</th>
                <th className="p-4 text-center">শতকরা (%)</th>
                <th className="p-4 text-right">গ্রেড</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {paginatedResults.length > 0 ? (
                paginatedResults.map((result) => (
                  <tr key={result.id} className="hover:bg-slate-800/30 transition">
                    {/* Rank Badge */}
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-black ${
                        result.rank === 1 
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                          : result.rank === 2 
                          ? 'bg-slate-400/20 text-slate-200 border border-slate-400/30' 
                          : result.rank === 3 
                          ? 'bg-amber-700/20 text-amber-500 border border-amber-700/30' 
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        #{result.rank}
                      </span>
                    </td>

                    {/* Student Name & Roll */}
                    <td className="p-4">
                      <div className="font-semibold text-white">{result.studentName}</div>
                      <div className="text-xs text-slate-500">রোল: {result.rollNo}</div>
                    </td>

                    {/* Class & Batch */}
                    <td className="p-4">
                      <div className="text-slate-300 font-medium">{result.className}</div>
                      <div className="text-xs text-slate-500">{result.batch}</div>
                    </td>

                    {/* Exam Name & Subject */}
                    <td className="p-4">
                      <div className="text-white font-medium">{result.examTitle}</div>
                      <div className="text-xs text-slate-400">বিষয়: {result.subject}</div>
                    </td>

                    {/* Marks */}
                    <td className="p-4 text-center font-bold text-white">
                      {result.marks} <span className="text-xs font-normal text-slate-500">/ {result.totalMarks}</span>
                    </td>

                    {/* Percentage */}
                    <td className="p-4 text-center">
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                        {result.percentage}%
                      </span>
                    </td>

                    {/* Grade */}
                    <td className="p-4 text-right">
                      <span className={`text-xs font-bold px-3 py-1 rounded-md border ${
                        result.grade === 'F'
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      }`}>
                        {result.grade}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-500">
                    কোনো ফলাফল পাওয়া যায়নি
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="p-4 bg-[#0F1422] border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>পৃষ্ঠা {currentPage} / {totalPages}</span>
            <div className="flex gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="p-2 rounded-lg bg-[#121827] border border-slate-800 hover:bg-slate-800 disabled:opacity-50 transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="p-2 rounded-lg bg-[#121827] border border-slate-800 hover:bg-slate-800 disabled:opacity-50 transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}