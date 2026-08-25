'use client';

import React from 'react';
import { StatusBadge } from '../../common';

export default function PaymentStatusBadge({
  status,
}: {
  status?: string;
}) {
  return (
    <StatusBadge status={status || 'unpaid'} />
  );
}
