import React from 'react'
import { AlertTriangle, RotateCcw } from 'lucide-react'
import Button from './Button'

export function ErrorState({
  title = 'Gagal Memuat Data',
  message = 'Terjadi kendala saat berkomunikasi dengan server. Silakan coba kembali.',
  onRetry,
  className = '',
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-600 mb-4 border border-red-200">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h4 className="text-base font-semibold text-slate-800 mb-1">{title}</h4>
      <p className="text-xs sm:text-sm text-slate-500 max-w-sm mb-5 leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm" icon={RotateCcw}>
          Coba Lagi
        </Button>
      )}
    </div>
  )
}

export default ErrorState
