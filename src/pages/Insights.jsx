import { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar
} from 'recharts';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { useStore } from '../store/useStore';
import { CATEGORIES } from '../data/mockData';

const formatINR = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-ink-800 border border-ink-100 dark:border-ink-700 rounded-xl shadow-lg p-3 text-xs">
      <p className="font-semibold text-ink-700 dark:text-ink-300 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }} className="flex justify-between gap-4">
          <span className="capitalize">{p.name}</span>
          <span className="font-mono font-medium">{formatINR(p.value)}</span>
        </p>
      ))}
    </div>
  );
};

export default function Insights() {
  const { transactions, monthlyData } = useStore();

  const insights = useMemo(() => {
    const now = new Date();
    const thisMonth = transactions.filter((t) => {
      const d = new Date(t.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
    const lastMonth = transactions.filter((t) => {
      const d = new Date(t.date);
      const lm = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      return d.getMonth() === lm.getMonth() && d.getFullYear() === lm.getFullYear();
    });

    // Category breakdown
    const catMap = {};
    transactions.forEach((t) => {
      if (t.type === 'expense') catMap[t.category] = (catMap[t.category] || 0) + t.amount;
    });
    const sortedCats = Object.entries(catMap).sort((a, b) => b[1] - a[1]);
    const topCategory = sortedCats[0];

    // This vs last month
    const thisExpenses = thisMonth.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const lastExpenses = lastMonth.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const thisIncome = thisMonth.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const lastIncome = lastMonth.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);

    const expenseChange = lastExpenses > 0 ? Math.round(((thisExpenses - lastExpenses) / lastExpenses) * 100) : 0;
    const incomeChange = lastIncome > 0 ? Math.round(((thisIncome - lastIncome) / lastIncome) * 100) : 0;

    // Avg daily spend
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const avgDaily = Math.round(thisExpenses / now.getDate());

    // Radar data - current month spending vs avg
    const radarData = sortedCats.slice(0, 6).map(([name, value]) => ({ name, value: Math.round(value / 1000) }));

    return { topCategory, thisExpenses, lastExpenses, thisIncome, lastIncome, expenseChange, incomeChange, avgDaily, radarData, sortedCats };
  }, [transactions]);

  const observations = [
    {
      icon: insights.expenseChange > 0 ? AlertCircle : CheckCircle,
      color: insights.expenseChange > 0 ? 'text-ruby-500' : 'text-jade-500',
      bg: insights.expenseChange > 0 ? 'bg-ruby-50 dark:bg-ruby-500/10' : 'bg-jade-50 dark:bg-jade-500/10',
      title: insights.expenseChange > 0 ? 'Spending increased' : 'Spending decreased',
      desc: `Your expenses ${insights.expenseChange > 0 ? 'increased' : 'decreased'} by ${Math.abs(insights.expenseChange)}% compared to last month.`,
    },
    {
      icon: insights.topCategory ? Info : Info,
      color: 'text-gold-500',
      bg: 'bg-gold-50 dark:bg-gold-500/10',
      title: `Top spend: ${insights.topCategory?.[0] || 'N/A'}`,
      desc: `${insights.topCategory?.[0]} accounts for ${formatINR(insights.topCategory?.[1] || 0)} in total spending — your highest category.`,
    },
    {
      icon: TrendingUp,
      color: 'text-sapphire-500',
      bg: 'bg-sapphire-50 dark:bg-sapphire-500/10',
      title: 'Daily spend rate',
      desc: `You're spending an average of ${formatINR(insights.avgDaily)} per day this month.`,
    },
  ];

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto">
      <div className="animate-fade-up opacity-0" style={{ animationFillMode: 'forwards' }}>
        <h1 className="font-display font-bold text-2xl text-ink-900 dark:text-ink-100">Insights</h1>
        <p className="text-sm text-ink-500 dark:text-ink-400 mt-0.5">Understand your spending patterns</p>
      </div>

      {/* Key Observations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {observations.map((obs, i) => (
          <div key={i} className={`rounded-2xl border border-ink-100 dark:border-ink-800 p-4 ${obs.bg} animate-fade-up opacity-0`} style={{ animationFillMode: 'forwards', animationDelay: `${i * 0.08}s` }}>
            <div className="flex items-start gap-3">
              <obs.icon size={20} className={`mt-0.5 flex-shrink-0 ${obs.color}`} />
              <div>
                <p className="font-semibold text-sm text-ink-900 dark:text-ink-100">{obs.title}</p>
                <p className="text-xs text-ink-500 dark:text-ink-400 mt-1 leading-relaxed">{obs.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Month Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-ink-900 rounded-2xl border border-ink-100 dark:border-ink-800 p-5 animate-fade-up opacity-0" style={{ animationFillMode: 'forwards', animationDelay: '0.2s' }}>
          <h2 className="font-display font-semibold text-base text-ink-900 dark:text-ink-100 mb-1">Month-over-Month</h2>
          <p className="text-xs text-ink-400 dark:text-ink-500 mb-4">Income & expenses comparison</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyData} barSize={18} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e8e4db" strokeOpacity={0.5} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9a8f74' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#9a8f74' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(240,165,0,0.06)' }} />
              <Bar dataKey="income" fill="#22c55e" radius={[5, 5, 0, 0]} name="income" />
              <Bar dataKey="expenses" fill="#f43f5e" radius={[5, 5, 0, 0]} name="expenses" />
              <Bar dataKey="savings" fill="#f0a500" radius={[5, 5, 0, 0]} name="savings" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Categories */}
        <div className="bg-white dark:bg-ink-900 rounded-2xl border border-ink-100 dark:border-ink-800 p-5 animate-fade-up opacity-0" style={{ animationFillMode: 'forwards', animationDelay: '0.25s' }}>
          <h2 className="font-display font-semibold text-base text-ink-900 dark:text-ink-100 mb-1">Top Spending Categories</h2>
          <p className="text-xs text-ink-400 dark:text-ink-500 mb-4">All time totals</p>
          <div className="space-y-3">
            {insights.sortedCats.slice(0, 6).map(([name, value], i) => {
              const max = insights.sortedCats[0]?.[1] || 1;
              const pct = Math.round((value / max) * 100);
              return (
                <div key={name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-ink-700 dark:text-ink-300 flex items-center gap-2">
                      <span>{CATEGORIES[name]?.icon}</span> {name}
                    </span>
                    <span className="font-mono text-xs font-semibold text-ink-600 dark:text-ink-400">{formatINR(value)}</span>
                  </div>
                  <div className="h-2 bg-ink-100 dark:bg-ink-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, backgroundColor: CATEGORIES[name]?.color || '#888' }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Savings Analysis */}
      <div className="bg-white dark:bg-ink-900 rounded-2xl border border-ink-100 dark:border-ink-800 p-5 animate-fade-up opacity-0" style={{ animationFillMode: 'forwards', animationDelay: '0.3s' }}>
        <h2 className="font-display font-semibold text-base text-ink-900 dark:text-ink-100 mb-1">Savings Analysis</h2>
        <p className="text-xs text-ink-400 dark:text-ink-500 mb-4">Net monthly savings over time</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {monthlyData.map((m) => {
            const rate = m.income > 0 ? Math.round((m.savings / m.income) * 100) : 0;
            const isGood = rate >= 20;
            return (
              <div key={m.month} className={`rounded-xl p-3 text-center border ${isGood ? 'border-jade-200 dark:border-jade-500/30 bg-jade-50 dark:bg-jade-500/10' : 'border-ruby-200 dark:border-ruby-500/30 bg-ruby-50 dark:bg-ruby-500/10'}`}>
                <p className="text-xs font-semibold text-ink-500 dark:text-ink-400 mb-1">{m.month}</p>
                <p className={`font-display font-bold text-lg ${isGood ? 'text-jade-600 dark:text-jade-400' : 'text-ruby-600 dark:text-ruby-400'}`}>{rate}%</p>
                <p className="text-xs text-ink-400 dark:text-ink-500 mt-0.5">{formatINR(m.savings)}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
