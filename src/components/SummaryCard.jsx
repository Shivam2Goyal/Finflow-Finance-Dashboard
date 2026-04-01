import { TrendingUp, TrendingDown } from 'lucide-react';

const formatINR = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

export default function SummaryCard({ title, value, icon: Icon, color, trend, trendLabel, isCurrency = true, suffix = '' }) {
  const isPositive = trend >= 0;

  return (
    <div className="bg-white dark:bg-ink-900 rounded-2xl border border-ink-100 dark:border-ink-800 p-5 hover:shadow-md transition-all duration-200 animate-fade-up opacity-0" style={{ animationFillMode: 'forwards' }}>
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-medium text-ink-400 dark:text-ink-500 uppercase tracking-wider">{title}</span>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={17} />
        </div>
      </div>

      <div className="mb-2">
        <span className="font-display font-bold text-2xl text-ink-900 dark:text-ink-100 tabular-nums">
          {isCurrency ? formatINR(value) : `${value}${suffix}`}
        </span>
      </div>

      {trend !== undefined && (
        <div className={`flex items-center gap-1 text-xs font-medium ${isPositive ? 'text-jade-500' : 'text-ruby-500'}`}>
          {isPositive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
          <span>{isPositive ? '+' : ''}{trend}% {trendLabel}</span>
        </div>
      )}
    </div>
  );
}
