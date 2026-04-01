'use client';

import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import Image from "next/image";
import axiosSecure from "@/lib/axiosSecure";
import Swal from "sweetalert2";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import StudentForm from "@/components/dashboard/form/studentform";
import TeacherForm from "@/components/dashboard/form/teacherform";

type StatusType = "none" | "pending" | "approved" | "rejected";

const ProfilePage = () => {
  const { user } = useAuth();

  const [open, setOpen] = useState(false);
  const [roleType, setRoleType] = useState<"student" | "teacher">("student");
  const [status, setStatus] = useState<StatusType>("none");

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    className: "",
    batch: "",
    subject: "",
    experience: "",
    profilePic: null as File | null,
  });

  const [preview, setPreview] = useState<string | null>(null);

  const handleSubmit = async () => {
    try {
      const data = new FormData();

      data.append("roleType", roleType);
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("phone", formData.phone);

      if (roleType === "student") {
        data.append("className", formData.className);
        if (formData.batch) data.append("batch", formData.batch);
      }

      if (roleType === "teacher") {
        data.append("subject", formData.subject);
        data.append("experience", formData.experience);
      }

      if (formData.profilePic) {
        data.append("profilePic", formData.profilePic);
      }

      await axiosSecure.post("/applications", data);

      setStatus("pending");

      Swal.fire({
        icon: "success",
        title: "Application Submitted 🎉",
        text: "Waiting for admin approval",
      });

      setOpen(false);
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: err.response?.data?.message || "Something went wrong",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1326] text-white px-6 py-10">

      <div className="max-w-5xl mx-auto space-y-8">

        {/* PROFILE */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-6">
          <Image
            src={user?.image || "/default-avatar.png"}
            alt="profile"
            width={100}
            height={100}
            className="rounded-full"
          />

          <div>
            <h2 className="text-2xl font-bold">{user?.name}</h2>
            <p className="text-white/70">{user?.email}</p>
          </div>

          <button
            onClick={() => setOpen(true)}
            className="md:ml-auto bg-[#adc6ff] text-black px-5 py-2 rounded-xl"
          >
            Apply
          </button>
        </div>

        {/* STATUS */}
        {status !== "none" && (
          <div className="text-center">
            <span className="px-4 py-2 bg-yellow-500/20 rounded-full">
              ⏳ Pending
            </span>
          </div>
        )}
      </div>

      {/* MODAL */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-[#0b1326] text-white rounded-3xl p-8">

          <DialogHeader>
            <DialogTitle>Application Form</DialogTitle>
          </DialogHeader>

          {/* Toggle */}
          <div className="flex bg-white/10 rounded-xl p-1">
            <button onClick={() => setRoleType("student")} className="flex-1">
              Student
            </button>
            <button onClick={() => setRoleType("teacher")} className="flex-1">
              Teacher
            </button>
          </div>

          {/* Dynamic Form */}
          {roleType === "student" ? (
            <StudentForm
              formData={formData}
              setFormData={setFormData}
              preview={preview}
              setPreview={setPreview}
            />
          ) : (
            <TeacherForm
              formData={formData}
              setFormData={setFormData}
              preview={preview}
              setPreview={setPreview}
            />
          )}

          <DialogFooter>
            <button onClick={handleSubmit}>Submit</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <style jsx>{`
        .input {
          width: 100%;
          padding: 14px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;