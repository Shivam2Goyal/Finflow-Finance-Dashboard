import { useMemo } from 'react';
import { Wallet, TrendingUp, TrendingDown, Percent } from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import SummaryCard from '../components/SummaryCard';
import { useStore } from '../store/useStore';
import { CATEGORIES } from '../data/mockData';

const formatINR = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-ink-800 border border-ink-100 dark:border-ink-700 rounded-xl shadow-lg p-3 text-xs">
      <p className="font-semibold text-ink-700 dark:text-ink-300 mb-2">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }} className="flex justify-between gap-4">
          <span className="capitalize">{p.name}</span>
          <span className="font-mono font-medium">{formatINR(p.value)}</span>
        </p>
      ))}
    </div>
  );
};

const PieTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-ink-800 border border-ink-100 dark:border-ink-700 rounded-xl shadow-lg p-3 text-xs">
      <p className="font-semibold" style={{ color: payload[0].payload.fill }}>{payload[0].name}</p>
      <p className="font-mono font-medium text-ink-700 dark:text-ink-300">{formatINR(payload[0].value)}</p>
    </div>
  );
};

export default function Overview() {
  const { getSummary, getCategoryBreakdown, monthlyData, transactions } = useStore();
  const summary = getSummary();
  const breakdown = getCategoryBreakdown();

  const recentTransactions = useMemo(
    () => transactions.slice(0, 5),
    [transactions]
  );

  const pieData = breakdown.map((d) => ({
    ...d,
    fill: CATEGORIES[d.name]?.color || '#888',
  }));

  const cards = [
    { title: 'Total Balance', value: summary.balance, icon: Wallet, color: 'bg-gold-100 dark:bg-gold-500/20 text-gold-600 dark:text-gold-400', trend: 4.2, trendLabel: 'vs last month' },
    { title: 'Monthly Income', value: summary.monthlyIncome, icon: TrendingUp, color: 'bg-jade-100 dark:bg-jade-500/20 text-jade-600 dark:text-jade-400', trend: 8.1, trendLabel: 'vs last month' },
    { title: 'Monthly Expenses', value: summary.monthlyExpenses, icon: TrendingDown, color: 'bg-ruby-100 dark:bg-ruby-500/20 text-ruby-600 dark:text-ruby-400', trend: -3.4, trendLabel: 'vs last month' },
    { title: 'Savings Rate', value: summary.savingsRate, icon: Percent, color: 'bg-sapphire-100 dark:bg-sapphire-500/20 text-sapphire-600 dark:text-sapphire-400', isCurrency: false, suffix: '%', trend: 2.1, trendLabel: 'vs last month' },
  ];

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Page header */}
      <div className="animate-fade-up opacity-0" style={{ animationFillMode: 'forwards' }}>
        <h1 className="font-display font-bold text-2xl text-ink-900 dark:text-ink-100">Overview</h1>
        <p className="text-sm text-ink-500 dark:text-ink-400 mt-0.5">Your financial snapshot this month</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {cards.map((card, i) => (
          <div key={card.title} className={`stagger-${i + 1}`}>
            <SummaryCard {...card} />
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Line Chart - Balance Trend */}
        <div className="lg:col-span-2 bg-white dark:bg-ink-900 rounded-2xl border border-ink-100 dark:border-ink-800 p-5 animate-fade-up opacity-0" style={{ animationFillMode: 'forwards', animationDelay: '0.2s' }}>
          <div className="mb-4">
            <h2 className="font-display font-semibold text-base text-ink-900 dark:text-ink-100">Income vs Expenses</h2>
            <p className="text-xs text-ink-400 dark:text-ink-500 mt-0.5">Last 6 months</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyData} barGap={4} barSize={20}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8e4db" strokeOpacity={0.5} vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9a8f74' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#9a8f74' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(240,165,0,0.06)' }} />
              <Bar dataKey="income" fill="#22c55e" radius={[6, 6, 0, 0]} name="income" />
              <Bar dataKey="expenses" fill="#ef4444" radius={[6, 6, 0, 0]} name="expenses" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart - Category Breakdown */}
        <div className="bg-white dark:bg-ink-900 rounded-2xl border border-ink-100 dark:border-ink-800 p-5 animate-fade-up opacity-0" style={{ animationFillMode: 'forwards', animationDelay: '0.3s' }}>
          <div className="mb-3">
            <h2 className="font-display font-semibold text-base text-ink-900 dark:text-ink-100">Spending by Category</h2>
            <p className="text-xs text-ink-400 dark:text-ink-500 mt-0.5">This month</p>
          </div>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="45%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} stroke="none" />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
                <Legend
                  formatter={(value) => <span className="text-xs text-ink-600 dark:text-ink-400">{value}</span>}
                  iconType="circle"
                  iconSize={8}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-ink-400 dark:text-ink-600 text-sm">
              No expense data this month
            </div>
          )}
        </div>
      </div>

      {/* Savings trend */}
      <div className="bg-white dark:bg-ink-900 rounded-2xl border border-ink-100 dark:border-ink-800 p-5 animate-fade-up opacity-0" style={{ animationFillMode: 'forwards', animationDelay: '0.35s' }}>
        <div className="mb-4">
          <h2 className="font-display font-semibold text-base text-ink-900 dark:text-ink-100">Savings Trend</h2>
          <p className="text-xs text-ink-400 dark:text-ink-500 mt-0.5">Monthly net savings</p>
        </div>
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e8e4db" strokeOpacity={0.5} vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9a8f74' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#9a8f74' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="savings" stroke="#f0a500" strokeWidth={2.5} dot={{ fill: '#f0a500', r: 4, strokeWidth: 0 }} activeDot={{ r: 6, strokeWidth: 0 }} name="savings" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white dark:bg-ink-900 rounded-2xl border border-ink-100 dark:border-ink-800 p-5 animate-fade-up opacity-0" style={{ animationFillMode: 'forwards', animationDelay: '0.4s' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display font-semibold text-base text-ink-900 dark:text-ink-100">Recent Transactions</h2>
            <p className="text-xs text-ink-400 dark:text-ink-500 mt-0.5">Last 5 entries</p>
          </div>
        </div>
        <div className="space-y-2">
          {recentTransactions.map((txn) => (
            <div key={txn.id} className="flex items-center justify-between py-2.5 border-b border-ink-50 dark:border-ink-800 last:border-0">
              <div className="flex items-center gap-3">
                <span className="text-xl">{CATEGORIES[txn.category]?.icon || '💰'}</span>
                <div>
                  <p className="text-sm font-medium text-ink-800 dark:text-ink-200">{txn.description}</p>
                  <p className="text-xs text-ink-400 dark:text-ink-500">{txn.category} · {txn.date}</p>
                </div>
              </div>
              <span className={`font-mono font-semibold text-sm ${txn.type === 'income' ? 'text-jade-600 dark:text-jade-400' : 'text-ruby-600 dark:text-ruby-400'}`}>
                {txn.type === 'income' ? '+' : '-'}{formatINR(txn.amount)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
