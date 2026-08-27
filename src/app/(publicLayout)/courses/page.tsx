'use client';
import React, { useState, useEffect } from 'react';
import axiosSecure from '@/lib/axiosSecure';
import { useQuery } from '@tanstack/react-query';
import CourseSidebar from '@/components/pages/courses/CourseSidebar';
import CourseGrid from '@/components/pages/courses/CourseGrid';
import CoursePagination from '@/components/pages/courses/CoursePagination';
const Courses = () => {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sort, setSort] = useState('price');
  const [order, setOrder] = useState('desc');
  const [rating, setRating] = useState<string>('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [page, setPage] = useState(1);

  const limit = 6;

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading } = useQuery({
    queryKey: [
      'courses',
      debouncedSearch,
      sort,
      order,
      rating,
      priceRange,
      page,
    ],
    queryFn: async () => {
      const res = await axiosSecure.get('/courses', {
        params: {
          search: debouncedSearch,
          sort,
          order,
          rating,
          priceMin: priceRange.min,
          priceMax: priceRange.max,
          page,
          limit,
        },
      });
      return res.data;
    },
  });

  const courses = data?.data || [];
  const totalPages = data?.meta?.totalPage || 1;

  const resetFilters = () => {
    setRating('');
    setPriceRange({ min: '', max: '' });
    setSearch('');
    setPage(1);
  };

  return (
    <div className="min-h-screen mt-20 bg-[#0b1326] text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">📚 Explore Courses</h1>
        <div className="grid grid-cols-12 gap-6">
          <CourseSidebar
            search={search}
            setSearch={setSearch}
            sort={sort}
            setSort={setSort}
            order={order}
            setOrder={setOrder}
            rating={rating}
            setRating={setRating}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            resetFilters={resetFilters}
          />
          <div className="col-span-12 md:col-span-9">
            <CourseGrid courses={courses} isLoading={isLoading} />
            <CoursePagination totalPages={totalPages} page={page} setPage={setPage} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Courses;