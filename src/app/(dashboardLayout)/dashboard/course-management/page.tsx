'use client';
import { useAuth } from "@/context/AuthContext";
import axiosSecure from "@/lib/axiosSecure";
import { useEffect, useState } from "react";

const MyCoursesPage = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const [courseError, setCourseError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        console.log("Fetching my courses for user:", user?.email);

        // Backend extracts email from JWT token, no need to send it in query params
        const response = await axiosSecure.get("/courses/my-courses");

        console.log("Full Axios response:", response);
        console.log("Response data:", response.data);
        console.log("Courses array (response.data.data):", response.data.data);

        setCourses(response.data.data || []);
        setCourseError(null);
      } catch (err:any) {
        console.error("Failed to fetch courses:", err.response || err.message);
        setCourseError(err.response?.data?.message || "Failed to load courses. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) {
      fetchCourses();
    } else {
      setLoading(false);
    }
  }, [user?.email]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-white/70">Loading your courses...</p>
      </div>
    );
  }

  if (courseError) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
        <p className="text-red-400">
          <strong>Error:</strong> {courseError}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#adc6ff] mb-2">My Courses</h1>
        <p className="text-white/70">Manage and track all your created courses</p>
      </div>

      {courses.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors"
            >
              {course.thumbnail && (
                <div className="mb-4 h-32 bg-white/5 rounded overflow-hidden">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <h3 className="font-bold text-white mb-2 line-clamp-2">{course.title}</h3>
              <p className="text-white/70 text-sm mb-3 line-clamp-2">{course.description}</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/60">Duration:</span>
                  <span className="text-[#adc6ff]">{course.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Price:</span>
                  <span className="text-[#6ffbbe] font-semibold">${course.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Enrolled:</span>
                  <span className="text-white">{course.enrolledStudents || 0}</span>
                </div>
                {course.rating && (
                  <div className="flex justify-between">
                    <span className="text-white/60">Rating:</span>
                    <span className="text-yellow-400">⭐ {course.rating}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-lg p-8 text-center">
          <p className="text-white/70 mb-4">No courses created yet.</p>
          <button className="px-6 py-2 bg-[#adc6ff] text-[#002e6a] font-semibold rounded-lg hover:bg-[#adc6ff]/90 transition-colors">
            Create Your First Course
          </button>
        </div>
      )}
    </div>
  );
};

export default MyCoursesPage;