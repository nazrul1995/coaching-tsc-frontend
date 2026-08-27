import { Result } from "@/types/student";
import StudentResultsTable from "./StudentResultTable";


interface Props {
  results: Result[];
}

export default function StudentResults({
  results,
}: Props) {
  return (
    <section className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-5">

      <div className="mb-6">
        <h2 className="text-lg font-black">
          Examination Results
        </h2>

        <p className="mt-1 text-xs text-white/30">
          Complete published examination history
        </p>
      </div>

      <StudentResultsTable results={results} />

    </section>
  );
}
