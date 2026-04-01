import { useState, useMemo } from 'react';
import { Plus, Search, SlidersHorizontal, Pencil, Trash2, Download, X } from 'lucide-react';
import { useStore } from '../store/useStore';
import { CATEGORIES } from '../data/mockData';
import TransactionModal from '../components/modals/TransactionModal';

const formatINR = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

const ALL_CATEGORIES = ['All', 'Food', 'Transport', 'Shopping', 'Health', 'Entertainment', 'Utilities', 'Rent', 'Salary', 'Freelance', 'Investment'];

export default function Transactions() {
  const { role, filters, setFilter, resetFilters, getFilteredTransactions, deleteTransaction } = useStore();
  const [modal, setModal] = useState(null); // null | 'add' | {transaction}
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const transactions = getFilteredTransactions();
  const isAdmin = role === 'admin';

  const handleDelete = (id) => {
    deleteTransaction(id);
    setDeleteConfirm(null);
  };

  const exportCSV = () => {
    const rows = [['Date', 'Description', 'Category', 'Type', 'Amount']];
    transactions.forEach((t) => rows.push([t.date, t.description, t.category, t.type, t.amount]));
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'transactions.csv'; a.click();
  };

  const hasActiveFilters = filters.search || filters.category !== 'All' || filters.type !== 'All' || filters.sortBy !== 'date-desc';

  return (
    <div className="p-4 lg:p-6 space-y-5 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-up opacity-0" style={{ animationFillMode: 'forwards' }}>
        <div>
          <h1 className="font-display font-bold text-2xl text-ink-900 dark:text-ink-100">Transactions</h1>
          <p className="text-sm text-ink-500 dark:text-ink-400 mt-0.5">
            {transactions.length} {transactions.length === 1 ? 'entry' : 'entries'}
            {hasActiveFilters && <span className="text-gold-500"> (filtered)</span>}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={exportCSV} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-ink-100 dark:bg-ink-800 hover:bg-ink-200 dark:hover:bg-ink-700 text-ink-700 dark:text-ink-300 text-sm font-medium transition-colors">
            <Download size={15} /> <span className="hidden sm:inline">Export</span>
          </button>
          {isAdmin && (
            <button onClick={() => setModal('add')} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-600 text-ink-950 text-sm font-semibold transition-colors">
              <Plus size={16} /> Add
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-ink-900 rounded-2xl border border-ink-100 dark:border-ink-800 p-4 space-y-3 animate-fade-up opacity-0" style={{ animationFillMode: 'forwards', animationDelay: '0.1s' }}>
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilter('search', e.target.value)}
              placeholder="Search transactions…"
              className="w-full pl-9 pr-3 py-2 bg-ink-50 dark:bg-ink-800 border border-ink-200 dark:border-ink-700 rounded-xl text-sm text-ink-900 dark:text-ink-100 placeholder-ink-400 focus:outline-none focus:ring-2 focus:ring-gold-400 transition-all"
            />
          </div>

          {/* Category */}
          <select
            value={filters.category}
            onChange={(e) => setFilter('category', e.target.value)}
            className="px-3 py-2 bg-ink-50 dark:bg-ink-800 border border-ink-200 dark:border-ink-700 rounded-xl text-sm text-ink-900 dark:text-ink-100 focus:outline-none focus:ring-2 focus:ring-gold-400 transition-all"
          >
            {ALL_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>

          {/* Type */}
          <select
            value={filters.type}
            onChange={(e) => setFilter('type', e.target.value)}
            className="px-3 py-2 bg-ink-50 dark:bg-ink-800 border border-ink-200 dark:border-ink-700 rounded-xl text-sm text-ink-900 dark:text-ink-100 focus:outline-none focus:ring-2 focus:ring-gold-400 transition-all"
          >
            <option value="All">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          {/* Sort */}
          <select
            value={filters.sortBy}
            onChange={(e) => setFilter('sortBy', e.target.value)}
            className="px-3 py-2 bg-ink-50 dark:bg-ink-800 border border-ink-200 dark:border-ink-700 rounded-xl text-sm text-ink-900 dark:text-ink-100 focus:outline-none focus:ring-2 focus:ring-gold-400 transition-all"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="amount-desc">Highest Amount</option>
            <option value="amount-asc">Lowest Amount</option>
          </select>

          {hasActiveFilters && (
            <button onClick={resetFilters} className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-ruby-200 dark:border-ruby-500/30 text-ruby-600 dark:text-ruby-400 text-sm font-medium hover:bg-ruby-50 dark:hover:bg-ruby-500/10 transition-colors whitespace-nowrap">
              <X size={14} /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-ink-900 rounded-2xl border border-ink-100 dark:border-ink-800 overflow-hidden animate-fade-up opacity-0" style={{ animationFillMode: 'forwards', animationDelay: '0.15s' }}>
        {transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-ink-400 dark:text-ink-600">
            <span className="text-4xl mb-3">🔍</span>
            <p className="font-medium text-ink-600 dark:text-ink-400">No transactions found</p>
            <p className="text-sm mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-ink-100 dark:border-ink-800">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-ink-400 dark:text-ink-500 uppercase tracking-wider">Transaction</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-ink-400 dark:text-ink-500 uppercase tracking-wider hidden sm:table-cell">Category</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-ink-400 dark:text-ink-500 uppercase tracking-wider hidden md:table-cell">Date</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-ink-400 dark:text-ink-500 uppercase tracking-wider">Type</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-ink-400 dark:text-ink-500 uppercase tracking-wider">Amount</th>
                  {isAdmin && <th className="px-4 py-3" />}
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-50 dark:divide-ink-800">
                {transactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-ink-50/50 dark:hover:bg-ink-800/50 transition-colors group">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <span className="text-lg leading-none">{CATEGORIES[txn.category]?.icon || '💰'}</span>
                        <span className="text-sm font-medium text-ink-800 dark:text-ink-200 truncate max-w-[160px]">{txn.description}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 hidden sm:table-cell">
                      <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ backgroundColor: `${CATEGORIES[txn.category]?.color}20`, color: CATEGORIES[txn.category]?.color }}>
                        {txn.category}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 hidden md:table-cell">
                      <span className="text-sm text-ink-500 dark:text-ink-400 font-mono">{txn.date}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                        txn.type === 'income'
                          ? 'bg-jade-100 dark:bg-jade-500/20 text-jade-700 dark:text-jade-400'
                          : 'bg-ruby-100 dark:bg-ruby-500/20 text-ruby-700 dark:text-ruby-400'
                      }`}>
                        {txn.type}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <span className={`font-mono font-semibold text-sm ${txn.type === 'income' ? 'text-jade-600 dark:text-jade-400' : 'text-ruby-600 dark:text-ruby-400'}`}>
                        {txn.type === 'income' ? '+' : '-'}{formatINR(txn.amount)}
                      </span>
                    </td>
                    {isAdmin && (
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => setModal(txn)} className="p-1.5 rounded-lg hover:bg-ink-100 dark:hover:bg-ink-700 text-ink-500 dark:text-ink-400 transition-colors">
                            <Pencil size={14} />
                          </button>
                          <button onClick={() => setDeleteConfirm(txn)} className="p-1.5 rounded-lg hover:bg-ruby-100 dark:hover:bg-ruby-500/20 text-ruby-500 transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {modal && (
        <TransactionModal
          transaction={modal === 'add' ? null : modal}
          onClose={() => setModal(null)}
        />
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-ink-950/60 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
          <div className="relative bg-white dark:bg-ink-900 rounded-2xl shadow-2xl w-full max-w-sm p-6 border border-ink-100 dark:border-ink-800 animate-fade-up opacity-0" style={{ animationFillMode: 'forwards' }}>
            <div className="text-center">
              <div className="w-12 h-12 bg-ruby-100 dark:bg-ruby-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={22} className="text-ruby-500" />
              </div>
              <h3 className="font-display font-bold text-lg text-ink-900 dark:text-ink-100 mb-1">Delete Transaction?</h3>
              <p className="text-sm text-ink-500 dark:text-ink-400 mb-6">
                "<span className="font-medium text-ink-700 dark:text-ink-300">{deleteConfirm.description}</span>" will be permanently removed.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 rounded-xl bg-ink-100 dark:bg-ink-800 text-ink-700 dark:text-ink-300 text-sm font-semibold hover:bg-ink-200 transition-colors">
                  Cancel
                </button>
                <button onClick={() => handleDelete(deleteConfirm.id)} className="flex-1 py-2.5 rounded-xl bg-ruby-500 hover:bg-ruby-600 text-white text-sm font-semibold transition-colors">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
