import React from 'react'

export function Card({
  children,
  title,
  subtitle,
  action,
  className = '',
  bodyClassName = 'p-5 sm:p-6',
  headerClassName = 'px-5 py-4 sm:px-6 sm:py-4.5 border-b border-slate-100 flex items-center justify-between gap-4',
  footer,
  footerClassName = 'px-5 py-3 sm:px-6 bg-slate-50 border-t border-slate-100 rounded-b-xl',
  ...props
}) {
  const hasHeader = title || subtitle || action

  return (
    <div
      className={`bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden ${className}`}
      {...props}
    >
      {hasHeader && (
        <div className={headerClassName}>
          <div className="min-w-0">
            {title && (
              <h3 className="text-base font-semibold text-slate-900 truncate">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-slate-500 mt-0.5 truncate">{subtitle}</p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}

      <div className={bodyClassName}>{children}</div>

      {footer && <div className={footerClassName}>{footer}</div>}
    </div>
  )
}

export default Card
