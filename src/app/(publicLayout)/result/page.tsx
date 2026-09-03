'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Trophy,
  Medal,
  Award,
  CalendarDays,
  BookOpen,
  Users,
  Loader2,
  Sparkles,
  ChevronDown,
  GraduationCap,
} from 'lucide-react';

import axiosSecure from '@/lib/axiosSecure';

interface Student {
  _id: string;
  name: string;
  photo?: string;
  className: string;
  batch?: string;
  group?: string;
}

interface Exam {
  _id: string;
  title: string;
  type: 'weekly' | 'model_test';
  subject: string;
  totalMarks: number;
  examDate: string;
  className: string;
  batch?: string;
  group?: string;
  status: 'draft' | 'published';
}

interface ExamResult {
  _id: string;
  student: Student;
  marks: number;
  totalMarks: number;
  percentage: number;
  grade: string;
  isAbsent: boolean;
  status: 'draft' | 'published';
  remarks?: string;
}

interface RankedResult extends ExamResult {
  rank: number | null;
}

export default function PublicResultPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [results, setResults] = useState<ExamResult[]>([]);

  const [selectedExam, setSelectedExam] = useState('');
  const [selectedClass, setSelectedClass] = useState('ALL');
  const [selectedBatch, setSelectedBatch] = useState('ALL');
  const [selectedType, setSelectedType] = useState('ALL');

  const [searchTerm, setSearchTerm] = useState('');

  const [loadingExams, setLoadingExams] = useState(true);
  const [loadingResults, setLoadingResults] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // FETCH PUBLISHED EXAMS
  useEffect(() => {
    const fetchExams = async () => {
      try {
        setLoadingExams(true);
        const res = await axiosSecure.get('/exams', {
          params: { status: 'published' },
        });

        const examData: Exam[] = res.data?.data || [];
        setExams(examData);

        if (examData.length > 0) {
          setSelectedExam(examData[0]._id);
        }
      } catch (error) {
        console.error('Failed to fetch exams:', error);
      } finally {
        setLoadingExams(false);
      }
    };

    fetchExams();
  }, []);

  // FILTER EXAMS
  const filteredExams = useMemo(() => {
    return exams.filter((exam) => {
      const matchesClass =
        selectedClass === 'ALL' || exam.className === selectedClass;
      const matchesBatch =
        selectedBatch === 'ALL' || exam.batch === selectedBatch;
      const matchesType =
        selectedType === 'ALL' || exam.type === selectedType;

      return matchesClass && matchesBatch && matchesType;
    });
  }, [exams, selectedClass, selectedBatch, selectedType]);

  useEffect(() => {
    if (filteredExams.length > 0) {
      const exists = filteredExams.some((exam) => exam._id === selectedExam);
      if (!exists) {
        setSelectedExam(filteredExams[0]._id);
      }
    } else {
      setSelectedExam('');
    }
  }, [filteredExams, selectedExam]);

  // FETCH RESULTS
  useEffect(() => {
    if (!selectedExam) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      try {
        setLoadingResults(true);
        const res = await axiosSecure.get(`/exams/${selectedExam}/results`, {
          params: { status: 'published' },
        });

        const resultData: ExamResult[] = res.data?.data || [];
        setResults(resultData);
        setCurrentPage(1);
      } catch (error) {
        console.error('Failed to fetch exam results:', error);
        setResults([]);
      } finally {
        setLoadingResults(false);
      }
    };

    fetchResults();
  }, [selectedExam]);

  const currentExam = useMemo(() => {
    return exams.find((exam) => exam._id === selectedExam);
  }, [exams, selectedExam]);

  const classes = useMemo(() => {
    return Array.from(
      new Set(exams.map((exam) => exam.className).filter(Boolean))
    );
  }, [exams]);

  const filteredResults = useMemo<RankedResult[]>(() => {
    const search = searchTerm.trim().toLowerCase();

    const filtered = results.filter((result) => {
      const student = result.student;
      if (!student) return false;

      return (
        !search ||
        student.name?.toLowerCase().includes(search) ||
        student._id?.toLowerCase().includes(search)
      );
    });

    return [...filtered]
      .sort((a, b) => {
        if (a.isAbsent && !b.isAbsent) return 1;
        if (!a.isAbsent && b.isAbsent) return -1;
        return b.percentage - a.percentage || b.marks - a.marks;
      })
      .map((result, index) => ({
        ...result,
        rank: result.isAbsent ? null : index + 1,
      }));
  }, [results, searchTerm]);

  const totalPages = Math.ceil(filteredResults.length / itemsPerPage);

  const paginatedResults = useMemo(() => {
    return filteredResults.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredResults, currentPage]);

  const top3Results = useMemo(() => {
    return filteredResults.filter((r) => r.rank && r.rank <= 3);
  }, [filteredResults]);

  if (loadingExams) {
    return (
      <div className="min-h-screen bg-[#07090E] text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-full border-2 border-emerald-500/20 border-t-emerald-400 animate-spin" />
            <Sparkles className="w-5 h-5 text-emerald-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <p className="text-sm font-medium text-slate-400 animate-pulse">
            পরীক্ষার তালিকা লোড হচ্ছে...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 pb-16 selection:bg-emerald-500 selection:text-black">
      {/* BACKGROUND DECORATION */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-8 md:pt-12">
        {/* HEADER */}
        <div className="text-center max-w-2xl mx-auto mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold backdrop-blur-md mb-4 shadow-sm">
            <GraduationCap className="w-4 h-4" />
            <span>LENS COACHING CENTER</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white">
            পরীক্ষার ফলাফল
          </h1>

          <p className="mt-2 text-xs md:text-sm text-slate-400">
            প্রকাশিত পরীক্ষার ফলাফল, মেধা তালিকা এবং শিক্ষার্থীদের পারফরম্যান্স
            দেখুন।
          </p>
        </div>

        {/* CONTROLS & FILTERS */}
        <div className="bg-[#0E131F]/80 backdrop-blur-xl border border-white/[0.08] rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-2xl mb-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4">
            {/* Exam Select Dropdown */}
            <div className="md:col-span-6 relative">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">
                পরীক্ষা নির্বাচন করুন
              </label>
              <div className="relative">
                <select
                  value={selectedExam}
                  onChange={(e) => {
                    setSelectedExam(e.target.value);
                    setCurrentPage(1);
                  }}
                  disabled={filteredExams.length === 0}
                  className="w-full bg-[#141A29] border border-white/10 rounded-xl px-4 py-3 text-xs md:text-sm text-white appearance-none focus:outline-none focus:border-emerald-500 transition pr-10 cursor-pointer disabled:opacity-50"
                >
                  {filteredExams.length > 0 ? (
                    filteredExams.map((exam) => (
                      <option key={exam._id} value={exam._id}>
                        {exam.title} ({exam.subject} - Class {exam.className})
                      </option>
                    ))
                  ) : (
                    <option value="">কোনো পরীক্ষা পাওয়া যায়নি</option>
                  )}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Class Filter */}
            <div className="md:col-span-3 relative">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">
                শ্রেণি
              </label>
              <div className="relative">
                <select
                  value={selectedClass}
                  onChange={(e) => {
                    setSelectedClass(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-[#141A29] border border-white/10 rounded-xl px-4 py-3 text-xs md:text-sm text-white appearance-none focus:outline-none focus:border-emerald-500 transition pr-10 cursor-pointer"
                >
                  <option value="ALL">সকল শ্রেণি</option>
                  {classes.map((c) => (
                    <option key={c} value={c}>
                      Class {c}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Type Filter */}
            <div className="md:col-span-3 relative">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">
                পরীক্ষার ধরন
              </label>
              <div className="relative">
                <select
                  value={selectedType}
                  onChange={(e) => {
                    setSelectedType(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-[#141A29] border border-white/10 rounded-xl px-4 py-3 text-xs md:text-sm text-white appearance-none focus:outline-none focus:border-emerald-500 transition pr-10 cursor-pointer"
                >
                  <option value="ALL">সকল ধরন</option>
                  <option value="weekly">Weekly Tutorial</option>
                  <option value="model_test">Model Test</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Search Box */}
          <div className="mt-4 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="শিক্ষার্থীর নাম দিয়ে মেধা তালিকায় খুঁজুন..."
              className="w-full bg-[#141A29] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-xs md:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition"
            />
          </div>
        </div>

        {/* SELECTED EXAM CARD */}
        {currentExam && (
          <div className="relative overflow-hidden rounded-2xl md:rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-950/30 via-[#0E131F] to-[#0E131F] p-5 md:p-6 mb-8 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/10 text-emerald-400 text-[10px] font-bold tracking-wider uppercase border border-emerald-400/20">
                    {currentExam.type === 'weekly'
                      ? 'Weekly Exam'
                      : 'Model Test'}
                  </span>
                  <span className="text-slate-500 text-xs">•</span>
                  <span className="text-xs text-slate-400">
                    Class {currentExam.className}
                  </span>
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white">
                  {currentExam.title}
                </h2>
                <p className="text-xs md:text-sm text-slate-400 mt-1">
                  বিষয়: <span className="text-slate-200">{currentExam.subject}</span>
                  {currentExam.batch && ` • ব্যাচ: ${currentExam.batch}`}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 md:gap-3 bg-black/20 p-2 rounded-xl border border-white/5">
                <div className="text-center px-2 py-1.5">
                  <p className="text-[10px] text-slate-400 uppercase font-medium">মোট পরীক্ষার্থী</p>
                  <p className="text-base md:text-lg font-black text-emerald-400">{results.length}</p>
                </div>
                <div className="text-center px-2 py-1.5 border-x border-white/5">
                  <p className="text-[10px] text-slate-400 uppercase font-medium">পূর্ণমান</p>
                  <p className="text-base md:text-lg font-black text-white">{currentExam.totalMarks}</p>
                </div>
                <div className="text-center px-2 py-1.5">
                  <p className="text-[10px] text-slate-400 uppercase font-medium">তারিখ</p>
                  <p className="text-xs md:text-sm font-bold text-slate-200 mt-1">
                    {new Date(currentExam.examDate).toLocaleDateString('en-GB')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TOP 3 HIGHLIGHTS (MOB & DESK) */}
        {!searchTerm && top3Results.length > 0 && !loadingResults && (
          <div className="mb-8">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-yellow-400" /> শীর্ষ অর্জনকারীগণ
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {top3Results.map((res) => (
                <div
                  key={res._id}
                  className={`relative overflow-hidden rounded-2xl p-4 border backdrop-blur-lg flex items-center gap-4 ${
                    res.rank === 1
                      ? 'bg-gradient-to-r from-yellow-500/10 to-transparent border-yellow-500/30'
                      : res.rank === 2
                      ? 'bg-gradient-to-r from-slate-300/10 to-transparent border-slate-300/30'
                      : 'bg-gradient-to-r from-amber-600/10 to-transparent border-amber-600/30'
                  }`}
                >
                  <div className="relative">
                    {res.student?.photo ? (
                      <img
                        src={res.student.photo}
                        alt={res.student.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-white/20"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-bold text-lg text-emerald-400">
                        {res.student?.name?.charAt(0)}
                      </div>
                    )}
                    <span className="absolute -bottom-1 -right-1">
                      {res.rank === 1 && <Trophy className="w-5 h-5 text-yellow-400 drop-shadow" />}
                      {res.rank === 2 && <Medal className="w-5 h-5 text-slate-300 drop-shadow" />}
                      {res.rank === 3 && <Award className="w-5 h-5 text-amber-500 drop-shadow" />}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-400 font-medium">র‍্যাংক #{res.rank}</p>
                    <h4 className="text-sm font-bold text-white truncate">
                      {res.student?.name}
                    </h4>
                    <p className="text-xs text-emerald-400 font-semibold mt-0.5">
                      প্রাপ্ত নম্বর: {res.marks}/{res.totalMarks} ({res.percentage}%)
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RESULTS SECTION */}
        <div className="bg-[#0E131F]/80 backdrop-blur-xl border border-white/[0.08] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl">
          {loadingResults ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
              <p className="text-xs text-slate-400">ফলাফল তৈরি হচ্ছে...</p>
            </div>
          ) : paginatedResults.length > 0 ? (
            <>
              {/* DESKTOP TABLE */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-black/40 text-slate-400 text-[11px] font-semibold uppercase tracking-wider border-b border-white/5">
                    <tr>
                      <th className="px-6 py-4 text-center">মেধা স্থান</th>
                      <th className="px-6 py-4">শিক্ষার্থী</th>
                      <th className="px-6 py-4">শ্রেণি ও ব্যাচ</th>
                      <th className="px-6 py-4 text-center">প্রাপ্ত নম্বর</th>
                      <th className="px-6 py-4 text-center">শতকরা (%)</th>
                      <th className="px-6 py-4 text-center">গ্রেড</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {paginatedResults.map((result) => (
                      <tr
                        key={result._id}
                        className="hover:bg-white/[0.02] transition"
                      >
                        <td className="px-6 py-4 text-center">
                          {result.rank ? (
                            <span
                              className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-black ${
                                result.rank === 1
                                  ? 'bg-yellow-400/20 text-yellow-300 border border-yellow-400/30'
                                  : result.rank === 2
                                  ? 'bg-slate-300/20 text-slate-200 border border-slate-300/30'
                                  : result.rank === 3
                                  ? 'bg-amber-600/20 text-amber-400 border border-amber-600/30'
                                  : 'bg-white/5 text-slate-300'
                              }`}
                            >
                              {result.rank}
                            </span>
                          ) : (
                            <span className="text-xs font-semibold text-rose-400 bg-rose-500/10 px-2 py-1 rounded">
                              অনুপস্থিত
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {result.student?.photo ? (
                              <img
                                src={result.student.photo}
                                alt={result.student.name}
                                className="w-9 h-9 rounded-full object-cover border border-white/10"
                              />
                            ) : (
                              <div className="w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-xs">
                                {result.student?.name?.charAt(0)}
                              </div>
                            )}
                            <div>
                              <p className="font-bold text-white text-sm">
                                {result.student?.name}
                              </p>
                              <p className="text-[10px] text-slate-500">
                                ID: {result.student?._id}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <p className="text-xs font-medium text-slate-300">
                            Class {result.student?.className}
                          </p>
                          <p className="text-[10px] text-slate-500">
                            {result.student?.batch || '—'}
                          </p>
                        </td>

                        <td className="px-6 py-4 text-center">
                          {result.isAbsent ? (
                            <span className="text-slate-500">—</span>
                          ) : (
                            <span className="font-extrabold text-white">
                              {result.marks}{' '}
                              <span className="text-slate-500 text-xs font-normal">
                                / {result.totalMarks}
                              </span>
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-4 text-center">
                          {result.isAbsent ? (
                            <span className="text-slate-500">—</span>
                          ) : (
                            <span className="text-emerald-400 font-bold text-xs bg-emerald-400/10 border border-emerald-400/20 px-2.5 py-1 rounded-full">
                              {result.percentage}%
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-4 text-center">
                          <span
                            className={`text-xs font-black px-2.5 py-1 rounded-md border ${
                              result.grade === 'F'
                                ? 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                                : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                            }`}
                          >
                            {result.grade}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* MOBILE CARDS (MODERN APP-LIKE LOOK) */}
              <div className="md:hidden divide-y divide-white/5">
                {paginatedResults.map((result) => (
                  <div key={result._id} className="p-4 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          {result.student?.photo ? (
                            <img
                              src={result.student.photo}
                              alt={result.student.name}
                              className="w-10 h-10 rounded-full object-cover border border-white/10"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-sm">
                              {result.student?.name?.charAt(0)}
                            </div>
                          )}
                        </div>

                        <div>
                          <h4 className="text-sm font-bold text-white">
                            {result.student?.name}
                          </h4>
                          <p className="text-[11px] text-slate-400">
                            Class {result.student?.className} •{' '}
                            {result.student?.batch || 'No Batch'}
                          </p>
                        </div>
                      </div>

                      {/* Rank Badge Mobile */}
                      <div>
                        {result.rank ? (
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-black flex items-center gap-1 border ${
                              result.rank === 1
                                ? 'bg-yellow-400/10 border-yellow-400/30 text-yellow-300'
                                : result.rank === 2
                                ? 'bg-slate-300/10 border-slate-300/30 text-slate-200'
                                : result.rank === 3
                                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                                : 'bg-white/5 border-white/10 text-slate-300'
                            }`}
                          >
                            #{result.rank}
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded">
                            অনুপস্থিত
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Stats Box Mobile */}
                    <div className="grid grid-cols-3 gap-2 bg-[#141A29] p-2.5 rounded-xl border border-white/5 text-center">
                      <div>
                        <p className="text-[9px] text-slate-500 font-medium uppercase">
                          প্রাপ্ত নম্বর
                        </p>
                        <p className="text-xs font-black text-white mt-0.5">
                          {result.isAbsent
                            ? '—'
                            : `${result.marks}/${result.totalMarks}`}
                        </p>
                      </div>
                      <div className="border-x border-white/5">
                        <p className="text-[9px] text-slate-500 font-medium uppercase">
                          শতকরা
                        </p>
                        <p className="text-xs font-black text-emerald-400 mt-0.5">
                          {result.isAbsent ? '—' : `${result.percentage}%`}
                        </p>
                      </div>
                      <div>
                        <p className="text-[9px] text-slate-500 font-medium uppercase">
                          গ্রেড
                        </p>
                        <p
                          className={`text-xs font-black mt-0.5 ${
                            result.grade === 'F'
                              ? 'text-rose-400'
                              : 'text-blue-400'
                          }`}
                        >
                          {result.grade}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* PAGINATION */}
              {totalPages > 1 && (
                <div className="p-4 bg-black/40 border-t border-white/5 flex items-center justify-between">
                  <p className="text-xs text-slate-400">
                    পৃষ্ঠা <span className="text-white font-bold">{currentPage}</span> / {totalPages}
                  </p>

                  <div className="flex gap-2">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((prev) => prev - 1)}
                      className="p-2 rounded-xl bg-[#141A29] border border-white/10 text-white hover:bg-white/5 disabled:opacity-30 disabled:pointer-events-none transition"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((prev) => prev + 1)}
                      className="p-2 rounded-xl bg-[#141A29] border border-white/10 text-white hover:bg-white/5 disabled:opacity-30 disabled:pointer-events-none transition"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="py-16 text-center px-4">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-3">
                <BookOpen className="w-6 h-6 text-slate-500" />
              </div>
              <h3 className="text-sm font-bold text-white">কোনো ফলাফল পাওয়া যায়নি</h3>
              <p className="text-xs text-slate-500 mt-1">
                এই পরীক্ষার জন্য কোনো প্রকাশিত ফলাফল নেই অথবা ফিল্টারের সাথে মিলছে না।
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}