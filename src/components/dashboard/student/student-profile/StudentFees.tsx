import { StatCard } from '@/components/common/state-card';
import { FeeHistory, FeeSummary } from '@/types/student';
import {
    CheckCircle2,
    Clock3,
    CreditCard,
    Wallet,
} from 'lucide-react';
import { DashboardStatCard } from '../../common';
import StudentFeeTable from './StudentFeeTable';


interface Props {
    feeSummary: FeeSummary;
    feeHistory: FeeHistory[];
}

export default function StudentFees({
    feeSummary,
    feeHistory,
}: Props) {
    return (
        <div className="space-y-6">

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <DashboardStatCard
                    title="Monthly Fee"
                    value={`৳${feeSummary.monthlyFee}`}
                    subtitle="Current monthly fee"
                    icon={CreditCard}
                    accent="blue"
                />

                <DashboardStatCard
                    title="Total Paid"
                    value={`৳${feeSummary.totalPaidAmount}`}
                    subtitle={`${feeSummary.paidCycles} paid cycles`}
                    icon={CheckCircle2}
                    accent="green"
                />

                <DashboardStatCard
                    title="Outstanding"
                    value={`৳${feeSummary.totalOutstanding}`}
                    subtitle="Total due amount"
                    icon={Wallet}
                    accent="rose"
                />

                <DashboardStatCard
                    title="Total Fee"
                    value={`৳${feeSummary.totalFeeAmount}`}
                    subtitle={`${feeSummary.unpaidCycles} unpaid cycles`}
                    icon={Clock3}
                    accent="amber"
                />
            </div>


            <section className="overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.025]">

                <div className="border-b border-white/10 p-5">
                    <h2 className="text-sm font-black">
                        Fee Payment History
                    </h2>

                    <p className="mt-1 text-[10px] text-white/30">
                        Monthly fee cycle and payment status
                    </p>
                </div>

                <StudentFeeTable fees={feeHistory} />

            </section>

        </div>
    );
}
