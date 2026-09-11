'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Award,
  BookOpen,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Loader2,
  Medal,
  Search,
  Sparkles,
  Trophy,
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

interface ExamInfo {
  _id: string;
  title: string;
  type: 'weekly' | 'model_test';
  subject: string;
  className: string;
  totalMarks: number;
  examDate: string;
  status: 'draft' | 'published';
}

interface ExamResult {
  _id: string;
  exam: ExamInfo;
  student: Student;
  subjectResults: unknown[];
  marks: number;
  totalMarks: number;
  percentage: number;
  grade: string;
  isAbsent: boolean;
  status: 'draft' | 'published';
  remarks?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ExamOption {
  _id: string;
  title: string;
  type: 'weekly' | 'model_test';
  subject: string;
  totalMarks: number;
  examDate: string;
  className: string;
}

interface SingleExamLeaderboardItem {
  mode: 'single';
  key: string;
  rank: number;
  student: Student;
  exam: ExamInfo;
  marks: number;
  totalMarks: number;
  percentage: number;
  grade: string;
  isAbsent: boolean;
}

interface OverallLeaderboardItem {
  mode: 'overall';
  key: string;
  rank: number;
  student: Student;
  totalObtainedMarks: number;
  totalPossibleMarks: number;
  overallPercentage: number;
  totalExams: number;
  participatedExams: number;
  absentExams: number;
}

type LeaderboardItem =
  | SingleExamLeaderboardItem
  | OverallLeaderboardItem;

const ITEMS_PER_PAGE = 10;

const getStudentInitial = (name?: string) =>
  name?.trim()?.charAt(0)?.toUpperCase() || '?';

const getRankClassName = (rank: number) => {
  if (rank === 1) {
    return 'bg-yellow-400/20 text-yellow-300 border border-yellow-400/30';
  }

  if (rank === 2) {
    return 'bg-slate-300/20 text-slate-200 border border-slate-300/30';
  }

  if (rank === 3) {
    return 'bg-amber-600/20 text-amber-400 border border-amber-600/30';
  }

  return 'bg-white/5 text-slate-300 border border-white/5';
};

export default function PublicResultPage() {
  const [results, setResults] = useState<ExamResult[]>([]);

  const [selectedExam, setSelectedExam] = useState('ALL');
  const [selectedClass, setSelectedClass] = useState('ALL');
  const [selectedBatch, setSelectedBatch] = useState('ALL');
  const [selectedType, setSelectedType] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // ==========================================
  // FETCH ALL PUBLISHED EXAM RESULTS
  // ==========================================

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);

        const res = await axiosSecure.get('/exam-results', {
          params: {
            status: 'published',
            page: 1,
            limit: 1000,
          },
        });

        const resultData: ExamResult[] = Array.isArray(res.data?.data)
          ? res.data.data
          : [];

