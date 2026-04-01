import { useState, useMemo } from 'react';
import { Target, Pencil, Check, X, Plus } from 'lucide-react';
import { useStore } from '../store/useStore';
import { CATEGORIES } from '../data/mockData';

const formatINR = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

function BudgetCard({ budget, spent, isAdmin, onEdit }) {
  const pct = Math.min(Math.round((spent / budget.budget) * 100), 100);
  const isOver = spent > budget.budget;
  const isWarning = pct >= 80 && !isOver;
  const remaining = budget.budget - spent;

  const barColor = isOver ? '#ef4444' : isWarning ? '#f0a500' : budget.color;

  return (
    <div className="bg-white dark:bg-ink-900 rounded-2xl border border-ink-100 dark:border-ink-800 p-5 hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">{CATEGORIES[budget.category]?.icon || '📦'}</span>
          <div>
            <p className="font-semibold text-sm text-ink-900 dark:text-ink-100">{budget.category}</p>
            <p className="text-xs text-ink-400 dark:text-ink-500">Budget: {formatINR(budget.budget)}</p>
          </div>
        </div>
        {isAdmin && (
          <button onClick={() => onEdit(budget)} className="p-1.5 rounded-lg hover:bg-ink-100 dark:hover:bg-ink-800 text-ink-400 hover:text-ink-600 dark:hover:text-ink-300 transition-colors">
            <Pencil size={14} />
          </button>
        )}
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs mb-1.5">
          <span className="font-medium text-ink-600 dark:text-ink-400">Spent: {formatINR(spent)}</span>
          <span className={`font-bold ${isOver ? 'text-ruby-500' : isWarning ? 'text-gold-500' : 'text-jade-500'}`}>{pct}%</span>
        </div>
        <div className="h-2.5 bg-ink-100 dark:bg-ink-800 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${pct}%`, backgroundColor: barColor }}
          />
        </div>
      </div>

      <div className={`text-xs font-medium px-2.5 py-1 rounded-lg inline-block ${
        isOver ? 'bg-ruby-100 dark:bg-ruby-500/20 text-ruby-600 dark:text-ruby-400' :
        isWarning ? 'bg-gold-100 dark:bg-gold-500/20 text-gold-700 dark:text-gold-400' :
        'bg-jade-100 dark:bg-jade-500/20 text-jade-700 dark:text-jade-400'
      }`}>
        {isOver ? `Over by ${formatINR(Math.abs(remaining))}` : isWarning ? `${formatINR(remaining)} left — watch out!` : `${formatINR(remaining)} remaining`}
      </div>
    </div>
  );
}

