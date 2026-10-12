import React from 'react'

export function Skeleton({ className = '', rounded = 'rounded-md' }) {
  return (
    <div
      className={`animate-pulse bg-slate-200/80 ${rounded} ${className}`}
      aria-hidden="true"
    />
  )
}

export function TableSkeleton({ rows = 5, cols = 5 }) {
  return (
    <div className="w-full divide-y divide-slate-100">
      {Array.from({ length: rows }).map((_, rIndex) => (
        <div key={rIndex} className="flex items-center gap-4 px-6 py-4">
          {Array.from({ length: cols }).map((_, cIndex) => (
            <Skeleton
              key={cIndex}
              className={`h-4 ${
                cIndex === 0
                  ? 'w-16'
                  : cIndex === 1
                  ? 'w-32 flex-1'
                  : 'w-24'
              }`}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

export default Skeleton
