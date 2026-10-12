import React from 'react'

export function Table({ children, className = '' }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className={`w-full text-left border-collapse text-sm ${className}`}>
        {children}
      </table>
    </div>
  )
}

export function TableHead({ children, className = '' }) {
  return (
    <thead
      className={`bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider ${className}`}
    >
      {children}
    </thead>
  )
}

export function TableBody({ children, className = '' }) {
  return (
    <tbody className={`divide-y divide-slate-100 bg-white ${className}`}>
      {children}
    </tbody>
  )
}

export function TableRow({ children, className = '', hover = true, ...props }) {
  return (
    <tr
      className={`${
        hover ? 'hover:bg-slate-50/80 transition-colors' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </tr>
  )
}

export function TableHeaderCell({ children, className = '', align = 'left' }) {
  const alignClass =
    align === 'right'
      ? 'text-right'
      : align === 'center'
      ? 'text-center'
      : 'text-left'

  return (
    <th className={`px-4 py-3 font-semibold text-slate-600 ${alignClass} ${className}`}>
      {children}
    </th>
  )
}

export function TableCell({ children, className = '', align = 'left' }) {
  const alignClass =
    align === 'right'
      ? 'text-right'
      : align === 'center'
      ? 'text-center'
      : 'text-left'

  return (
    <td className={`px-4 py-3 text-slate-700 ${alignClass} ${className}`}>
      {children}
    </td>
  )
}

export default Table
