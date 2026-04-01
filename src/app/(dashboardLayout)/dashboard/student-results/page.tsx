'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@base-ui/react';

type FormData = {
  className: string;
  student: string;
  examName: string;
  subject: string;
  totalMarks: number;
  obtainedMarks: number;
  examDate: string;
};

const dummyStudents: Record<string, string[]> = {
  'Class 8': ['Rahim', 'Karim', 'Sakib'],
  'Class 9': ['Nusrat', 'Tania'],
  'Class 10': [], // no batch
};

const ExamResultPage = () => {
  const [students, setStudents] = useState<string[]>([]);
  const [percentage, setPercentage] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
  } = useForm<FormData>();

  const total = watch('totalMarks');
  const obtained = watch('obtainedMarks');

  // Handle class change
  const handleClassChange = (value: string) => {
    const list = dummyStudents[value] || [];
    setStudents(list);
    setValue('student', '');
  };

  // Calculate percentage
  React.useEffect(() => {
    if (total && obtained) {
      const percent = (obtained / total) * 100;
      setPercentage(Number(percent.toFixed(2)));
    }
  }, [total, obtained]);

  const onSubmit = (data: FormData) => {
    console.log({ ...data, percentage });
    alert('Result Submitted (Dummy)');
  };

  return (
    <div className="min-h-screen mt-20 flex items-center justify-center bg-[#0b1326] text-white px-6 py-20 relative overflow-hidden">

      {/* Glow background */}
      <div className="absolute top-[-10%] right-[-10%] w-125 h-125 bg-[#adc6ff]/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] w-100 h-100 bg-[#6ffbbe]/20 blur-[100px] rounded-full" />

      <div className="relative z-10 w-full max-w-2xl bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-10 shadow-2xl">

        <h1 className="text-4xl font-black mb-2 tracking-tight">
          Exam Result Entry
        </h1>
        <p className="text-white/70 mb-8">
          শিক্ষক রেজাল্ট ইনপুট করতে পারবেন
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {/* Class */}
          <div>
            <label className="text-sm text-white/70">Class</label>
            <select
              {...register('className')}
              onChange={(e) => handleClassChange(e.target.value)}
              className="w-full mt-2 p-4 rounded-xl bg-white/10 border border-white/20"
            >
              <option value="">Select Class</option>
              <option value="Class 8">Class 8</option>
              <option value="Class 9">Class 9</option>
              <option value="Class 10">Class 10</option>
            </select>
          </div>

          {/* Student */}
          <div>
            <label className="text-sm text-white/70">Student Name</label>
            <select
              {...register('student')}
              className="w-full mt-2 p-4 rounded-xl bg-white/10 border border-white/20"
              disabled={students.length === 0}
            >
              <option value="">
                {students.length === 0
                  ? 'No batch available'
                  : 'Select Student'}
              </option>
              {students.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Exam Name */}
          <div>
            <label className="text-sm text-white/70">Exam Name</label>
            <input
              {...register('examName')}
              className="w-full mt-2 p-4 rounded-xl bg-white/10 border border-white/20"
              placeholder="Mid Term / Final"
            />
          </div>

          {/* Subject */}
          <div>
            <label className="text-sm text-white/70">Subject</label>
            <input
              {...register('subject')}
              className="w-full mt-2 p-4 rounded-xl bg-white/10 border border-white/20"
              placeholder="Math / English"
            />
          </div>

          {/* Marks */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-white/70">Total Marks</label>
              <input
                type="number"
                {...register('totalMarks')}
                className="w-full mt-2 p-4 rounded-xl bg-white/10 border border-white/20"
              />
            </div>

            <div>
              <label className="text-sm text-white/70">Obtained Marks</label>
              <input
                type="number"
                {...register('obtainedMarks')}
                className="w-full mt-2 p-4 rounded-xl bg-white/10 border border-white/20"
              />
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="text-sm text-white/70">Exam Date</label>
            <input
              type="date"
              {...register('examDate')}
              className="w-full mt-2 p-4 rounded-xl bg-white/10 border border-white/20"
            />
          </div>

          {/* Percentage */}
          <div>
            <label className="text-sm text-white/70">Percentage</label>
            <input
              value={percentage !== null ? `${percentage}%` : ''}
              readOnly
              className="w-full mt-2 p-4 rounded-xl bg-white/20 border border-white/20"
            />
          </div>

          <Button
            type="submit"
            className="bg-[#adc6ff] text-[#002e6a] font-semibold px-5 py-3 rounded-xl w-full"
          >
            Submit Result
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ExamResultPage;