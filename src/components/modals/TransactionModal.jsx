import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { CATEGORIES } from '../../data/mockData';

const EXPENSE_CATS = ['Food', 'Transport', 'Shopping', 'Health', 'Entertainment', 'Utilities', 'Rent'];
const INCOME_CATS = ['Salary', 'Freelance', 'Investment'];

export default function TransactionModal({ transaction, onClose }) {
  const { addTransaction, updateTransaction } = useStore();
  const isEdit = !!transaction;

  const [form, setForm] = useState({
    description: '',
    amount: '',
    category: 'Food',
    type: 'expense',
    date: new Date().toISOString().split('T')[0],
    ...transaction,
    amount: transaction?.amount || '',
  });

  const categories = form.type === 'income' ? INCOME_CATS : EXPENSE_CATS;

  useEffect(() => {
    if (!categories.includes(form.category)) {
      setForm((f) => ({ ...f, category: categories[0] }));
    }
  }, [form.type]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.description || !form.amount || !form.date) return;
    const payload = { ...form, amount: parseFloat(form.amount) };
    if (isEdit) updateTransaction(transaction.id, payload);
    else addTransaction(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink-950/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-ink-900 rounded-2xl shadow-2xl w-full max-w-md border border-ink-100 dark:border-ink-800 animate-fade-up" style={{ animationFillMode: 'forwards' }}>
        <div className="flex items-center justify-between p-5 border-b border-ink-100 dark:border-ink-800">
          <h2 className="font-display font-bold text-lg text-ink-900 dark:text-ink-100">
            {isEdit ? 'Edit Transaction' : 'Add Transaction'}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-ink-100 dark:hover:bg-ink-800 text-ink-500 transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Type toggle */}
          <div className="flex gap-2">
            {['expense', 'income'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setForm((f) => ({ ...f, type: t }))}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold capitalize transition-all ${
                  form.type === t
                    ? t === 'income' ? 'bg-jade-500 text-white' : 'bg-ruby-500 text-white'
                    : 'bg-ink-100 dark:bg-ink-800 text-ink-500 dark:text-ink-400'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div>
            <label className="block text-xs font-medium text-ink-500 mb-1.5">Description</label>
            <input
              type="text"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="e.g. Swiggy Order"
              className="w-full bg-ink-50 dark:bg-ink-800 border border-ink-200 dark:border-ink-700 rounded-xl px-3 py-2 text-sm text-ink-900 dark:text-ink-100 placeholder-ink-400 focus:outline-none focus:ring-2 focus:ring-gold-400 transition-all"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-ink-500 mb-1.5">Amount (₹)</label>
              <input
                type="number"
                value={form.amount}
                onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                placeholder="0"
                min="1"
                className="w-full bg-ink-50 dark:bg-ink-800 border border-ink-200 dark:border-ink-700 rounded-xl px-3 py-2 text-sm text-ink-900 dark:text-ink-100 placeholder-ink-400 focus:outline-none focus:ring-2 focus:ring-gold-400 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-500 mb-1.5">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                className="w-full bg-ink-50 dark:bg-ink-800 border border-ink-200 dark:border-ink-700 rounded-xl px-3 py-2 text-sm text-ink-900 dark:text-ink-100 focus:outline-none focus:ring-2 focus:ring-gold-400 transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-ink-500 mb-1.5">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              className="w-full bg-ink-50 dark:bg-ink-800 border border-ink-200 dark:border-ink-700 rounded-xl px-3 py-2 text-sm text-ink-900 dark:text-ink-100 focus:outline-none focus:ring-2 focus:ring-gold-400 transition-all"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{CATEGORIES[c]?.icon} {c}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl bg-ink-100 dark:bg-ink-800 text-ink-700 dark:text-ink-300 text-sm font-semibold hover:bg-ink-200 dark:hover:bg-ink-700 transition-colors">
              Cancel
            </button>
            <button type="submit" className="flex-1 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-ink-950 text-sm font-semibold transition-colors">
              {isEdit ? 'Save Changes' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
