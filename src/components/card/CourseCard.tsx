'use client';
import React from 'react';
import Image from 'next/image';
import { TCourse } from '@/types/course';
import EnrollButton from '../button/EnrollButton';
import Link from 'next/link';

interface CourseCardProps {
  course: TCourse;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <div className="relative flex flex-col p-5 rounded-2xl bg-linear-to-b from-white/5 to-white/10 border border-white/10 hover:shadow-lg hover:border-blue-400 transition-all duration-300">
      {/* Thumbnail */}
      <div className="relative w-full h-40 mb-4 rounded-xl overflow-hidden shadow-sm">
        <Image
          src={course.thumbnail}
          alt={course.title}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          fill
          className="transition-transform duration-300 hover:scale-105 object-cover"
        />
      </div>

      {/* Course Title */}
      <h3 className="font-bold text-lg mb-2 line-clamp-2 text-white">
      <Link href={`/courses/${course._id}`}>
  {course.title}
</Link>
      </h3>

      {/* Rating & Students */}
      <div className="flex items-center text-sm text-white/60 gap-3 mb-3">
        <span>⭐ {course.rating}</span>
        <span>👨‍🎓 {course.enrolledStudents}</span>
        <span>📦 {course.totalModules} Modules</span>
      </div>

      {/* Price & Buttons */}
      <div className="flex justify-between items-center gap-2 mt-auto">
        <span className="text-green-400 font-bold text-lg">৳{course.price}</span>
        <div className="flex gap-2">
          <EnrollButton course={course}></EnrollButton>
        </div>
      </div>

      {/* Optional Badge */}
      {course.rating >= 4.5 && (
        <span className="absolute top-3 left-3 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-full shadow-md">
          Top Rated
        </span>
      )}
    </div>
  );
};

export default CourseCard;