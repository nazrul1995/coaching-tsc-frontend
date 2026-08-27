'use client';

import React from 'react';
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

interface AttendanceDataItem {
  name: string;
  value: number;
}

interface StudentAttendanceChartProps {
  data: AttendanceDataItem[];
  totalExams: number;
}

export default function StudentAttendanceChart({
  data,
  totalExams,
}: StudentAttendanceChartProps) {
  const participated =
    data.find((item) => item.name === 'Participated')
      ?.value ?? 0;

  const absent =
    data.find((item) => item.name === 'Absent')
      ?.value ?? 0;

  return (
    <section className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-5 sm:p-6">
      <div className="mb-4">
        <h2 className="text-sm font-black text-white">
          Exam Participation
        </h2>

        <p className="mt-1 text-[10px] text-white/30">
          Published exam attendance
        </p>
      </div>

      <div className="h-[230px]">
        {totalExams > 0 ? (
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={65}
                outerRadius={90}
                paddingAngle={4}
              >
                <Cell fill="#6ffbbe" />
                <Cell fill="#fb7185" />
              </Pie>

              <Tooltip
                contentStyle={{
                  background: '#0b1326',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 12,
                  color: '#fff',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-white/25">
            No exam data
          </div>
        )}
      </div>

      <div className="flex justify-center gap-6">
        <LegendItem
          label="Participated"
          value={participated}
        />

        <LegendItem
          label="Absent"
          value={absent}
        />
      </div>
    </section>
  );
}

function LegendItem({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="text-center">
      <p className="text-lg font-black text-white">
        {value}
      </p>

      <p className="text-[9px] text-white/30">
        {label}
      </p>
    </div>
  );
}
