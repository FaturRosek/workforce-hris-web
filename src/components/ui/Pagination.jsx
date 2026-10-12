import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export function Pagination({
  page = 1,
  totalPages = 1,
  total = 0,
  limit = 10,
  onPageChange,
  onLimitChange,
  className = '',
}) {
  if (total === 0) return null

  const startRecord = (page - 1) * limit + 1
  const endRecord = Math.min(page * limit, total)

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 bg-white border-t border-slate-200 text-xs text-slate-600 select-none ${className}`}
    >
      <div className="flex items-center gap-2">
        <span>
          Menampilkan <strong className="font-semibold text-slate-900">{startRecord}</strong> -{' '}
          <strong className="font-semibold text-slate-900">{endRecord}</strong> dari{' '}
          <strong className="font-semibold text-slate-900">{total}</strong> data
        </span>

        {onLimitChange && (
          <div className="ml-2 flex items-center gap-1.5">
            <span className="text-slate-400">|</span>
            <span className="text-slate-500">Per baris:</span>
            <select
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="inline-flex items-center justify-center p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          aria-label="Halaman sebelumnya"
        >
          <ChevronLeft className="w-4 h-4 text-slate-600" />
        </button>

        <span className="px-3 py-1 font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg">
          {page} / {Math.max(totalPages, 1)}
        </span>

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="inline-flex items-center justify-center p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          aria-label="Halaman selanjutnya"
        >
          <ChevronRight className="w-4 h-4 text-slate-600" />
        </button>
      </div>
    </div>
  )
}

export default Pagination
