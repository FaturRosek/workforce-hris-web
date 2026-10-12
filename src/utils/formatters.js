export function formatCurrency(amount) {
  if (amount === null || amount === undefined || isNaN(Number(amount))) {
    return 'Rp 0'
  }
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(amount))
}

export function formatDate(dateString, includeTime = false) {
  if (!dateString) return '-'
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return String(dateString)

    const options = {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      ...(includeTime
        ? {
            hour: '2-digit',
            minute: '2-digit',
          }
        : {}),
    }

    return new Intl.DateTimeFormat('id-ID', options).format(date)
  } catch {
    return String(dateString)
  }
}

export function toInputDate(date = new Date()) {
  const d = new Date(date)
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${month}-${day}`
}
