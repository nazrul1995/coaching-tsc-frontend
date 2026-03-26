'use client';

import axiosSecure from '@/lib/axiosSecure';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import EnrollButton from '@/components/button/EnrollButton';
import { TCourse } from '@/types/course';

const CourseDetails = () => {
    const params = useParams();
    const courseId = params?.id as string;

    const { data: course, isLoading, isError } = useQuery<TCourse>({
        queryKey: ['single-course', courseId],
        queryFn: async () => {
            const res = await axiosSecure.get(`/courses/${courseId}`);
            return res.data.data;
        },
    });

    if (isLoading)
        return (
            <div className="min-h-screen flex items-center justify-center text-white bg-[#0b1326]">
                <p className="animate-pulse text-lg">Loading course...</p>
            </div>
        );

    if (isError || !course)
        return (
            <div className="min-h-screen flex items-center justify-center text-white bg-[#0b1326]">
                Course not found.
            </div>
        );

    return (
        <div className="min-h-screen bg-[#0b1326] text-white">
            {/* HERO */}
            <div className="relative w-full h-[420px] md:h-[520px] overflow-hidden">
                <Image
                    src={course.thumbnail}
                    alt={course.title}
                    fill
                    className="object-cover scale-105 blur-[2px]"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[#0b1326]" />
                <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
                    <h1 className="text-4xl md:text-6xl font-extrabold leading-tight max-w-4xl">
                        {course.title}
                    </h1>
                    <div className="flex gap-4 mt-4 text-white/70 flex-wrap justify-center">
                        <span>⭐ {course.rating}</span>
                        <span>👨‍🎓 {course.enrolledStudents} students</span>
                        <span>📦 {course.totalModules} modules</span>
                        {course.duration && <span>⏱ {course.duration}</span>}
                    </div>
                </div>
            </div>

            {/* CONTENT */}
            <div className="max-w-7xl mx-auto px-6 md:px-4 grid md:grid-cols-12 gap-10 py-14">
                {/* LEFT */}
                <div className="md:col-span-8 space-y-8">
                    {/* Description */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        <h2 className="text-2xl font-bold mb-3">About this course</h2>
                        <p className="text-white/80 leading-relaxed text-lg">
                            {course.description}
                        </p>
                    </div>

                    {/* Modules Placeholder */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        <h2 className="text-2xl font-bold mb-5">Course Content</h2>
                        <p className="text-white/80">
                            This course has {course.totalModules} modules.
                        </p>
                    </div>
                </div>

                {/* RIGHT SIDEBAR */}
                <div className="md:col-span-4">
                    <div className="sticky top-24 backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 shadow-2xl space-y-6">
                        {/* Thumbnail */}
                        <div className="relative w-full h-56 rounded-xl overflow-hidden">
                            <Image
                                src={course.thumbnail}
                                alt={course.title}
                                fill
                                className="object-cover"
                            />
                        </div>

                        {/* Price */}
                        <div className="flex justify-between items-center">
                            <span className="text-3xl font-extrabold text-green-400">
                                ৳{course.price}
                            </span>
                            {course.rating >= 4.5 && (
                                <span className="bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full">
                                    Top Rated
                                </span>
                            )}
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col gap-4">
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    className="bg-blue-400 hover:bg-blue-500 text-white font-semibold transition-colors duration-200"
                                >
                                    <Link href={`/courses/${course._id}`}>
                                        Already enrolled
                                    </Link>
                                </Button>
                                <EnrollButton course={course} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetails;