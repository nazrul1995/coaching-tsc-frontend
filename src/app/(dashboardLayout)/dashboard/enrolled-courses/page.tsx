'use client';
import { useAuth } from "@/context/AuthContext";
import axiosSecure from "@/lib/axiosSecure";
import { useEffect, useState } from "react";

type TEnrolledCourse = {
  _id: string;
  courseTitle: string;
  price: number;
  status: string;
  createdAt: string;
};

const EnrolledCourses = () => {
  const [courses, setCourses] = useState<TEnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axiosSecure.get(`/enroll/enrolled?userEmail=${user?.email}`);
        setCourses(res.data.data || []);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load courses");
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) fetchCourses();
  }, [user?.email]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this course?")) return;

    try {
      setDeletingId(id);
      await axiosSecure.delete(`/enroll/enrolled/${id}`);
      setCourses(prev => prev.filter(c => c._id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || "Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return <p className="text-center text-gray-400 py-10">Loading courses...</p>;
  }

  if (error) {
    return <p className="text-center text-red-400 py-10">{error}</p>;
  }

  return (
    <div className="p-4 md:p-8">
      <h2 className="text-2xl font-bold text-white mb-6">
        My Enrolled Courses
      </h2>

      {courses.length === 0 ? (
        <p className="text-gray-400">No enrolled courses found.</p>
      ) : (
        <>
          {/* ================= DESKTOP TABLE ================= */}
          <div className="hidden lg:block">
            <table className="min-w-full bg-gray-800 text-white rounded-xl overflow-hidden">
              <thead className="bg-gray-700 text-gray-300">
                <tr>
                  <th className="py-3 px-4 text-left">Title</th>
                  <th className="py-3 px-4 text-left">Price</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">Enrolled Date</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {courses.map(course => (
                  <tr
                    key={course._id}
                    className="border-b border-gray-700 hover:bg-gray-700/40 transition"
                  >
                    <td className="py-3 px-4">{course.courseTitle}</td>

                    <td className="py-3 px-4">${course.price}</td>

                    <td
                      className={`py-3 px-4 font-medium ${
                        course.status === "paid"
                          ? "text-green-400"
                          : "text-yellow-400"
                      }`}
                    >
                      {course.status}
                    </td>

                    <td className="py-3 px-4 text-sm text-gray-400">
                      {new Date(course.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleDelete(course._id)}
                        disabled={deletingId === course._id}
                        className="bg-red-500 hover:bg-red-600 disabled:bg-gray-600 px-4 py-1 rounded-md text-sm"
                      >
                        {deletingId === course._id ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ================= MOBILE CARDS ================= */}
          <div className="grid grid-cols-1 gap-4 lg:hidden">
            {courses.map(course => (
              <div
                key={course._id}
                className="bg-gray-800 p-4 rounded-xl shadow-md text-white"
              >
                <h3 className="text-lg font-semibold mb-2">
                  {course.courseTitle}
                </h3>

                <p className="text-sm text-gray-300 mb-1">
                  💰 Price: ${course.price}
                </p>

                <p
                  className={`text-sm mb-1 ${
                    course.status === "paid"
                      ? "text-green-400"
                      : "text-yellow-400"
                  }`}
                >
                  Status: {course.status}
                </p>

                <p className="text-xs text-gray-500 mb-3">
                  {new Date(course.createdAt).toLocaleDateString()}
                </p>

                <button
                  onClick={() => handleDelete(course._id)}
                  disabled={deletingId === course._id}
                  className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-600 py-2 rounded-md"
                >
                  {deletingId === course._id ? "Deleting..." : "Delete"}
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default EnrolledCourses;