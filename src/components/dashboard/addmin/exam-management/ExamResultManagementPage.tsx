// 'use client';

// import React, { useEffect, useMemo, useState } from 'react';
// import { BarChart3, ClipboardCheck, ListChecks, Trophy, Users } from 'lucide-react';
// import Swal from 'sweetalert2';
// import axiosSecure from '@/lib/axiosSecure';

// import {
//   DashboardPageHeader,
//   DashboardStatCard,
//   DashboardStatGrid,
//   FilterSelect,
//   LoadingState,
//   SearchInput,
// } from '@/components/dashboard/common';

// import { Exam } from './exam.types';
// import { ExamResultRecord, LeaderboardRow } from './result.types';
// import ExamResultEntry from './ExamResultEntry';
// import ExamResultTable from './ExamResultTable';
// import LeaderboardTable from './LeaderboardTable';

// export default function ExamResultManagementPage() {
//   // ======================================================
//   // States
//   // ======================================================
//   const [exams, setExams] = useState<Exam[]>([]);
//   const [selectedExamId, setSelectedExamId] = useState('');
//   const [results, setResults] = useState<ExamResultRecord[]>([]);
//   const [leaderboard, setLeaderboard] = useState<LeaderboardRow[]>([]);
//   const [search, setSearch] = useState('');
//   const [tab, setTab] = useState<'results' | 'leaderboard'>('results');
  
//   const [loading, setLoading] = useState(true);
//   const [resultLoading, setResultLoading] = useState(false);
//   const [entryOpen, setEntryOpen] = useState(false);

//   // Selected Exam memoization
//   const selectedExam = useMemo(
//     () => exams.find((e) => e._id === selectedExamId) || null,
//     [exams, selectedExamId]
//   );

//   // ======================================================
//   // Data Fetching Handlers
//   // ======================================================
//   const loadExams = async () => {
//     setLoading(true);
//     try {
//       const response = await axiosSecure.get('/exams');
//       const data = response.data?.data || response.data || [];
//       const examList = Array.isArray(data) ? data : [];
      
//       setExams(examList);

