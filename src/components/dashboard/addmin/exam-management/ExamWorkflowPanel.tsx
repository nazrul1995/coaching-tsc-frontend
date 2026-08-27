'use client';

import React, { useEffect, useState } from 'react';
import {
    Loader2,
    Trophy,
    UploadCloud,
} from 'lucide-react';
import Swal from 'sweetalert2';

import axiosSecure from '@/lib/axiosSecure';
import {
    Exam,
    ExamResult,
    LeaderboardItem,
} from './exam.types';

interface ExamWorkflowPanelProps {
    exam: Exam | null;
    open: boolean;
    onClose: () => void;
    onEnterResults: () => void;
}

export default function ExamWorkflowPanel({
    exam,
    open,
    onClose,
    onEnterResults,
}: ExamWorkflowPanelProps) {
    const [results, setResults] = useState<ExamResult[]>([]);
    const [leaderboard, setLeaderboard] =
        useState<LeaderboardItem[]>([]);

    const [loading, setLoading] = useState(false);
    const [publishing, setPublishing] = useState(false);

    /**
     * Load exam results and leaderboard
     */
    const load = async () => {
        if (!exam) return;

        setLoading(true);

        try {
            const [resultsResponse, leaderboardResponse] =
                await Promise.all([
                    axiosSecure.get(
                        `/exams/${exam._id}/results`,
                    ),
                    axiosSecure.get(
                        `/exams/${exam._id}/leaderboard`,
                    ),
                ]);

            setResults(
                resultsResponse.data?.data || [],
            );

            setLeaderboard(
                leaderboardResponse.data?.data || [],
            );
        } catch (error) {
            // Keep existing behavior: silently ignore load errors
        } finally {
            setLoading(false);
        }
    };

    /**
     * Load data whenever the panel opens
     * or selected exam changes.
     */

    console.log(leaderboard)
    useEffect(() => {
        if (!open) return;

        load();
    }, [open, exam?._id]);

    /**
     * Publish exam results
     */
    const publishResults = async () => {
        if (!exam) return;

        setPublishing(true);

        try {
            const response = await axiosSecure.patch(
                `/exams/results/${exam._id}/publish`,
            );

            await Swal.fire({
                icon: 'success',
                title: 'Results published',
                text:
                    response.data?.message ||
                    'Results are now published.',
                background: '#0b1326',
                color: '#fff',
                confirmButtonColor: '#6ffbbe',
            });

            await load();
        } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: 'Publish failed',
                text:
                    error?.response?.data?.message ||
                    'Some eligible students may still be missing results.',
                background: '#0b1326',
                color: '#fff',
            });
        } finally {
            setPublishing(false);
        }
    };

    /**
     * Don't render when panel is closed
     * or no exam is selected.
     */
    if (!open || !exam) {
        return null;
    }

    /**
     * Workflow statistics
     */
    const totalResults = results.length;

    const draftResults = results.filter(
        (result) => result.status === 'draft',
    ).length;

    const publishedResults = results.filter(
        (result) => result.status === 'published',
    ).length;

    const leaderboardCount = leaderboard.length;

    const hasDraftResults = results.some(
        (result) => result.status === 'draft',
    );

    return (
        <div className="fixed inset-0 z-[105] flex items-end justify-center bg-black/75 p-0 backdrop-blur-md sm:items-center sm:p-4">
            <div className="max-h-[92vh] w-full overflow-y-auto rounded-t-[2rem] border border-white/10 bg-[#0b1326] sm:max-w-5xl sm:rounded-[2rem]">
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#0b1326]/95 p-5 backdrop-blur-xl">
                    <div>
                        <h3 className="text-sm font-black text-white">
                            Exam Workflow
                        </h3>

                        <p className="text-[10px] text-white/30">
                            {exam.title} · Class {exam.className}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl border border-white/10 px-3 py-2 text-xs text-white/50"
                    >
                        Close
                    </button>
                </div>

                {/* Loading */}
                {loading ? (
                    <div className="flex min-h-[300px] items-center justify-center">
                        <Loader2
                            size={24}
                            className="animate-spin text-[#6ffbbe]"
                        />
                    </div>
                ) : (
                    <div className="p-5">
                        {/* Workflow Statistics */}
                        <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                            <Mini
                                label="Eligible / Results"
                                value={String(totalResults)}
                            />

                            <Mini
                                label="Draft"
                                value={String(draftResults)}
                            />

                            <Mini
                                label="Published"
                                value={String(publishedResults)}
                            />

                            <Mini
                                label="Leaderboard"
                                value={String(leaderboardCount)}
                            />
                        </div>

                        {/* Actions */}
                        <div className="mb-5 flex flex-wrap gap-2">
                            {exam.status === 'published' && (
  <button
    type="button"
    onClick={onEnterResults}
    className="flex h-10 items-center gap-2 rounded-xl bg-linear-to-r from-[#adc6ff] to-[#6ffbbe] px-4 text-xs font-black text-[#0b1326]"
  >
    Enter / Complete Results
  </button>
)}


                            {exam.status === 'published' &&
                                hasDraftResults && (
                                    <button
                                        type="button"
                                        onClick={publishResults}
                                        disabled={publishing}
                                        className="flex h-10 items-center gap-2 rounded-xl border border-[#6ffbbe]/20 bg-[#6ffbbe]/5 px-4 text-xs font-bold text-[#6ffbbe]"
                                    >
                                        {publishing ? (
                                            <Loader2
                                                size={14}
                                                className="animate-spin"
                                            />
                                        ) : (
                                            <UploadCloud size={14} />
                                        )}

                                        Publish Results
                                    </button>
                                )}
                        </div>

                        {/* Results + Leaderboard */}
                        <div className="grid gap-5 lg:grid-cols-2">
                            {/* Result Records */}
                            <section className="overflow-hidden rounded-2xl border border-white/10">
                                <div className="border-b border-white/10 p-4">
                                    <p className="text-xs font-black text-white">
                                        Result Records
                                    </p>
                                </div>

                                {results.length ? (
                                    <div className="divide-y divide-white/5">
                                        {results
                                            .slice(0, 20)
                                            .map((result) => {
                                                const isPublished =
                                                    result.status === 'published';

                                                return (
                                                    <div
                                                        key={result._id}
                                                        className="flex items-center justify-between p-3"
                                                    >
                                                        {/* Student Result */}
                                                        <div>
                                                            <p className="text-xs font-bold text-white">
                                                                {result.student?.name ||
                                                                    'Student'}
                                                            </p>

                                                            <p className="text-[9px] text-white/30">
                                                                {result.isAbsent
                                                                    ? 'Absent'
                                                                    : `${result.marks}/${result.totalMarks} · ${result.grade}`}
                                                            </p>
                                                        </div>

                                                        {/* Status */}
                                                        <span
                                                            className={`text-[9px] font-bold uppercase ${isPublished
                                                                ? 'text-[#6ffbbe]'
                                                                : 'text-amber-300'
                                                                }`}
                                                        >
                                                            {result.status}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                    </div>
                                ) : (
                                    <div className="p-8 text-center text-xs text-white/30">
                                        No results entered yet.
                                    </div>
                                )}
                            </section>

                            {/* Leaderboard */}
                            <section className="overflow-hidden rounded-2xl border border-white/10">
                                <div className="flex items-center gap-2 border-b border-white/10 p-4">
                                    <Trophy
                                        size={15}
                                        className="text-amber-300"
                                    />

                                    <p className="text-xs font-black text-white">
                                        Leaderboard
                                    </p>
                                </div>

                                {leaderboard.length ? (
                                    <div className="divide-y divide-white/5">
                                        {leaderboard
                                            .slice(0, 10)
                                            .map((item, ind) => (
                                                <div
                                                    key={item.student?._id || ind}
                                                    className="flex items-center gap-3 p-3"
                                                >
                                                    {/* Rank */}
                                                    <span className="w-6 text-center text-xs font-black text-amber-300">
                                                        #{item.rank}
                                                    </span>

                                                    {/* Student */}
                                                    <div className="min-w-0 flex-1">
                                                        <p className="truncate text-xs font-bold text-white">
                                                            {item.student?.name}
                                                        </p>

                                                        <p className="text-[9px] text-white/30">
                                                            {item.marks}/{item.totalMarks} ·{' '}
                                                            {item.percentage}%
                                                        </p>
                                                    </div>

                                                    {/* Grade */}
                                                    <span className="text-xs font-black text-[#6ffbbe]">
                                                        {item.grade}
                                                    </span>
                                                </div>
                                            ))}
                                    </div>
                                ) : (
                                    <div className="p-8 text-center text-xs text-white/30">
                                        Leaderboard appears after published
                                        results.
                                    </div>
                                )}
                            </section>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

/**
 * Small statistic card used in the workflow panel.
 */
function Mini({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div className="rounded-2xl border border-white/5 bg-white/[0.025] p-3">
            <p className="text-[8px] uppercase tracking-wider text-white/25">
                {label}
            </p>

            <p className="mt-1 text-lg font-black text-white">
                {value}
            </p>
        </div>
    );
}
