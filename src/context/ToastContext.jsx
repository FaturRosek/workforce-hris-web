import React, { createContext, useContext, useState, useCallback } from 'react'
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const showToast = useCallback(
    ({ type = 'info', title, message, duration = 4000 }) => {
      const id = Date.now() + Math.random().toString(36).substring(2, 9)
      const newToast = { id, type, title, message }

      setToasts((prev) => [...prev, newToast])

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id)
        }, duration)
      }
    },
    [removeToast]
  )

  const success = useCallback(
    (message, title = 'Berhasil') => {
      showToast({ type: 'success', title, message })
    },
    [showToast]
  )

  const error = useCallback(
    (message, title = 'Terjadi Kesalahan') => {
      showToast({ type: 'danger', title, message })
    },
    [showToast]
  )

  const warning = useCallback(
    (message, title = 'Perhatian') => {
      showToast({ type: 'warning', title, message })
    },
    [showToast]
  )

  const info = useCallback(
    (message, title = 'Informasi') => {
      showToast({ type: 'info', title, message })
    },
    [showToast]
  )

  return (
    <ToastContext.Provider value={{ showToast, success, error, warning, info }}>
      {children}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => {
          let icon = <Info className="w-5 h-5 text-blue-600 shrink-0" />
          let borderClass = 'border-blue-200 bg-white'
          let titleClass = 'text-blue-900'

          if (toast.type === 'success') {
            icon = <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            borderClass = 'border-emerald-200 bg-white'
            titleClass = 'text-emerald-950'
          } else if (toast.type === 'danger') {
            icon = <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            borderClass = 'border-rose-200 bg-white'
            titleClass = 'text-rose-950'
          } else if (toast.type === 'warning') {
            icon = <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            borderClass = 'border-amber-200 bg-white'
            titleClass = 'text-amber-950'
          }

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg ${borderClass} animate-in fade-in slide-in-from-top-2 duration-200 transition-all`}
              role="alert"
            >
              <div className="mt-0.5">{icon}</div>
              <div className="flex-1 min-w-0">
                {toast.title && (
                  <h4 className={`text-sm font-semibold leading-tight ${titleClass}`}>
                    {toast.title}
                  </h4>
                )}
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed break-words">
                  {toast.message}
                </p>
              </div>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-0.5 rounded-lg -mr-1 -mt-1 cursor-pointer"
                aria-label="Tutup pemberitahuan"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
