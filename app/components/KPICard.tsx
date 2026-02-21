'use client';

import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: number;
  trendLabel?: string;
  bgColor?: string;
}

export default function KPICard({
  title,
  value,
  icon,
  trend,
  trendLabel = 'vs last month',
  bgColor = 'bg-blue-50',
}: KPICardProps) {
  const isPositive = trend !== undefined && trend > 0;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-md hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`h-12 w-12 rounded-lg ${bgColor} flex items-center justify-center`}>
          {icon}
        </div>
      </div>

      {/* Trend */}
      {trend !== undefined && (
        <div className="mt-4 flex items-center gap-2">
          <div className={`flex items-center gap-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
            <span className="text-sm font-semibold">{Math.abs(trend)}%</span>
          </div>
          <span className="text-sm text-gray-500">{trendLabel}</span>
        </div>
      )}
    </div>
  );
}
