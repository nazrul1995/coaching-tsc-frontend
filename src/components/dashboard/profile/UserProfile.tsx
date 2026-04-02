'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useMutation } from "@tanstack/react-query";
import Swal from "sweetalert2";
import axiosSecure from "@/lib/axiosSecure";
import { uploadImageToImgBB } from "@/lib/imgUpload";

export const UserProfile = ({ user }: any) => {
  const [studentOpen, setStudentOpen] = useState(false);
  const [teacherOpen, setTeacherOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<any>();

  const selectedClass = watch("className");

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const mutation = useMutation({
    mutationFn: (data: any) => axiosSecure.post("/students", data),
    onSuccess: () => {
      Swal.fire("Success", "Application submitted", "success");
      reset();
      setStudentOpen(false);
    },
  });

  const onSubmit = async (data: any) => {
    let photoUrl = "";

    if (data.photo) {
      photoUrl = await uploadImageToImgBB(data.photo);
    }

    mutation.mutate({ ...data, photo: photoUrl });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">

      {/* PROFILE CARD */}
      <div className="bg-white/5 p-8 rounded-3xl flex gap-6 items-center">
        <Image src={user?.image || "/default-avatar.png"} width={100} height={100} alt="profile" className="rounded-full" />
        <div className="flex-1">
          <h2 className="text-2xl font-bold">{user?.name}</h2>
          <p className="text-white/60">{user?.email}</p>
        </div>

        <div className="flex gap-2">
          <button onClick={() => setStudentOpen(true)} className="btn">Apply Student</button>
          <button onClick={() => setTeacherOpen(true)} className="btn">Apply Teacher</button>
        </div>
      </div>

      {/* STUDENT MODAL */}
      <Dialog open={studentOpen} onOpenChange={setStudentOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Student Application</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <input {...register("name")} placeholder="Name" className="input" />
            <input {...register("email")} placeholder="Email" className="input" />

            <select {...register("className")} className="input">
              {[...Array(12)].map((_, i) => (
                <option key={i}>{i + 1}</option>
              ))}
            </select>

            {Number(selectedClass) >= 9 && (
              <>
                <input {...register("batch")} placeholder="Batch" className="input" />
                <input {...register("group")} placeholder="Group" className="input" />
              </>
            )}

            <input
              type="file"
              onChange={(e) => {
                if (e.target.files) {
                  setValue("photo", e.target.files[0]);
                  setPreview(URL.createObjectURL(e.target.files[0]));
                }
              }}
            />

            <button className="btn w-full">Submit</button>
          </form>
        </DialogContent>
      </Dialog>

      {/* TEACHER MODAL */}
      <Dialog open={teacherOpen} onOpenChange={setTeacherOpen}>
        <DialogContent>
          <DialogTitle>Coming soon</DialogTitle>
        </DialogContent>
      </Dialog>
    </div>
  );
};