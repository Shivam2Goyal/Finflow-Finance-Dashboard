import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateTransactions, generateMonthlyData, DEFAULT_BUDGETS } from '../data/mockData';

const initialTransactions = generateTransactions();
const initialMonthlyData = generateMonthlyData();

export const useStore = create(
  persist(
    (set, get) => ({
      // --- Role ---
      role: 'admin', // 'admin' | 'viewer'
      setRole: (role) => set({ role }),

      // --- Theme ---
      darkMode: false,
      toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),

      // --- Transactions ---
      transactions: initialTransactions,
      addTransaction: (txn) =>
        set((s) => ({
          transactions: [
            { ...txn, id: `t${Date.now()}` },
            ...s.transactions,
          ].sort((a, b) => new Date(b.date) - new Date(a.date)),
        })),
      updateTransaction: (id, updates) =>
        set((s) => ({
          transactions: s.transactions.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        })),
      deleteTransaction: (id) =>
        set((s) => ({ transactions: s.transactions.filter((t) => t.id !== id) })),

      // --- Filters ---
      filters: { search: '', category: 'All', type: 'All', sortBy: 'date-desc' },
      setFilter: (key, value) =>
        set((s) => ({ filters: { ...s.filters, [key]: value } })),
      resetFilters: () =>
        set({ filters: { search: '', category: 'All', type: 'All', sortBy: 'date-desc' } }),

      // --- Monthly Chart Data ---
      monthlyData: initialMonthlyData,

      // --- Budgets ---
      budgets: DEFAULT_BUDGETS,
      updateBudget: (category, amount) =>
        set((s) => ({
          budgets: s.budgets.map((b) =>
            b.category === category ? { ...b, budget: amount } : b
          ),
        })),

      // --- Computed helpers ---
      getFilteredTransactions: () => {
        const { transactions, filters } = get();
        let result = [...transactions];
        if (filters.search) {
          const q = filters.search.toLowerCase();
          result = result.filter(
            (t) =>
              t.description.toLowerCase().includes(q) ||
              t.category.toLowerCase().includes(q)
          );
        }
        if (filters.category !== 'All') result = result.filter((t) => t.category === filters.category);
        if (filters.type !== 'All') result = result.filter((t) => t.type === filters.type);
        switch (filters.sortBy) {
          case 'date-asc': result.sort((a, b) => new Date(a.date) - new Date(b.date)); break;
          case 'amount-desc': result.sort((a, b) => b.amount - a.amount); break;
          case 'amount-asc': result.sort((a, b) => a.amount - b.amount); break;
          default: result.sort((a, b) => new Date(b.date) - new Date(a.date));
        }
        return result;
      },

      getSummary: () => {
        const { transactions } = get();
        const now = new Date();
        const thisMonth = transactions.filter((t) => {
          const d = new Date(t.date);
          return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        });
        const income = thisMonth.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
        const expenses = thisMonth.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
        const totalIncome = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
        const totalExpenses = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
        return {
          balance: totalIncome - totalExpenses,
          monthlyIncome: income,
          monthlyExpenses: expenses,
          savingsRate: income > 0 ? Math.round(((income - expenses) / income) * 100) : 0,
        };
      },

      getCategoryBreakdown: () => {
        const { transactions } = get();
        const now = new Date();
        const thisMonth = transactions.filter((t) => {
          const d = new Date(t.date);
          return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() && t.type === 'expense';
        });
        const map = {};
        thisMonth.forEach((t) => {
          map[t.category] = (map[t.category] || 0) + t.amount;
        });
        return Object.entries(map)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value);
      },
    }),
    {
      name: 'finance-dashboard-storage',
      partialize: (state) => ({
        transactions: state.transactions,
        darkMode: state.darkMode,
        budgets: state.budgets,
        role: state.role,
      }),
    }
  )
);
