import React, { forwardRef } from 'react'
import { ChevronDown } from 'lucide-react'

export const Select = forwardRef(function Select(
  {
    label,
    id,
    error,
    helperText,
    required = false,
    options = [],
    placeholder = '-- Pilih Opsi --',
    className = '',
    containerClassName = '',
    children,
    ...props
  },
  ref
) {
  const selectId = id || props.name || undefined

  return (
    <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
      {label && (
        <label
          htmlFor={selectId}
          className="text-xs font-semibold text-slate-700 flex items-center gap-1"
        >
          <span>{label}</span>
          {required && <span className="text-red-500 font-bold">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        <select
          ref={ref}
          id={selectId}
          required={required}
          className={`w-full appearance-none rounded-lg border bg-white text-slate-900 text-sm pl-3.5 pr-9 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed ${
            error
              ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
              : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'
          } ${className}`}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {children
            ? children
            : options.map((opt) => {
                const value = typeof opt === 'object' ? opt.value : opt
                const label = typeof opt === 'object' ? opt.label : opt
                return (
                  <option key={value} value={value}>
                    {label}
                  </option>
                )
              })}
        </select>
        <div className="absolute right-3 pointer-events-none text-slate-400">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>

      {error ? (
        <p className="text-xs text-red-600 font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-slate-500">{helperText}</p>
      ) : null}
    </div>
  )
})

export default Select
