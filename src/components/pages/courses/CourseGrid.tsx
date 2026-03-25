'use client';
import React from 'react';
import { TCourse } from '@/types/course';
import CourseCard from '@/components/card/CourseCard';

interface CourseGridProps {
  courses: TCourse[];
  isLoading: boolean;
}

const CourseGrid: React.FC<CourseGridProps> = ({ courses, isLoading }) => {
  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <CourseCard key={course._id} course={course} />
      ))}
    </div>
  );
};

export default CourseGrid;