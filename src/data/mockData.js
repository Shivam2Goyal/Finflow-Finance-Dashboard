import { subDays, format, subMonths, startOfMonth } from 'date-fns';

export const CATEGORIES = {
  Food: { color: '#f0a500', icon: '🍽️' },
  Transport: { color: '#3b82f6', icon: '🚗' },
  Shopping: { color: '#a855f7', icon: '🛍️' },
  Health: { color: '#22c55e', icon: '💊' },
  Entertainment: { color: '#f43f5e', icon: '🎮' },
  Utilities: { color: '#6366f1', icon: '💡' },
  Rent: { color: '#0ea5e9', icon: '🏠' },
  Salary: { color: '#22c55e', icon: '💼' },
  Freelance: { color: '#84cc16', icon: '💻' },
  Investment: { color: '#f59e0b', icon: '📈' },
};

const today = new Date();

export const generateTransactions = () => {
  const txns = [
    // Income
    { id: 't1', date: format(subDays(today, 1), 'yyyy-MM-dd'), description: 'Monthly Salary', amount: 85000, category: 'Salary', type: 'income' },
    { id: 't2', date: format(subDays(today, 5), 'yyyy-MM-dd'), description: 'Freelance Project', amount: 15000, category: 'Freelance', type: 'income' },
    { id: 't3', date: format(subDays(today, 32), 'yyyy-MM-dd'), description: 'Monthly Salary', amount: 85000, category: 'Salary', type: 'income' },
    { id: 't4', date: format(subDays(today, 38), 'yyyy-MM-dd'), description: 'Investment Returns', amount: 4200, category: 'Investment', type: 'income' },
    { id: 't5', date: format(subDays(today, 62), 'yyyy-MM-dd'), description: 'Monthly Salary', amount: 85000, category: 'Salary', type: 'income' },
    { id: 't6', date: format(subDays(today, 70), 'yyyy-MM-dd'), description: 'Freelance Website', amount: 22000, category: 'Freelance', type: 'income' },
    { id: 't7', date: format(subDays(today, 93), 'yyyy-MM-dd'), description: 'Monthly Salary', amount: 85000, category: 'Salary', type: 'income' },
    { id: 't8', date: format(subDays(today, 124), 'yyyy-MM-dd'), description: 'Monthly Salary', amount: 85000, category: 'Salary', type: 'income' },
    { id: 't9', date: format(subDays(today, 155), 'yyyy-MM-dd'), description: 'Monthly Salary', amount: 82000, category: 'Salary', type: 'income' },
    { id: 't10', date: format(subDays(today, 160), 'yyyy-MM-dd'), description: 'Consulting Fee', amount: 12000, category: 'Freelance', type: 'income' },
    // Expenses
    { id: 'e1', date: format(subDays(today, 2), 'yyyy-MM-dd'), description: 'Apartment Rent', amount: 18000, category: 'Rent', type: 'expense' },
    { id: 'e2', date: format(subDays(today, 3), 'yyyy-MM-dd'), description: 'Swiggy Order', amount: 450, category: 'Food', type: 'expense' },
    { id: 'e3', date: format(subDays(today, 4), 'yyyy-MM-dd'), description: 'Ola Cab', amount: 280, category: 'Transport', type: 'expense' },
    { id: 'e4', date: format(subDays(today, 6), 'yyyy-MM-dd'), description: 'Amazon Shopping', amount: 3200, category: 'Shopping', type: 'expense' },
    { id: 'e5', date: format(subDays(today, 7), 'yyyy-MM-dd'), description: 'Gym Membership', amount: 2000, category: 'Health', type: 'expense' },
    { id: 'e6', date: format(subDays(today, 8), 'yyyy-MM-dd'), description: 'Netflix Subscription', amount: 649, category: 'Entertainment', type: 'expense' },
    { id: 'e7', date: format(subDays(today, 9), 'yyyy-MM-dd'), description: 'Electricity Bill', amount: 1850, category: 'Utilities', type: 'expense' },
    { id: 'e8', date: format(subDays(today, 10), 'yyyy-MM-dd'), description: 'Zomato Dinner', amount: 820, category: 'Food', type: 'expense' },
    { id: 'e9', date: format(subDays(today, 12), 'yyyy-MM-dd'), description: 'Metro Card Recharge', amount: 500, category: 'Transport', type: 'expense' },
    { id: 'e10', date: format(subDays(today, 13), 'yyyy-MM-dd'), description: 'Pharmacy', amount: 340, category: 'Health', type: 'expense' },
    { id: 'e11', date: format(subDays(today, 14), 'yyyy-MM-dd'), description: 'Clothes - Myntra', amount: 2800, category: 'Shopping', type: 'expense' },
    { id: 'e12', date: format(subDays(today, 16), 'yyyy-MM-dd'), description: 'Grocery - BigBasket', amount: 2100, category: 'Food', type: 'expense' },
    { id: 'e13', date: format(subDays(today, 18), 'yyyy-MM-dd'), description: 'Spotify Premium', amount: 119, category: 'Entertainment', type: 'expense' },
    { id: 'e14', date: format(subDays(today, 20), 'yyyy-MM-dd'), description: 'Internet Bill', amount: 999, category: 'Utilities', type: 'expense' },
    { id: 'e15', date: format(subDays(today, 22), 'yyyy-MM-dd'), description: 'Petrol', amount: 1200, category: 'Transport', type: 'expense' },
    { id: 'e16', date: format(subDays(today, 25), 'yyyy-MM-dd'), description: 'Doctor Visit', amount: 800, category: 'Health', type: 'expense' },
    { id: 'e17', date: format(subDays(today, 27), 'yyyy-MM-dd'), description: 'Movie Tickets', amount: 600, category: 'Entertainment', type: 'expense' },
    { id: 'e18', date: format(subDays(today, 30), 'yyyy-MM-dd'), description: 'Restaurant Dinner', amount: 1400, category: 'Food', type: 'expense' },
    { id: 'e19', date: format(subDays(today, 33), 'yyyy-MM-dd'), description: 'Apartment Rent', amount: 18000, category: 'Rent', type: 'expense' },
    { id: 'e20', date: format(subDays(today, 35), 'yyyy-MM-dd'), description: 'Mobile Recharge', amount: 699, category: 'Utilities', type: 'expense' },
    { id: 'e21', date: format(subDays(today, 40), 'yyyy-MM-dd'), description: 'Online Shopping', amount: 4500, category: 'Shopping', type: 'expense' },
    { id: 'e22', date: format(subDays(today, 45), 'yyyy-MM-dd'), description: 'Swiggy Order', amount: 380, category: 'Food', type: 'expense' },
    { id: 'e23', date: format(subDays(today, 50), 'yyyy-MM-dd'), description: 'Cab Expense', amount: 450, category: 'Transport', type: 'expense' },
    { id: 'e24', date: format(subDays(today, 55), 'yyyy-MM-dd'), description: 'Yoga Classes', amount: 1500, category: 'Health', type: 'expense' },
    { id: 'e25', date: format(subDays(today, 60), 'yyyy-MM-dd'), description: 'Game Purchase', amount: 2999, category: 'Entertainment', type: 'expense' },
    { id: 'e26', date: format(subDays(today, 63), 'yyyy-MM-dd'), description: 'Apartment Rent', amount: 18000, category: 'Rent', type: 'expense' },
    { id: 'e27', date: format(subDays(today, 65), 'yyyy-MM-dd'), description: 'Electricity Bill', amount: 1650, category: 'Utilities', type: 'expense' },
    { id: 'e28', date: format(subDays(today, 68), 'yyyy-MM-dd'), description: 'BigBasket Grocery', amount: 2400, category: 'Food', type: 'expense' },
    { id: 'e29', date: format(subDays(today, 72), 'yyyy-MM-dd'), description: 'Shoes - Adidas', amount: 5999, category: 'Shopping', type: 'expense' },
    { id: 'e30', date: format(subDays(today, 80), 'yyyy-MM-dd'), description: 'Petrol', amount: 1100, category: 'Transport', type: 'expense' },
  ];
  return txns.sort((a, b) => new Date(b.date) - new Date(a.date));
};

export const generateMonthlyData = () => {
  return Array.from({ length: 6 }, (_, i) => {
    const month = subMonths(today, 5 - i);
    const income = 85000 + Math.random() * 25000;
    const expenses = 35000 + Math.random() * 20000;
    return {
      month: format(month, 'MMM'),
      fullMonth: format(month, 'MMMM yyyy'),
      income: Math.round(income),
      expenses: Math.round(expenses),
      savings: Math.round(income - expenses),
    };
  });
};

export const DEFAULT_BUDGETS = [
  { category: 'Food', budget: 8000, color: '#f0a500' },
  { category: 'Transport', budget: 4000, color: '#3b82f6' },
  { category: 'Shopping', budget: 10000, color: '#a855f7' },
  { category: 'Health', budget: 5000, color: '#22c55e' },
  { category: 'Entertainment', budget: 3000, color: '#f43f5e' },
  { category: 'Utilities', budget: 5000, color: '#6366f1' },
  { category: 'Rent', budget: 20000, color: '#0ea5e9' },
];
