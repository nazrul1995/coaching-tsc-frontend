'use client';
import React, { Dispatch, SetStateAction } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SidebarProps {
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  sort: string;
  setSort: Dispatch<SetStateAction<string>>;
  order: string;
  setOrder: Dispatch<SetStateAction<string>>;
  rating: string;
  setRating: Dispatch<SetStateAction<string>>;
  priceRange: { min: string; max: string };
  setPriceRange: Dispatch<SetStateAction<{ min: string; max: string }>>;
  resetFilters: () => void;
}

const CourseSidebar: React.FC<SidebarProps> = ({
  search,
  setSearch,
  setSort,
  setOrder,
  setRating,
  priceRange,
  setPriceRange,
  resetFilters,
}) => {
  return (
    <div className="col-span-12 md:col-span-3 bg-white/5 p-5 rounded-2xl border border-white/10 h-fit">
      <h2 className="text-xl font-semibold mb-4">Filters</h2>

      {/* Search */}
      <div className="mb-6">
        <p className="mb-2 text-sm">Search</p>
        <Input
          placeholder="Search courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-white/10"
        />
      </div>

      {/* Sort */}
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

      {/* Rating */}
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

      {/* Price Range */}
      <div className="mb-6">
        <p className="mb-2 text-sm">Price Range</p>
        <div className="flex gap-2">
          <Input
            placeholder="Min"
            type="number"
            className="bg-white/10"
            value={priceRange.min}
            onChange={(e) =>
              setPriceRange({ ...priceRange, min: e.target.value })
            }
          />
          <Input
            placeholder="Max"
            type="number"
            className="bg-white/10"
            value={priceRange.max}
            onChange={(e) =>
              setPriceRange({ ...priceRange, max: e.target.value })
            }
          />
        </div>
      </div>

      {/* Reset */}
      <Button
        variant="secondary"
        className="mt-4 w-full"
        onClick={resetFilters}
      >
        Reset Filters
      </Button>
    </div>
  );
};

export default CourseSidebar;