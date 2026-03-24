'use client'

import React, { useState, useEffect } from 'react'
import axiosSecure from '@/lib/axiosSecure'
import { useQuery } from '@tanstack/react-query'

import { Button } from '@/components/ui/button'

import { TCourse } from '@/types/course'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'

const Courses = () => {
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [sort, setSort] = useState('price')
  const [order, setOrder] = useState('desc')
  const [rating, setRating] = useState('')
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })
  const [page, setPage] = useState(1)

  const limit = 5

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, 400)
    return () => clearTimeout(timer)
  }, [search])

  const { data, isLoading } = useQuery({
    queryKey: ['courses', debouncedSearch, sort, order, rating, priceRange, page],
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
  const meta = data?.meta || {}
  const totalPages = meta.totalPage || 1

  return (
    <div className="min-h-screen mt-20 bg-[#0b1326] text-white p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6">

        {/* Sidebar */}
        <div className="col-span-12 md:col-span-3 bg-white/5 p-5 rounded-2xl border border-white/10 h-[calc(100vh-120px)] flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-4">Filters</h2>

            {/* Rating */}
            <div className="mb-6">
              <p className="mb-2 text-sm">Minimum Rating</p>
              <Select onValueChange={(val) => setRating(val)}>
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

            {/* Price Range */}
            <div className="mb-6">
              <p className="mb-2 text-sm">Price Range</p>
              <div className="flex gap-2">
                <Input
                  placeholder="Min"
                  type="number"
                  className="bg-white/10"
                  onChange={(e) =>
                    setPriceRange({ ...priceRange, min: e.target.value })
                  }
                />
                <Input
                  placeholder="Max"
                  type="number"
                  className="bg-white/10"
                  onChange={(e) =>
                    setPriceRange({ ...priceRange, max: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          <Button
            variant="secondary"
            className="mt-4"
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

        {/* Main Content */}
        <div className="col-span-12 md:col-span-9">

          {/* Top Controls */}
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">

            <Input
              placeholder="Search courses (HSC, SSC...)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="md:w-1/2 bg-white/10"
            />

            <div className="flex gap-2">
              <Select onValueChange={(val) => setSort(val)}>
                <SelectTrigger className="w-[150px] bg-white/10">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="createdAt">Newest</SelectItem>
                </SelectContent>
              </Select>

              <Select onValueChange={(val) => setOrder(val)}>
                <SelectTrigger className="w-[120px] bg-white/10">
                  <SelectValue placeholder="Order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Asc</SelectItem>
                  <SelectItem value="desc">Desc</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Courses Grid */}
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course: TCourse) => (
                <div
                  key={course._id}
                  className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-400 transition"
                >
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="h-40 w-full object-cover rounded-xl mb-4"
                  />

                  <h3 className="font-bold text-lg mb-2 line-clamp-2">
                    {course.title}
                  </h3>

                  <p className="text-sm text-white/70 mb-3 line-clamp-3">
                    {course.description}
                  </p>

                  <div className="text-sm text-white/60 mb-2">
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
            {Array.from({ length: data?.meta?.totalPage || 1 }).map((_, i) => {
              const pageNum = i + 1
              return (
                <Button
                  key={i}
                  variant={page === pageNum ? 'default' : 'outline'}
                  className={page === pageNum ? 'bg-blue-400 text-black' : 'border-white/30 text-black'}
                  onClick={() => setPage(pageNum)}
                >
                  {pageNum}
                </Button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Courses