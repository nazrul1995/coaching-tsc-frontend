import {
  Award,
  GraduationCap,
  Trophy,
  Users,
} from 'lucide-react';
import RankCard from './RankCard';
import { Ranking } from '@/types/student';


interface Props {
  ranking: Ranking;
}

export default function StudentRanking({
  ranking,
}: Props) {
  return (
    <section className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-5 sm:p-6">

      <div className="mb-5">
        <h2 className="text-sm font-black">
          Student Ranking
        </h2>

        <p className="mt-1 text-[10px] text-white/30">
          Current ranking based on published exam performance
        </p>
      </div>

      {ranking.hasRanking ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <RankCard
            title="Group Rank"
            icon={Users}
            {...ranking.group}
          />

          <RankCard
            title="Batch Rank"
            icon={Trophy}
            {...ranking.batch}
          />

          <RankCard
            title="Class Rank"
            icon={GraduationCap}
            {...ranking.class}
          />

          <RankCard
            title="Coaching Rank"
            icon={Award}
            {...ranking.coaching}
          />

        </div>
      ) : (
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-8 text-center text-sm text-white/30">
          Ranking is not available yet.
        </div>
      )}

    </section>
  );
}
