'use client';

import React from 'react';
import {
  AlertCircle,
  Calendar,
  DollarSign,
  Wallet,
} from 'lucide-react';
import { formatMoney } from './payment.helpers';
import { DashboardStatCard } from '../../common';

interface Props {
  totalCollected: number;
  totalPending: number;
  overdueCount: number;
  activeCycles: number;
}

export default function PaymentStats({
  totalCollected,
  totalPending,
  overdueCount,
  activeCycles,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <DashboardStatCard
        title="Total Collected"
        value={formatMoney(totalCollected)}
        subtitle="Successfully collected"
        icon={DollarSign}
        accent="green"
      />

      <DashboardStatCard
        title="Pending Balance"
        value={formatMoney(totalPending)}
        subtitle="Awaiting collection"
        icon={Wallet}
        accent="amber"
      />

      <DashboardStatCard
        title="Overdue Accounts"
        value={overdueCount}
        subtitle="Requires attention"
        icon={AlertCircle}
        accent="rose"
      />

      <DashboardStatCard
        title="Active Cycles"
        value={activeCycles}
        subtitle="Current fee records"
        icon={Calendar}
        accent="blue"
      />
    </div>
  );
}