        setResults(resultData);
      } catch (error) {
        console.error('Failed to fetch exam results:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    void fetchResults();
  }, []);

  // ==========================================
  // UNIQUE EXAMS
  // ==========================================

  const exams = useMemo<ExamOption[]>(() => {
    const map = new Map<string, ExamOption>();

    results.forEach((result) => {
      if (!result.exam?._id) return;

      if (!map.has(result.exam._id)) {
        map.set(result.exam._id, {
          _id: result.exam._id,
          title: result.exam.title,
          type: result.exam.type,
          subject: result.exam.subject,
          totalMarks: result.exam.totalMarks,
          examDate: result.exam.examDate,
          className: result.exam.className,
        });
      }
    });

    return Array.from(map.values()).sort(
      (a, b) =>
        new Date(b.examDate).getTime() - new Date(a.examDate).getTime()
    );
  }, [results]);

  // ==========================================
  // UNIQUE CLASSES
  // ==========================================

  const classes = useMemo(() => {
    return Array.from(
      new Set(
        results
          .map((result) => result.student?.className)
          .filter((value): value is string => Boolean(value))
      )
    ).sort((a, b) => Number(a) - Number(b));
  }, [results]);

  // ==========================================
  // UNIQUE BATCHES
  // ==========================================

  const batches = useMemo(() => {
    return Array.from(
      new Set(
        results
          .map((result) => result.student?.batch)
          .filter((value): value is string => Boolean(value))
      )
    ).sort();
  }, [results]);

  // ==========================================
  // FILTER RAW RESULT ROWS
  // ==========================================

  const filteredResults = useMemo<ExamResult[]>(() => {
    const search = searchTerm.trim().toLowerCase();

    return results.filter((result) => {
      const student = result.student;
      const exam = result.exam;

      if (!student || !exam) return false;

      const matchesExam =
        selectedExam === 'ALL' || exam._id === selectedExam;

      const matchesClass =
        selectedClass === 'ALL' || student.className === selectedClass;

      const matchesBatch =
        selectedBatch === 'ALL' || student.batch === selectedBatch;

      const matchesType =
        selectedType === 'ALL' || exam.type === selectedType;

      const matchesSearch =
        !search ||
        student.name?.toLowerCase().includes(search) ||
        student._id?.toLowerCase().includes(search);

      return (
        matchesExam &&
        matchesClass &&
        matchesBatch &&
        matchesType &&
        matchesSearch
      );
    });
  }, [
    results,
    selectedExam,
    selectedClass,
    selectedBatch,
    selectedType,
    searchTerm,
  ]);

  // ==========================================
  // SINGLE EXAM RANKING
  // Ranking: obtained marks DESC
  // Absent student = 0 marks
  // Same marks = same competition rank
  // ==========================================

  const singleExamLeaderboard = useMemo<SingleExamLeaderboardItem[]>(() => {
    if (selectedExam === 'ALL') return [];

    const sorted = [...filteredResults].sort((a, b) => {
      const marksA = a.isAbsent ? 0 : Number(a.marks || 0);
      const marksB = b.isAbsent ? 0 : Number(b.marks || 0);

      if (marksB !== marksA) {
        return marksB - marksA;
      }

      // Only used to keep tied rows in a stable/useful order.
      if (b.percentage !== a.percentage) {
        return b.percentage - a.percentage;
      }

      return a.student.name.localeCompare(b.student.name);
    });

    let previousMarks: number | null = null;
    let currentRank = 0;

    return sorted.map((result, index) => {
      const effectiveMarks = result.isAbsent
        ? 0
        : Number(result.marks || 0);

      if (previousMarks !== effectiveMarks) {
        currentRank = index + 1;
      }

      previousMarks = effectiveMarks;

      return {
        mode: 'single',
        key: result._id,
        rank: currentRank,
        student: result.student,
        exam: result.exam,
        marks: effectiveMarks,
        totalMarks: Number(result.totalMarks || result.exam.totalMarks || 0),
        percentage: result.isAbsent ? 0 : Number(result.percentage || 0),
        grade: result.isAbsent ? 'F' : result.grade,
        isAbsent: result.isAbsent,
      };
    });
  }, [filteredResults, selectedExam]);

  // ==========================================
  // OVERALL / ALL EXAMS RANKING
  // Student-wise grouping
  // totalObtainedMarks = SUM(isAbsent ? 0 : marks)
  // Rank is based primarily and ONLY on total marks.
  // Same total marks = same competition rank.
  // ==========================================

  const overallLeaderboard = useMemo<OverallLeaderboardItem[]>(() => {
    if (selectedExam !== 'ALL') return [];

    const studentMap = new Map<
      string,
      Omit<OverallLeaderboardItem, 'rank' | 'mode' | 'key'>
    >();

    filteredResults.forEach((result) => {
      const student = result.student;

      if (!student?._id) return;

      const obtainedMarks = result.isAbsent
        ? 0
        : Number(result.marks || 0);

      const possibleMarks = Number(
        result.totalMarks || result.exam?.totalMarks || 0
      );

      const existing = studentMap.get(student._id);

      if (existing) {
        existing.totalObtainedMarks += obtainedMarks;
        existing.totalPossibleMarks += possibleMarks;
        existing.totalExams += 1;

        if (result.isAbsent) {
          existing.absentExams += 1;
        } else {
          existing.participatedExams += 1;
        }

        existing.overallPercentage =
          existing.totalPossibleMarks > 0
            ? Number(
                (
                  (existing.totalObtainedMarks /
                    existing.totalPossibleMarks) *
                  100
                ).toFixed(2)
              )
            : 0;

        return;
      }

      studentMap.set(student._id, {
        student,
        totalObtainedMarks: obtainedMarks,
        totalPossibleMarks: possibleMarks,
        overallPercentage:
          possibleMarks > 0
            ? Number(((obtainedMarks / possibleMarks) * 100).toFixed(2))
            : 0,
        totalExams: 1,
        participatedExams: result.isAbsent ? 0 : 1,
        absentExams: result.isAbsent ? 1 : 0,
      });
    });

    const sorted = Array.from(studentMap.values()).sort((a, b) => {
      // Main ranking rule: TOTAL OBTAINED MARKS
      if (b.totalObtainedMarks !== a.totalObtainedMarks) {
        return b.totalObtainedMarks - a.totalObtainedMarks;
      }

      // These only control display order when total marks are tied.
      if (b.overallPercentage !== a.overallPercentage) {
        return b.overallPercentage - a.overallPercentage;
      }

      if (a.absentExams !== b.absentExams) {
        return a.absentExams - b.absentExams;
      }

      return a.student.name.localeCompare(b.student.name);
    });

    let previousTotalMarks: number | null = null;
    let currentRank = 0;

    return sorted.map((item, index) => {
      if (previousTotalMarks !== item.totalObtainedMarks) {
        currentRank = index + 1;
      }

      previousTotalMarks = item.totalObtainedMarks;

      return {
        ...item,
        mode: 'overall',
        key: item.student._id,
        rank: currentRank,
      };
    });
  }, [filteredResults, selectedExam]);

  // ==========================================
  // ACTIVE LEADERBOARD
  // ==========================================

  const leaderboard = useMemo<LeaderboardItem[]>(() => {
    return selectedExam === 'ALL'
      ? overallLeaderboard
      : singleExamLeaderboard;
  }, [selectedExam, overallLeaderboard, singleExamLeaderboard]);

  // ==========================================
  // PAGINATION
  // ==========================================

  const totalPages = Math.ceil(leaderboard.length / ITEMS_PER_PAGE);

  const paginatedResults = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;

    return leaderboard.slice(start, start + ITEMS_PER_PAGE);
  }, [leaderboard, currentPage]);

  // ==========================================
  // TOP 3
  // Competition ranking can return more than 3
  // students when there are ties.
  // ==========================================

  const top3Results = useMemo(() => {
    return leaderboard.filter((item) => item.rank <= 3);
  }, [leaderboard]);

  // ==========================================
  // SELECTED EXAM
  // ==========================================

  const currentExam = useMemo(() => {
    if (selectedExam === 'ALL') return null;

    return exams.find((exam) => exam._id === selectedExam) ?? null;
  }, [exams, selectedExam]);

  // ==========================================
  // RESET PAGE WHEN FILTER CHANGES
  // ==========================================

  useEffect(() => {
    setCurrentPage(1);
  }, [
    selectedExam,
    selectedClass,
    selectedBatch,
    selectedType,
    searchTerm,
  ]);

  // ==========================================
  // KEEP PAGE VALID
  // ==========================================

  useEffect(() => {
    if (totalPages === 0 && currentPage !== 1) {
      setCurrentPage(1);
      return;
    }

    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date: string) => {
    if (!date) return '—';

    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getMarksText = (item: LeaderboardItem) => {
    if (item.mode === 'single') {
      return `${item.marks}/${item.totalMarks}`;
    }

    return `${item.totalObtainedMarks}/${item.totalPossibleMarks}`;
  };

  const getPercentage = (item: LeaderboardItem) => {
    if (item.mode === 'single') {
      return item.percentage;
    }

    return item.overallPercentage;
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07090E] text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-full border-2 border-emerald-500/20 border-t-emerald-400 animate-spin" />

            <Sparkles className="w-5 h-5 text-emerald-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>

          <p className="text-sm font-medium text-slate-400 animate-pulse">
            ফলাফল লোড হচ্ছে...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 pb-16 selection:bg-emerald-500 selection:text-black">
      {/* BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-8 md:pt-12">
        {/* HEADER */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-400 mb-4">
            <GraduationCap className="w-3.5 h-3.5" />
            Result Leaderboard
          </div>

          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white">
            পরীক্ষার ফলাফল
          </h1>

          <p className="mt-3 text-sm md:text-base text-slate-500 max-w-2xl mx-auto">
            {selectedExam === 'ALL'
              ? 'সকল নির্বাচিত পরীক্ষার প্রাপ্ত নম্বর যোগ করে শিক্ষার্থীভিত্তিক মেধাক্রম দেখানো হচ্ছে। অনুপস্থিত পরীক্ষায় ০ নম্বর গণনা হবে।'
              : 'নির্বাচিত পরীক্ষায় প্রাপ্ত নম্বরের ভিত্তিতে মেধাক্রম দেখানো হচ্ছে। অনুপস্থিত হলে ০ নম্বর গণনা হবে।'}
          </p>
        </div>

        {/* FILTERS */}
        <div className="mb-6 rounded-2xl border border-white/[0.08] bg-[#0E131F]/80 p-4 md:p-5 backdrop-blur-xl">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-5">
            {/* SEARCH */}
            <div className="relative lg:col-span-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="শিক্ষার্থী খুঁজুন..."
                className="h-11 w-full rounded-xl border border-white/10 bg-black/20 pl-10 pr-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-500/40"
              />
            </div>

            {/* EXAM */}
            <div className="relative">
              <select
                value={selectedExam}
                onChange={(e) => setSelectedExam(e.target.value)}
                className="h-11 w-full appearance-none rounded-xl border border-white/10 bg-black/20 px-3 pr-9 text-sm text-slate-200 outline-none transition focus:border-emerald-500/40"
              >
                <option value="ALL">সব পরীক্ষা</option>
                {exams.map((exam) => (
                  <option key={exam._id} value={exam._id}>
                    {exam.title}
                  </option>
                ))}
              </select>

              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            </div>

            {/* CLASS */}
            <div className="relative">
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="h-11 w-full appearance-none rounded-xl border border-white/10 bg-black/20 px-3 pr-9 text-sm text-slate-200 outline-none transition focus:border-emerald-500/40"
              >
                <option value="ALL">সব শ্রেণি</option>
                {classes.map((className) => (
                  <option key={className} value={className}>
                    Class {className}
                  </option>
                ))}
              </select>

              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            </div>

            {/* BATCH */}
            <div className="relative">
              <select
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                className="h-11 w-full appearance-none rounded-xl border border-white/10 bg-black/20 px-3 pr-9 text-sm text-slate-200 outline-none transition focus:border-emerald-500/40"
              >
                <option value="ALL">সব ব্যাচ</option>
                {batches.map((batch) => (
                  <option key={batch} value={batch}>
                    Batch {batch}
                  </option>
                ))}
              </select>

              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            </div>

            {/* TYPE */}
            <div className="relative">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="h-11 w-full appearance-none rounded-xl border border-white/10 bg-black/20 px-3 pr-9 text-sm text-slate-200 outline-none transition focus:border-emerald-500/40"
              >
                <option value="ALL">সব ধরন</option>
                <option value="weekly">Weekly</option>
                <option value="model_test">Model Test</option>
              </select>

              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            </div>
          </div>
        </div>

        {/* SELECTED EXAM INFO */}
        {currentExam && (
          <div className="mb-8 overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 via-[#0E131F]/90 to-cyan-500/5 p-5">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                    {currentExam.type === 'weekly'
                      ? 'Weekly Exam'
                      : 'Model Test'}
                  </span>

                  <span className="text-xs text-slate-500">
                    {formatDate(currentExam.examDate)}
                  </span>
                </div>

                <h2 className="text-xl font-bold text-white md:text-2xl">
                  {currentExam.title}
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  {currentExam.subject} · Class {currentExam.className}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 rounded-xl border border-white/5 bg-black/20 p-2 md:gap-3">
                <div className="px-2 py-1.5 text-center">
                  <p className="text-[10px] font-medium uppercase text-slate-400">
                    মোট পরীক্ষার্থী
                  </p>
                  <p className="text-base font-black text-emerald-400 md:text-lg">
                    {leaderboard.length}
                  </p>
                </div>

                <div className="border-x border-white/5 px-2 py-1.5 text-center">
                  <p className="text-[10px] font-medium uppercase text-slate-400">
                    পূর্ণমান
                  </p>
                  <p className="text-base font-black text-white md:text-lg">
                    {currentExam.totalMarks}
                  </p>
                </div>

                <div className="px-2 py-1.5 text-center">
                  <p className="text-[10px] font-medium uppercase text-slate-400">
                    তারিখ
                  </p>
                  <p className="mt-1 text-xs font-bold text-slate-200 md:text-sm">
                    {formatDate(currentExam.examDate)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ALL EXAMS INFO */}
        {!currentExam && results.length > 0 && (
          <div className="mb-8 rounded-2xl border border-white/10 bg-[#0E131F]/80 px-5 py-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-bold text-white">
                  Overall Marks Leaderboard
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {leaderboard.length} জন শিক্ষার্থী · {filteredResults.length}{' '}
                  টি result row
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-xl border border-emerald-500/15 bg-emerald-500/5 px-3 py-2 text-right">
                  <p className="text-[10px] uppercase tracking-wider text-slate-500">
                    Ranking Rule
                  </p>
                  <p className="text-xs font-bold text-emerald-400">
                    Total Marks · Absent = 0
                  </p>
                </div>

                <BookOpen className="h-5 w-5 text-emerald-400" />
              </div>
            </div>
          </div>
        )}

        {/* TOP 3 */}
        {!searchTerm && top3Results.length > 0 && (
          <div className="mb-8">
            <h3 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400">
              <Trophy className="h-4 w-4 text-yellow-400" />
              শীর্ষ অর্জনকারীগণ
            </h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {top3Results.map((item) => (
                <div
                  key={`top-${item.key}`}
                  className={`relative flex items-center gap-4 overflow-hidden rounded-2xl border p-4 backdrop-blur-lg ${
                    item.rank === 1
                      ? 'border-yellow-500/30 bg-gradient-to-r from-yellow-500/10 to-transparent'
                      : item.rank === 2
                        ? 'border-slate-300/30 bg-gradient-to-r from-slate-300/10 to-transparent'
                        : 'border-amber-600/30 bg-gradient-to-r from-amber-600/10 to-transparent'
                  }`}
                >
                  <div className="relative">
                    {item.student?.photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.student.photo}
                        alt={item.student.name}
                        className="h-12 w-12 rounded-full border-2 border-white/20 object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-lg font-bold text-emerald-400">
                        {getStudentInitial(item.student?.name)}
                      </div>
                    )}

                    <span className="absolute -bottom-1 -right-1">
                      {item.rank === 1 && (
                        <Trophy className="h-5 w-5 text-yellow-400 drop-shadow" />
                      )}

                      {item.rank === 2 && (
                        <Medal className="h-5 w-5 text-slate-300 drop-shadow" />
                      )}

                      {item.rank === 3 && (
                        <Award className="h-5 w-5 text-amber-500 drop-shadow" />
                      )}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-slate-400">
                      র‍্যাংক #{item.rank}
                    </p>

                    <h4 className="truncate text-sm font-bold text-white">
                      {item.student?.name}
                    </h4>

                    <p className="mt-0.5 text-xs font-semibold text-emerald-400">
                      {getMarksText(item)} ({getPercentage(item).toFixed(2)}%)
                    </p>

                    {item.mode === 'overall' && (
                      <p className="mt-1 text-[10px] text-slate-500">
                        Exams {item.totalExams} · Absent {item.absentExams}
                      </p>
                    )}

                    {item.mode === 'single' && item.isAbsent && (
                      <p className="mt-1 text-[10px] font-semibold text-rose-400">
                        অনুপস্থিত · ০ নম্বর গণনা হয়েছে
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RESULTS */}
        <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0E131F]/80 shadow-2xl backdrop-blur-xl md:rounded-3xl">
          {paginatedResults.length > 0 ? (
            <>
              {/* DESKTOP */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-white/5 bg-black/40 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    <tr>
                      <th className="px-6 py-4 text-center">মেধা স্থান</th>
                      <th className="px-6 py-4">শিক্ষার্থী</th>

                      {selectedExam === 'ALL' ? (
                        <>
                          <th className="px-6 py-4 text-center">পরীক্ষা</th>
                          <th className="px-6 py-4 text-center">উপস্থিত</th>
                          <th className="px-6 py-4 text-center">অনুপস্থিত</th>
                        </>
                      ) : (
                        <th className="px-6 py-4">পরীক্ষা</th>
                      )}

                      <th className="px-6 py-4">শ্রেণি ও ব্যাচ</th>
                      <th className="px-6 py-4 text-center">প্রাপ্ত নম্বর</th>
                      <th className="px-6 py-4 text-center">শতকরা (%)</th>

                      {selectedExam !== 'ALL' && (
                        <th className="px-6 py-4 text-center">গ্রেড</th>
                      )}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-white/5">
                    {paginatedResults.map((item) => (
                      <tr
                        key={item.key}
                        className="transition hover:bg-white/[0.02]"
                      >
                        {/* RANK */}
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-black ${getRankClassName(
                              item.rank
                            )}`}
                          >
                            {item.rank}
                          </span>
                        </td>

                        {/* STUDENT */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {item.student?.photo ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={item.student.photo}
                                alt={item.student.name}
                                className="h-9 w-9 rounded-full border border-white/10 object-cover"
                              />
                            ) : (
                              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10 text-xs font-bold text-emerald-400">
                                {getStudentInitial(item.student?.name)}
                              </div>
                            )}

                            <div className="min-w-0">
                              <p className="truncate text-sm font-bold text-white">
                                {item.student?.name}
                              </p>

                              <p className="max-w-[180px] truncate text-[10px] text-slate-500">
                                ID: {item.student?._id}
                              </p>
                            </div>
                          </div>
                        </td>

                        {item.mode === 'overall' ? (
                          <>
                            <td className="px-6 py-4 text-center">
                              <span className="text-sm font-bold text-slate-200">
                                {item.totalExams}
                              </span>
                            </td>

                            <td className="px-6 py-4 text-center">
                              <span className="text-sm font-bold text-emerald-400">
                                {item.participatedExams}
                              </span>
                            </td>

                            <td className="px-6 py-4 text-center">
                              <span
                                className={`text-sm font-bold ${
                                  item.absentExams > 0
                                    ? 'text-rose-400'
                                    : 'text-slate-500'
                                }`}
                              >
                                {item.absentExams}
                              </span>
                            </td>
                          </>
                        ) : (
                          <td className="px-6 py-4">
                            <p className="max-w-[220px] truncate text-xs font-bold text-slate-200">
                              {item.exam.title}
                            </p>

                            <p className="mt-1 text-[10px] text-slate-500">
                              {item.exam.subject} · {formatDate(item.exam.examDate)}
                            </p>

                            {item.isAbsent && (
                              <span className="mt-1.5 inline-flex rounded-md bg-rose-500/10 px-2 py-0.5 text-[10px] font-bold text-rose-400">
                                অনুপস্থিত = ০
                              </span>
                            )}
                          </td>
                        )}

                        {/* CLASS & BATCH */}
                        <td className="px-6 py-4">
                          <p className="text-xs font-bold text-slate-200">
                            Class {item.student.className}
                          </p>

                          <p className="mt-1 text-[10px] text-slate-500">
                            {item.student.batch
                              ? `Batch ${item.student.batch}`
                              : 'No batch'}
                            {item.student.group
                              ? ` · ${item.student.group}`
                              : ''}
                          </p>
                        </td>

                        {/* MARKS */}
                        <td className="px-6 py-4 text-center">
                          <p className="font-black text-emerald-400">
                            {getMarksText(item)}
                          </p>
                        </td>

                        {/* PERCENTAGE */}
                        <td className="px-6 py-4 text-center">
                          <span className="text-xs font-bold text-slate-200">
                            {getPercentage(item).toFixed(2)}%
                          </span>
                        </td>

                        {/* GRADE */}
                        {item.mode === 'single' && (
                          <td className="px-6 py-4 text-center">
                            <span
                              className={`inline-flex min-w-9 items-center justify-center rounded-lg px-2 py-1 text-xs font-black ${
                                item.isAbsent
                                  ? 'bg-rose-500/10 text-rose-400'
                                  : item.grade === 'F'
                                    ? 'bg-rose-500/10 text-rose-400'
                                    : 'bg-emerald-500/10 text-emerald-400'
                              }`}
                            >
                              {item.grade}
                            </span>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* MOBILE */}
              <div className="divide-y divide-white/5 md:hidden">
                {paginatedResults.map((item) => (
                  <div key={item.key} className="p-4">
                    <div className="flex items-start gap-3">
                      <span
                        className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-black ${getRankClassName(
                          item.rank
                        )}`}
                      >
                        {item.rank}
                      </span>

                      {item.student.photo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.student.photo}
                          alt={item.student.name}
                          className="h-10 w-10 shrink-0 rounded-full border border-white/10 object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10 text-sm font-bold text-emerald-400">
                          {getStudentInitial(item.student.name)}
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-white">
                              {item.student.name}
                            </p>

                            <p className="mt-0.5 text-[10px] text-slate-500">
                              Class {item.student.className}
                              {item.student.batch
                                ? ` · Batch ${item.student.batch}`
                                : ''}
                            </p>
                          </div>

                          <div className="shrink-0 text-right">
                            <p className="text-sm font-black text-emerald-400">
                              {getMarksText(item)}
                            </p>

                            <p className="text-[10px] font-semibold text-slate-500">
                              {getPercentage(item).toFixed(2)}%
                            </p>
                          </div>
                        </div>

                        {item.mode === 'overall' ? (
                          <div className="mt-3 grid grid-cols-3 gap-2">
                            <div className="rounded-lg border border-white/5 bg-black/20 p-2 text-center">
                              <p className="text-[9px] uppercase text-slate-500">
                                Exams
                              </p>
                              <p className="text-xs font-bold text-white">
                                {item.totalExams}
                              </p>
                            </div>

                            <div className="rounded-lg border border-white/5 bg-black/20 p-2 text-center">
                              <p className="text-[9px] uppercase text-slate-500">
                                Present
                              </p>
                              <p className="text-xs font-bold text-emerald-400">
                                {item.participatedExams}
                              </p>
                            </div>

                            <div className="rounded-lg border border-white/5 bg-black/20 p-2 text-center">
                              <p className="text-[9px] uppercase text-slate-500">
                                Absent
                              </p>
                              <p
                                className={`text-xs font-bold ${
                                  item.absentExams > 0
                                    ? 'text-rose-400'
                                    : 'text-slate-400'
                                }`}
                              >
                                {item.absentExams}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="mt-3 rounded-xl border border-white/5 bg-black/20 p-3">
                            <div className="flex items-center justify-between gap-3">
                              <div className="min-w-0">
                                <p className="truncate text-xs font-bold text-slate-200">
                                  {item.exam.title}
                                </p>
                                <p className="mt-1 text-[10px] text-slate-500">
                                  {item.exam.subject} · {formatDate(item.exam.examDate)}
                                </p>
                              </div>

                              <span
                                className={`shrink-0 rounded-lg px-2 py-1 text-xs font-black ${
                                  item.isAbsent || item.grade === 'F'
                                    ? 'bg-rose-500/10 text-rose-400'
                                    : 'bg-emerald-500/10 text-emerald-400'
                                }`}
                              >
                                {item.grade}
                              </span>
                            </div>

                            {item.isAbsent && (
                              <p className="mt-2 text-[10px] font-bold text-rose-400">
                                অনুপস্থিত — এই পরীক্ষায় ০ নম্বর গণনা হয়েছে
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* PAGINATION */}
              {totalPages > 1 && (
                <div className="flex flex-col gap-3 border-t border-white/5 bg-black/20 px-4 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6">
                  <p className="text-xs text-slate-500">
                    Page {currentPage} of {totalPages} · {leaderboard.length}{' '}
                    students
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setCurrentPage((page) => Math.max(1, page - 1))
                      }
                      disabled={currentPage === 1}
                      className="inline-flex h-9 items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-3 text-xs font-bold text-slate-300 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setCurrentPage((page) =>
                          Math.min(totalPages, page + 1)
                        )
                      }
                      disabled={currentPage === totalPages}
                      className="inline-flex h-9 items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-3 text-xs font-bold text-slate-300 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex min-h-[320px] flex-col items-center justify-center px-6 py-16 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/5">
                <BookOpen className="h-6 w-6 text-slate-500" />
              </div>

              <h3 className="text-base font-bold text-white">
                কোনো ফলাফল পাওয়া যায়নি
              </h3>

              <p className="mt-2 max-w-md text-sm text-slate-500">
                নির্বাচিত exam, class, batch, type অথবা search filter পরিবর্তন
                করে আবার চেষ্টা করুন।
              </p>
            </div>
          )}
        </div>

        {/* NOTE */}
        <div className="mt-5 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3">
          <p className="text-[11px] leading-5 text-slate-500">
            <span className="font-bold text-slate-400">Ranking:</span>{' '}
            {selectedExam === 'ALL'
              ? 'প্রতিটি শিক্ষার্থীর filtered published exam-এর প্রাপ্ত নম্বর যোগ করা হয়। কোনো exam-এ absent হলে সেই exam-এর marks ০। মোট marks সমান হলে একই rank দেওয়া হয়।'
              : 'নির্বাচিত exam-এর প্রাপ্ত marks descending অনুযায়ী rank হয়। absent হলে marks ০ এবং ০ marks পাওয়া অন্যান্য শিক্ষার্থীর সঙ্গে একই ranking rule প্রযোজ্য।'}
          </p>
        </div>
      </div>
    </div>
  );
}
