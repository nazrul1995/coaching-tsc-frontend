'use client';
import { useAuth } from "@/context/AuthContext";
import axiosSecure from "@/lib/axiosSecure";
import { TCourse } from "@/types/course";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const MyCoursesPage = () => {
  const [courses, setCourses] = useState<TCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [courseError, setCourseError] = useState<string | null>(null);
  const { user } = useAuth();

  const [selectedCourse, setSelectedCourse] = useState<TCourse | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [updateData, setUpdateData] = useState({ title: "", price: 0, duration: "", description: "" });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axiosSecure.get("/courses/my-courses");
        setCourses(response.data.data || []);
        setCourseError(null);
      } catch (err: any) {
        console.error(err);
        setCourseError(err.response?.data?.message || "Failed to load courses.");
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) fetchCourses();
    else setLoading(false);
  }, [user?.email]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this course?")) return;
    try {
      await axiosSecure.delete(`/courses/${id}`);
      setCourses(courses.filter(c => c._id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete course.");
    }
  };

  const openUpdateModal = (course: TCourse) => {
    setSelectedCourse(course);
    setUpdateData({
      title: course.title,
      price: course.price,
      duration: course.duration,
      description: course.description,
    });
    setModalOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedCourse) return;

    try {
      const response = await axiosSecure.put(`/courses/${selectedCourse._id}`, updateData);
      setCourses(courses.map(c => (c._id === selectedCourse._id ? response.data.data : c)));
      setModalOpen(false);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update course.");
    }
  };

  if (loading) return <p className="text-white/70 text-center py-12">Loading your courses...</p>;
  if (courseError) return (
    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
      <p className="text-red-400"><strong>Error:</strong> {courseError}</p>
    </div>
  );

  return (
    <div className="p-4">
      {/* Large screens table */}
      <div className="hidden lg:block">
        <table className="min-w-full bg-gray-800 text-white rounded-lg overflow-hidden">
          <thead className="bg-gray-700">
            <tr>
              <th className="py-2 px-4">Title</th>
              <th className="py-2 px-4">Price</th>
              <th className="py-2 px-4">Duration</th>
              <th className="py-2 px-4">Enrolled Students</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map(course => (
              <tr key={course._id} className="border-b border-gray-600">
                <td className="py-2 px-4">{course.title}</td>
                <td className="py-2 px-4">${course.price}</td>
                <td className="py-2 px-4">{course.duration}</td>
                <td className="py-2 px-4">{course.enrolledStudents}</td>
                <td className="py-2 px-4 space-x-2">
                  <button 
                    onClick={() => openUpdateModal(course)} 
                    className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded"
                  >
                    Update
                  </button>
                  <button 
                    onClick={() => handleDelete(course._id)} 
                    className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="lg:hidden grid grid-cols-1 gap-4">
        {courses.map(course => (
          <div key={course._id} className="bg-gray-800 p-4 rounded-lg text-white shadow-md">
            <img src={course.thumbnail} alt={course.title} className="w-full h-40 object-cover rounded-md mb-2" />
            <h3 className="text-lg font-bold">{course.title}</h3>
            <p className="text-sm mb-1">${course.price} • {course.duration}</p>
            <p className="text-sm mb-2">Enrolled: {course.enrolledStudents}</p>
            <div className="flex gap-2">
              <button 
                onClick={() => openUpdateModal(course)} 
                className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded flex-1"
              >
                Update
              </button>
              <button 
                onClick={() => handleDelete(course._id)} 
                className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded flex-1"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Update Modal */}
<Dialog open={modalOpen} onOpenChange={setModalOpen}>
  <DialogContent className="sm:max-w-lg w-full bg-gray-900 text-white">
    <DialogHeader>
      <DialogTitle>Update Course</DialogTitle>
    </DialogHeader>

    <div className="flex flex-col gap-3 mt-2">
      <Input 
        placeholder="Title" 
        value={updateData.title}
        onChange={e => setUpdateData({...updateData, title: e.target.value})}
      />
      <Input 
        type="number"
        placeholder="Price"
        value={updateData.price}
        onChange={e => setUpdateData({...updateData, price: Number(e.target.value)})}
      />
      <Input 
        placeholder="Duration"
        value={updateData.duration}
        onChange={e => setUpdateData({...updateData, duration: e.target.value})}
      />
      <textarea 
        placeholder="Description"
        value={updateData.description}
        onChange={e => setUpdateData({...updateData, description: e.target.value})}
      />
    </div>

    <DialogFooter className="mt-4 flex justify-end gap-2">
      <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
      <Button onClick={handleUpdate}>Save</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
    </div>
  );
};

export default MyCoursesPage;