import React, { useState, useEffect, useRef } from 'react'
import {
  Menu,
  LogOut,
  Bell,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Info,
  ExternalLink,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import notificationApi from '../../api/notifications'
import { formatDate } from '../../utils/formatters'

export function Topbar({ onMenuClick }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const dropdownRef = useRef(null)

  const fetchUnreadCount = async () => {
    try {
      const res = await notificationApi.getUnreadCount()
      if (res.success && res.data) {
        setUnreadCount(res.data.unread || 0)
      }
    } catch {
      // ignore
    }
  }

  const fetchNotifications = async () => {
    try {
      setIsLoading(true)
      const res = await notificationApi.getNotifications()
      if (res.success && Array.isArray(res.data)) {
        setNotifications(res.data)
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUnreadCount()
    const timer = setInterval(fetchUnreadCount, 45000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (isOpen) {
      fetchNotifications()
    }
  }, [isOpen])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const handleNotificationClick = async (notif) => {
    if (!notif.is_read) {
      try {
        await notificationApi.markAsRead(notif.id)
        setNotifications((prev) =>
          prev.map((n) => (n.id === notif.id ? { ...n, is_read: true } : n))
        )
        setUnreadCount((prev) => Math.max(prev - 1, 0))
      } catch {
        // ignore
      }
    }

    if (notif.order_id) {
      setIsOpen(false)
      navigate(`/orders/${notif.order_id}`)
    }
  }

  const getNotifIcon = (type) => {
    switch (type) {
      case 'pickup_reminder':
      case 'pickup':
        return <Clock className="w-4 h-4 text-amber-500" />
      case 'status_update':
        return <CheckCircle2 className="w-4 h-4 text-blue-500" />
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-rose-500" />
      default:
        return <Info className="w-4 h-4 text-slate-500" />
    }
  }

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

      <div className="flex items-center gap-2 sm:gap-3">
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors relative cursor-pointer"
            title="Notifikasi Pengambilan & Order"
            aria-label="Lihat notifikasi"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center leading-none ring-2 ring-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Notifikasi & Pengingat
                  </h4>
                  {unreadCount > 0 && (
                    <span className="text-[11px] font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                      {unreadCount} baru
                    </span>
                  )}
                </div>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {isLoading ? (
                  <div className="p-6 text-center text-xs text-slate-400">
                    Memuat notifikasi...
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="p-6 text-center space-y-1">
                    <p className="text-xs font-medium text-slate-600">
                      Tidak ada notifikasi baru
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Pengingat pickup dan status order akan muncul di sini.
                    </p>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <button
                      key={n.id}
                      type="button"
                      onClick={() => handleNotificationClick(n)}
                      className={`w-full text-left p-3 hover:bg-slate-50 transition-colors flex items-start gap-3 cursor-pointer ${
                        !n.is_read ? 'bg-blue-50/40' : ''
                      }`}
                    >
                      <div className="p-1.5 rounded-lg bg-slate-100 shrink-0 mt-0.5">
                        {getNotifIcon(n.type)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p
                            className={`text-xs truncate ${
                              !n.is_read
                                ? 'font-bold text-slate-900'
                                : 'font-medium text-slate-700'
                            }`}
                          >
                            {n.title}
                          </p>
                          <span className="text-[10px] text-slate-400 shrink-0">
                            {formatDate(n.created_at)}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
                          {n.message}
                        </p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

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
