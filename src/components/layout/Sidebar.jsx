import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  CreditCard,
  User,
  LogOut,
  Scissors,
  X,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Badge from '../ui/Badge'

export function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth()

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/orders', label: 'Orders', icon: ShoppingBag },
    { to: '/customers', label: 'Customers', icon: Users },
    { to: '/payments', label: 'Payments', icon: CreditCard },
    { to: '/profile', label: 'Profil Saya', icon: User },
  ]

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'bg-blue-50 text-blue-700 font-semibold shadow-2xs'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
    }`

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200">
      <div className="h-16 px-5 border-b border-slate-100 flex items-center justify-between shrink-0">
        <NavLink to="/" className="flex items-center gap-2.5 group">
          <img
            src="/logo.jpg"
            alt="MM Tailor Logo"
            className="w-9 h-9 rounded-lg object-contain bg-white border border-slate-200/80 p-0.5 shadow-2xs group-hover:scale-105 transition-transform"
          />
          <div>
            <span className="font-bold text-slate-900 text-base leading-none block">
              MM Tailor
            </span>
          </div>
        </NavLink>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Tutup navigasi"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Menu Operasional
        </div>

        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={navLinkClass}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          )
        })}
      </div>

      <div className="p-3 border-t border-slate-100 bg-slate-50/50 shrink-0">
        <div className="px-3 py-2 flex items-center gap-3 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0 border border-blue-200">
            {user?.employee_name
              ? user.employee_name.charAt(0).toUpperCase()
              : user?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-900 truncate">
              {user?.employee_name || user?.username || 'Pengguna'}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Badge variant="info" size="sm" dot>
                {user?.role || 'Staff'}
              </Badge>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={logout}
          className="mt-2 w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Keluar (Logout)</span>
        </button>
      </div>
    </div>
  )

  return (
    <>
      <aside className="hidden lg:block w-60 fixed inset-y-0 left-0 z-30">
        {sidebarContent}
      </aside>

      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={onClose}
            aria-hidden="true"
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full shadow-2xl animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  )
}

export default Sidebar