function EditBudgetModal({ budget, onSave, onClose }) {
  const [value, setValue] = useState(budget.budget.toString());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink-950/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-ink-900 rounded-2xl shadow-2xl w-full max-w-sm p-6 border border-ink-100 dark:border-ink-800 animate-fade-up opacity-0" style={{ animationFillMode: 'forwards' }}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display font-bold text-lg text-ink-900 dark:text-ink-100">
            Edit Budget — {budget.category}
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-ink-100 dark:hover:bg-ink-800 text-ink-500">
            <X size={18} />
          </button>
        </div>
        <label className="block text-xs font-medium text-ink-500 mb-2">Monthly Budget (₹)</label>
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          min="0"
          className="w-full bg-ink-50 dark:bg-ink-800 border border-ink-200 dark:border-ink-700 rounded-xl px-3 py-2.5 text-sm text-ink-900 dark:text-ink-100 focus:outline-none focus:ring-2 focus:ring-gold-400 transition-all mb-5"
          autoFocus
        />
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl bg-ink-100 dark:bg-ink-800 text-ink-700 dark:text-ink-300 text-sm font-semibold hover:bg-ink-200 transition-colors">
            Cancel
          </button>
          <button
            onClick={() => { onSave(budget.category, parseFloat(value)); onClose(); }}
            className="flex-1 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-ink-950 text-sm font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <Check size={16} /> Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Budget() {
  const { budgets, updateBudget, transactions, role } = useStore();
  const [editBudget, setEditBudget] = useState(null);
  const isAdmin = role === 'admin';

  const spentByCategory = useMemo(() => {
    const now = new Date();
    const map = {};
    transactions.forEach((t) => {
      if (t.type === 'expense') {
        const d = new Date(t.date);
        if (d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()) {
          map[t.category] = (map[t.category] || 0) + t.amount;
        }
      }
    });
    return map;
  }, [transactions]);

  const totalBudget = budgets.reduce((s, b) => s + b.budget, 0);
  const totalSpent = budgets.reduce((s, b) => s + (spentByCategory[b.category] || 0), 0);
  const overBudgetCats = budgets.filter((b) => (spentByCategory[b.category] || 0) > b.budget);

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="animate-fade-up opacity-0" style={{ animationFillMode: 'forwards' }}>
        <h1 className="font-display font-bold text-2xl text-ink-900 dark:text-ink-100">Budget & Goals</h1>
        <p className="text-sm text-ink-500 dark:text-ink-400 mt-0.5">Track your monthly spending limits</p>
      </div>

      {/* Overview bar */}
      <div className="bg-white dark:bg-ink-900 rounded-2xl border border-ink-100 dark:border-ink-800 p-5 animate-fade-up opacity-0" style={{ animationFillMode: 'forwards', animationDelay: '0.1s' }}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-ink-400 dark:text-ink-500 uppercase tracking-wider mb-1">Total Monthly Budget</p>
            <div className="flex items-baseline gap-3">
              <span className="font-display font-bold text-3xl text-ink-900 dark:text-ink-100">{formatINR(totalSpent)}</span>
              <span className="text-sm text-ink-400">of {formatINR(totalBudget)}</span>
            </div>
          </div>
          <div className="flex gap-4 text-sm">
            <div className="text-center">
              <p className="font-display font-bold text-xl text-ink-900 dark:text-ink-100">{budgets.length}</p>
              <p className="text-xs text-ink-400 dark:text-ink-500">Categories</p>
            </div>
            <div className="text-center">
              <p className={`font-display font-bold text-xl ${overBudgetCats.length > 0 ? 'text-ruby-500' : 'text-jade-500'}`}>{overBudgetCats.length}</p>
              <p className="text-xs text-ink-400 dark:text-ink-500">Over budget</p>
            </div>
            <div className="text-center">
              <p className="font-display font-bold text-xl text-gold-500">{Math.round((totalSpent / totalBudget) * 100)}%</p>
              <p className="text-xs text-ink-400 dark:text-ink-500">Used</p>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="h-3 bg-ink-100 dark:bg-ink-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${Math.min((totalSpent / totalBudget) * 100, 100)}%`,
                backgroundColor: totalSpent > totalBudget ? '#ef4444' : totalSpent / totalBudget > 0.8 ? '#f0a500' : '#22c55e',
              }}
            />
          </div>
        </div>

        {!isAdmin && (
          <p className="text-xs text-ink-400 dark:text-ink-500 mt-3 flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-ink-300 dark:bg-ink-600" />
            Switch to Admin role to edit budgets
          </p>
        )}
      </div>

      {/* Budget Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {budgets.map((budget, i) => (
          <div key={budget.category} className="animate-fade-up opacity-0" style={{ animationFillMode: 'forwards', animationDelay: `${0.1 + i * 0.05}s` }}>
            <BudgetCard
              budget={budget}
              spent={spentByCategory[budget.category] || 0}
              isAdmin={isAdmin}
              onEdit={setEditBudget}
            />
          </div>
        ))}
      </div>

      {/* Goals section */}
      <div className="bg-white dark:bg-ink-900 rounded-2xl border border-ink-100 dark:border-ink-800 p-5 animate-fade-up opacity-0" style={{ animationFillMode: 'forwards', animationDelay: '0.4s' }}>
        <div className="flex items-center gap-2 mb-4">
          <Target size={18} className="text-gold-500" />
          <h2 className="font-display font-semibold text-base text-ink-900 dark:text-ink-100">Savings Goals</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { name: 'Emergency Fund', target: 300000, saved: 180000, color: '#3b82f6' },
            { name: 'Vacation — Goa', target: 50000, saved: 32000, color: '#a855f7' },
            { name: 'New Laptop', target: 120000, saved: 75000, color: '#f0a500' },
          ].map((goal) => {
            const pct = Math.round((goal.saved / goal.target) * 100);
            return (
              <div key={goal.name} className="bg-ink-50 dark:bg-ink-800/50 rounded-xl p-4 border border-ink-100 dark:border-ink-800">
                <p className="font-semibold text-sm text-ink-900 dark:text-ink-100 mb-1">{goal.name}</p>
                <div className="flex justify-between text-xs text-ink-500 mb-2">
                  <span>{formatINR(goal.saved)} saved</span>
                  <span>of {formatINR(goal.target)}</span>
                </div>
                <div className="h-2 bg-ink-200 dark:bg-ink-700 rounded-full overflow-hidden mb-2">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: goal.color }} />
                </div>
                <p className="text-xs font-bold" style={{ color: goal.color }}>{pct}% complete</p>
              </div>
            );
          })}
        </div>
      </div>

      {editBudget && (
        <EditBudgetModal
          budget={editBudget}
          onSave={updateBudget}
          onClose={() => setEditBudget(null)}
        />
      )}
    </div>
  );
}
