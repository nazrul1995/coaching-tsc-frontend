"use client";

import React, { useState } from "react";
import { TCourse } from "@/types/course";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Swal from "sweetalert2";
import axiosSecure from "@/lib/axiosSecure";

interface EnrollButtonProps {
  course: TCourse;
}

const EnrollButton: React.FC<EnrollButtonProps> = ({ course }) => {
  const { user } = useAuth();
  const router = useRouter();
  const path = usePathname();

  const [loading, setLoading] = useState(false);
console.log(course);
  const handleEnroll = async () => {
    if (!user) {
      return router.push(`/login?callbackUrl=${path}`);
    }

    // 🔥 Confirmation popup
    const result = await Swal.fire({
      title: "Confirm Enrollment",
      text: `Do you want to enroll in "${course.title}"?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#22c55e",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Yes, Enroll",
    });

    if (!result.isConfirmed) return;

    try {
      setLoading(true);

      const res = await axiosSecure.post("/enroll", {
        userEmail: user.email,
        userName: user.name,
        creatorEmail: course.creatorEmail,
        courseId: course._id,
      });

      // ✅ Success popup
      Swal.fire({
        icon: "success",
        title: "Enrolled!",
        text: res.data.message,
        timer: 2000,
        showConfirmButton: false,
      });

    } catch (error: any) {
      // ❌ Error popup
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error?.response?.data?.message || "Enrollment failed",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleEnroll}
      disabled={loading}
      className={`px-5 py-2 rounded-lg font-semibold transition-all duration-200 
      ${
        loading
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-green-500 hover:bg-green-600 active:scale-95"
      } text-white shadow-md`}
    >
      {loading ? "Enrolling..." : "Enroll Now"}
    </button>
  );
};

export default EnrollButton;