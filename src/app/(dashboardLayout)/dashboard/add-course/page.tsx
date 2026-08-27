'use client';

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axiosSecure from "@/lib/axiosSecure";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Image from "next/image";

interface AddCourseFormValues {
  title: string;
  description: string;
  price: number;
  duration: string;
  thumbnail: string;
  totalModules: number;
}

const AddCoursePage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<AddCourseFormValues>();

  const onSubmit = async (data: AddCourseFormValues) => {
    if (!user) {
      alert("You must be logged in to create a course.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        ...data,
        creatorEmail: user.email,
        creatorRole: user.role || "teacher", // default role
      };

      const response = await axiosSecure.post("/courses", payload);

      if (response.data.success) {
        alert("Course created successfully!");
        reset();
        router.push("/dashboard/course-management"); // redirect to course list
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to create course.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-900 rounded-lg text-white shadow-md">
      <h1 className="text-2xl font-bold mb-6">Add New Course</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

        <div>
          <Label htmlFor="title">Course Title</Label>
          <Input 
            id="title"
            {...register("title", { required: "Title is required" })}
            placeholder="Enter course title"
          />
          {errors.title && <p className="text-red-400 text-sm">{errors.title.message}</p>}
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea 
            id="description"
            {...register("description", { required: "Description is required" })}
            placeholder="Course description"
          />
          {errors.description && <p className="text-red-400 text-sm">{errors.description.message}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="price">Price ($)</Label>
            <Input 
              type="number"
              id="price"
              {...register("price", { required: "Price is required", min: 0 })}
              placeholder="Price in USD"
            />
            {errors.price && <p className="text-red-400 text-sm">{errors.price.message}</p>}
          </div>

          <div>
            <Label htmlFor="duration">Duration</Label>
            <Input 
              id="duration"
              {...register("duration", { required: "Duration is required" })}
              placeholder="E.g., 5 months"
            />
            {errors.duration && <p className="text-red-400 text-sm">{errors.duration.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="totalModules">Total Modules</Label>
            <Input 
              type="number"
              id="totalModules"
              {...register("totalModules", { required: "Total modules is required", min: 1 })}
              placeholder="Total modules in course"
            />
            {errors.totalModules && <p className="text-red-400 text-sm">{errors.totalModules.message}</p>}
          </div>

          <div>
            <Label htmlFor="thumbnail">Thumbnail URL</Label>
            <Input 
              id="thumbnail"
              {...register("thumbnail", { required: "Thumbnail URL is required" })}
              placeholder="https://example.com/image.jpg"
            />
            {errors.thumbnail && <p className="text-red-400 text-sm">{errors.thumbnail.message}</p>}
          </div>
        </div>

        {/* Preview thumbnail */}
        <div>
          {watch("thumbnail") && (
            <Image width={200}
             height={200} src={watch("thumbnail")} alt="Thumbnail preview" className="w-full h-40 object-cover rounded mt-2" />
          )}
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Course"}
        </Button>
      </form>
    </div>
  );
};

export default AddCoursePage;