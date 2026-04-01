import { Menu, Sun, Moon, Shield, Eye } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function Topbar({ onMenuClick }) {
  const { darkMode, toggleDarkMode, role, setRole } = useStore();

  return (
    <header className="sticky top-0 z-20 h-14 flex items-center justify-between px-4 lg:px-6 bg-white/80 dark:bg-ink-900/80 backdrop-blur-md border-b border-ink-100 dark:border-ink-800">
      {/* Left */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-xl hover:bg-ink-100 dark:hover:bg-ink-800 text-ink-600 dark:text-ink-400 transition-colors"
      >
        <Menu size={20} />
      </button>

      <div className="hidden lg:block" />

      {/* Right controls */}
      <div className="flex items-center gap-2">
        {/* Role switcher */}
        <div className="flex items-center gap-1 bg-ink-100 dark:bg-ink-800 rounded-xl p-1">
          <button
            onClick={() => setRole('viewer')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
              role === 'viewer'
                ? 'bg-white dark:bg-ink-700 text-ink-900 dark:text-ink-100 shadow-sm'
                : 'text-ink-500 dark:text-ink-400 hover:text-ink-700 dark:hover:text-ink-300'
            }`}
          >
            <Eye size={13} />
            Viewer
          </button>
          <button
            onClick={() => setRole('admin')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
              role === 'admin'
                ? 'bg-gold-500 text-ink-950 shadow-sm'
                : 'text-ink-500 dark:text-ink-400 hover:text-ink-700 dark:hover:text-ink-300'
            }`}
          >
            <Shield size={13} />
            Admin
          </button>
        </div>

        {/* Dark mode toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-xl hover:bg-ink-100 dark:hover:bg-ink-800 text-ink-600 dark:text-ink-400 transition-colors"
          title="Toggle dark mode"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  );
}