//       if (!selectedExamId && examList.length > 0) {
//         setSelectedExamId(examList[0]._id);
//       }
//     } catch (error) {
//       Swal.fire({
//         icon: 'error',
//         title: 'Unable to load exams',
//         background: '#0b1326',
//         color: '#fff',
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadData = async () => {
//     if (!selectedExamId) return;

//     setResultLoading(true);
//     try {
//       const leaderboardRes = await axiosSecure.get(
//         `/exams/${selectedExamId}/leaderboard`
//       );
//       setLeaderboard(leaderboardRes.data?.data || []);
      
//       /* Note: The current backend does not expose GET /exams/:examId/results. 
//          Result review is therefore based on leaderboard until that endpoint exists. */
//     } catch (error: any) {
//       setLeaderboard([]);
//       Swal.fire({
//         icon: 'error',
//         title: 'Unable to load leaderboard',
//         text: error?.response?.data?.message || 'Please try again.',
//         background: '#0b1326',
//         color: '#fff',
//       });
//     } finally {
//       setResultLoading(false);
//     }
//   };

//   // ======================================================
//   // Effects
//   // ======================================================
//   useEffect(() => {
//     loadExams();
//   }, []);

//   useEffect(() => {
//     loadData();
//   }, [selectedExamId]);

//   // ======================================================
//   // Filtered & Derived Data
//   // ======================================================
//   const filteredResults = results.filter((r) => {
//     const q = search.toLowerCase();
//     return (
//       !q ||
//       r.student?.name?.toLowerCase().includes(q) ||
//       String(r.student?.className || '').includes(q) ||
//       String(r.student?.batch || '').toLowerCase().includes(q)
//     );
//   });

//   const presentCount = results.filter((r) => !r.isAbsent).length;
//   const absentCount = results.filter((r) => r.isAbsent).length;

//   if (loading) return <LoadingState />;

//   return (
//     <div className="space-y-6 text-white">
//       {/* Header */}
//       <DashboardPageHeader
//         title="Exam Results"
//         description="Enter, review and analyze exam results and leaderboard performance."
//         icon={ClipboardCheck}
//       />

//       {/* Stats Section */}
//       <DashboardStatGrid>
//         <DashboardStatCard
//           title="Selected Exam"
//           value={selectedExam?.title || '—'}
//           subtitle={selectedExam?.status || '—'}
//           icon={ClipboardCheck}
//           accent="blue"
//         />
//         <DashboardStatCard
//           title="Results"
//           value={String(results.length)}
//           subtitle="Loaded result records"
//           icon={ListChecks}
//           accent="green"
//         />
//         <DashboardStatCard
//           title="Present"
//           value={String(presentCount)}
//           subtitle="Students with marks"
//           icon={Users}
//           accent="blue"
//         />
//         <DashboardStatCard
//           title="Absent"
//           value={String(absentCount)}
//           subtitle="Absent records"
//           icon={BarChart3}
//           accent="rose"
//         />
//       </DashboardStatGrid>

//       {/* Controls & Tabs */}
//       <div className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-4 sm:p-5">
//         <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
//           <FilterSelect
//             value={selectedExamId}
//             onChange={setSelectedExamId}
//             options={exams.map((e) => ({
//               value: e._id,
//               label: `${e.title} · ${e.className}`,
//             }))}
//             placeholder="Select exam"
//           />

//           <div className="flex flex-wrap gap-2">
//             <button
//               onClick={() => setEntryOpen(true)}
//               disabled={!selectedExam || selectedExam.status === 'published'}
//               className="rounded-xl bg-gradient-to-r from-[#adc6ff] to-[#6ffbbe] px-4 py-2.5 text-xs font-black text-[#0b1326] disabled:opacity-40"
//             >
//               Enter Results
//             </button>

//             <button
//               onClick={loadData}
//               className="rounded-xl border border-white/10 px-4 py-2.5 text-xs font-bold text-white/60 hover:bg-white/5"
//             >
//               Refresh
//             </button>
//           </div>
//         </div>

//         {/* Tab Navigation */}
//         <div className="mt-4 flex gap-2 border-b border-white/10">
//           <button
//             onClick={() => setTab('results')}
//             className={`border-b-2 px-3 py-2 text-xs font-bold ${
//               tab === 'results'
//                 ? 'border-[#6ffbbe] text-[#6ffbbe]'
//                 : 'border-transparent text-white/40'
//             }`}
//           >
//             Results
//           </button>

//           <button
//             onClick={() => setTab('leaderboard')}
//             className={`flex items-center gap-1 border-b-2 px-3 py-2 text-xs font-bold ${
//               tab === 'leaderboard'
//                 ? 'border-[#6ffbbe] text-[#6ffbbe]'
//                 : 'border-transparent text-white/40'
//             }`}
//           >
//             <Trophy size={13} /> Leaderboard
//           </button>
//         </div>
//       </div>

//       {/* Tab Content */}
//       {tab === 'results' ? (
//         <>
//           <div className="flex justify-end">
//             <SearchInput
//               value={search}
//               onChange={setSearch}
//               placeholder="Search student..."
//             />
//           </div>
//           <ExamResultTable results={filteredResults} />
//         </>
//       ) : (
//         <LeaderboardTable rows={leaderboard} />
//       )}

//       {/* Floating Loading Indicator */}
//       {resultLoading && (
//         <div className="fixed bottom-5 right-5 rounded-xl border border-white/10 bg-[#0b1326] px-4 py-3 text-xs text-white/60 shadow-2xl">
//           Loading...
//         </div>
//       )}

//       {/* Result Entry Modal/Drawer */}
//       <ExamResultEntry
//         exam={selectedExam}
//         open={entryOpen}
//         onClose={() => {
//           setEntryOpen(false);
//           loadData();
//         }}
//       />
//     </div>
//   );
// }