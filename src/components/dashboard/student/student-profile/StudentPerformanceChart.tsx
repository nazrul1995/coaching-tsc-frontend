'use client';

import React from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { BarChart3 } from 'lucide-react';

export interface PerformanceDataItem {
  name: string;
  percentage: number;
  marks: number;
  totalMarks: number;
  date?: string;
}

interface StudentPerformanceChartProps {
  data: PerformanceDataItem[];
}

export default function StudentPerformanceChart({
  data,
}: StudentPerformanceChartProps) {
  return (
    <section className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-5 sm:p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-black text-white">
            Performance Progress
          </h2>

          <p className="mt-1 text-[10px] text-white/30">
            Percentage trend across published exams
          </p>
        </div>

        <BarChart3 className="h-5 w-5 text-[#6ffbbe]" />
      </div>

      <div className="h-[300px]">
        {data.length ? (
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <AreaChart data={data}>
              <defs>
                <linearGradient
                  id="studentPerformanceGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="#6ffbbe"
                    stopOpacity={0.3}
                  />

                  <stop
                    offset="100%"
                    stopColor="#6ffbbe"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.05)"
              />

              <XAxis
                dataKey="name"
                tick={{
                  fill: 'rgba(255,255,255,0.35)',
                  fontSize: 10,
                }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                domain={[0, 100]}
                tick={{
                  fill: 'rgba(255,255,255,0.35)',
                  fontSize: 10,
                }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                contentStyle={{
                  background: '#0b1326',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 12,
                  color: '#fff',
                }}
                formatter={(value: any) => [
                  `${value}%`,
                  'Score',
                ]}
              />

              <Area
                type="monotone"
                dataKey="percentage"
                stroke="#6ffbbe"
                strokeWidth={3}
                fill="url(#studentPerformanceGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <EmptyChart text="No exam performance data available" />
        )}
      </div>
    </section>
  );
}

function EmptyChart({
  text,
}: {
  text: string;
}) {
  return (
    <div className="flex h-full items-center justify-center text-xs text-white/25">
      {text}
    </div>
  );
}
