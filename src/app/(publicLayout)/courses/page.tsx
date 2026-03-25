'use client'

import React, { useState, useEffect } from 'react'
import axiosSecure from '@/lib/axiosSecure'
import { useQuery } from '@tanstack/react-query'

import { Button } from '@/components/ui/button'
import { TCourse } from '@/types/course'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import Image from 'next/image'

const Courses = () => {
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [sort, setSort] = useState('price')
  const [order, setOrder] = useState('desc')
  const [rating, setRating] = useState<string>('')
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })
  const [page, setPage] = useState(1)

  const limit = 5

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, 400)
    return () => clearTimeout(timer)
  }, [search])

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
      })
      return res.data
    },
  })

  const courses = data?.data || []

  return (
    <div className="min-h-screen mt-20 bg-[#0b1326] text-white p-6">
      <div className="max-w-7xl mx-auto">

        {/* 🔥 Page Title */}
        <h1 className="text-3xl md:text-4xl font-bold mb-8">
          📚 Explore Courses
        </h1>

        <div className="grid grid-cols-12 gap-6">

          {/* 🧩 Sidebar */}
          <div className="col-span-12 md:col-span-3 bg-white/5 p-5 rounded-2xl border border-white/10 h-fit">

            <h2 className="text-xl font-semibold mb-4">Filters</h2>

            {/* 🔍 Search */}
            <div className="mb-6">
              <p className="mb-2 text-sm">Search</p>
              <Input
                placeholder="Search courses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-white/10"
              />
            </div>

            {/* 🔽 Sort */}
            <div className="mb-6">
              <p className="mb-2 text-sm">Sort By</p>
              <div className="flex gap-2">
                <Select onValueChange={(val) => setSort(val as string)}>
                  <SelectTrigger className="bg-white/10">
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price">Price</SelectItem>
                    <SelectItem value="createdAt">Newest</SelectItem>
                  </SelectContent>
                </Select>

                <Select onValueChange={(val) => setOrder(val as string)}>
                  <SelectTrigger className="bg-white/10">
                    <SelectValue placeholder="Order" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">Asc</SelectItem>
                    <SelectItem value="desc">Desc</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* ⭐ Rating */}
            <div className="mb-6">
              <p className="mb-2 text-sm">Minimum Rating</p>
              <Select onValueChange={(val) => setRating(val as string)}>
                <SelectTrigger className="bg-white/10">
                  <SelectValue placeholder="Select rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="4">4+</SelectItem>
                  <SelectItem value="4.5">4.5+</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 💰 Price Range */}
            <div className="mb-6">
              <p className="mb-2 text-sm">Price Range</p>
              <div className="flex gap-2">
                <Input
                  placeholder="Min"
                  type="number"
                  className="bg-white/10"
                  onChange={(e) =>
                    setPriceRange({
                      ...priceRange,
                      min: e.target.value,
                    })
                  }
                />
                <Input
                  placeholder="Max"
                  type="number"
                  className="bg-white/10"
                  onChange={(e) =>
                    setPriceRange({
                      ...priceRange,
                      max: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            {/* 🔄 Reset */}
            <Button
              variant="secondary"
              className="mt-4 w-full"
              onClick={() => {
                setRating('')
                setPriceRange({ min: '', max: '' })
                setSearch('')
                setPage(1)
              }}
            >
              Reset Filters
            </Button>
          </div>

          {/* 🎯 Main Content */}
          <div className="col-span-12 md:col-span-9">

            {/* Courses */}
            {isLoading ? (
              <p>Loading...</p>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course: TCourse) => (
                  <div
                    key={course._id}
                    className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-400 transition"
                  >
                    <Image
                      width={500}
                      height={500}
                      src={course.thumbnail}
                      alt={course.title}
                      className="h-40 w-full object-cover rounded-xl mb-4"
                    />

                    <h3 className="font-bold text-lg mb-2 line-clamp-2">
                      {course.title}
                    </h3>

                    <div className="text-sm text-white/60 mb-3">
                      ⭐ {course.rating} • 👨‍🎓 {course.enrolledStudents}
                    </div>

                    <div className="flex justify-between items-center mt-3 gap-2">
                      <span className="text-green-400 font-bold">
                        ৳{course.price}
                      </span>

                      <div className="flex gap-2">
                        <Button size="sm">View Details</Button>
                        <Button size="sm">Enroll</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            <div className="flex justify-center gap-2 mt-10 flex-wrap">
              {Array.from({ length: data?.meta?.totalPage || 1 }).map(
                (_, i) => {
                  const pageNum = i + 1
                  return (
                    <Button
                      key={i}
                      variant={page === pageNum ? 'default' : 'outline'}
                      className={
                        page === pageNum
                          ? 'bg-blue-400 text-black'
                          : 'border-white/30 text-black'
                      }
                      onClick={() => setPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  )
                }
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Courses