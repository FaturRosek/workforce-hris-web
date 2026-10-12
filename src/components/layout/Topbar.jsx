import React from 'react'
import { Menu, LogOut, User as UserIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Badge from '../ui/Badge'

export function Topbar({ onMenuClick }) {
  const { user, logout } = useAuth()

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="lg:hidden p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          aria-label="Buka navigasi menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:block">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Sistem HRIS & Order Operasional
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link
          to="/profile"
          className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg hover:bg-slate-50 transition-colors text-slate-700 cursor-pointer"
        >
          <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold flex items-center justify-center border border-blue-200">
            {user?.employee_name
              ? user.employee_name.charAt(0).toUpperCase()
              : user?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="hidden md:block text-left">
            <span className="text-xs font-semibold text-slate-900 block leading-tight">
              {user?.employee_name || user?.username}
            </span>
            <span className="text-[10px] text-slate-500 block leading-tight">
              {user?.role}
            </span>
          </div>
        </Link>

        <button
          type="button"
          onClick={logout}
          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
          title="Keluar (Logout)"
          aria-label="Logout"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  )
}

export default Topbar
