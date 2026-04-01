'use client';

import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import Image from "next/image";

const ApplyPage = () => {
  const { user } = useAuth();

  const [roleType, setRoleType] = useState<"student" | "teacher">("student");

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

  const isStudentClass = ["9", "10", "11", "12"].includes(formData.className);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 🔥 DEBUG HERE
    console.log("ROLE:", roleType);
    console.log("FORM DATA:", formData);

    alert("Check console 🔍");
  };

  return (
    <div className="min-h-screen bg-[#0b1326] text-white px-6 py-10">

      <div className="max-w-2xl mx-auto bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8">

        <h1 className="text-3xl font-bold mb-6">Apply Form</h1>

        {/* TOGGLE */}
        <div className="flex bg-white/10 rounded-xl p-1 mb-6">
          <button
            onClick={() => setRoleType("student")}
            className={`flex-1 py-2 rounded-lg ${
              roleType === "student"
                ? "bg-[#6ffbbe] text-black font-semibold"
                : "text-white/70"
            }`}
          >
            Student
          </button>

          <button
            onClick={() => setRoleType("teacher")}
            className={`flex-1 py-2 rounded-lg ${
              roleType === "teacher"
                ? "bg-[#adc6ff] text-[#002e6a] font-semibold"
                : "text-white/70"
            }`}
          >
            Teacher
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* STUDENT FORM */}
          {roleType === "student" && (
            <>
              <input
                placeholder="Student Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="input"
              />

              <input value={formData.email} disabled className="input opacity-70" />

              <input
                placeholder="Guardian Phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="input"
              />

              <select
                value={formData.className}
                onChange={(e) =>
                  setFormData({ ...formData, className: e.target.value })
                }
                className="input"
              >
                <option value="">Select Class</option>
                {[...Array(12)].map((_, i) => (
                  <option key={i} value={String(i + 1)}>
                    Class {i + 1}
                  </option>
                ))}
              </select>

              {isStudentClass && (
                <input
                  placeholder="Batch"
                  value={formData.batch}
                  onChange={(e) =>
                    setFormData({ ...formData, batch: e.target.value })
                  }
                  className="input"
                />
              )}
            </>
          )}

          {/* TEACHER FORM */}
          {roleType === "teacher" && (
            <>
              <input
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="input"
              />

              <input value={formData.email} disabled className="input opacity-70" />

              <input
                placeholder="Phone Number"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="input"
              />

              <input
                placeholder="Subject"
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
                className="input"
              />

              <input
                placeholder="Experience (years)"
                value={formData.experience}
                onChange={(e) =>
                  setFormData({ ...formData, experience: e.target.value })
                }
                className="input"
              />
            </>
          )}

          {/* IMAGE */}
          <div>
            <input
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setFormData({ ...formData, profilePic: file });
                  setPreview(URL.createObjectURL(file));
                }
              }}
            />

            {preview && (
              <Image
                src={preview}
                alt="preview"
                width={100}
                height={100}
                className="mt-3 rounded-xl"
              />
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-[#adc6ff] text-black py-3 rounded-xl font-semibold"
          >
            Submit
          </button>
        </form>
      </div>

      <style jsx>{`
        .input {
          width: 100%;
          padding: 14px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          outline: none;
        }
      `}</style>
    </div>
  );
};

export default ApplyPage;