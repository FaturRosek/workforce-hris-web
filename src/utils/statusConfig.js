export const ORDER_STATUS = {
  PENDING: 'Pending',
  MEASUREMENT: 'Measurement',
  CUTTING: 'Cutting',
  SEWING: 'Sewing',
  FINISHING: 'Finishing',
  READY_PICKUP: 'Ready Pickup',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
}

export const ORDER_STATUS_CONFIG = {
  Pending: {
    label: 'Pending',
    variant: 'warning',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    dot: 'bg-amber-500',
  },
  Measurement: {
    label: 'Measurement',
    variant: 'info',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    dot: 'bg-blue-500',
  },
  Cutting: {
    label: 'Cutting',
    variant: 'info',
    bg: 'bg-sky-50',
    text: 'text-sky-700',
    border: 'border-sky-200',
    dot: 'bg-sky-500',
  },
  Sewing: {
    label: 'Sewing',
    variant: 'info',
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    border: 'border-indigo-200',
    dot: 'bg-indigo-500',
  },
  Finishing: {
    label: 'Finishing',
    variant: 'info',
    bg: 'bg-violet-50',
    text: 'text-violet-700',
    border: 'border-violet-200',
    dot: 'bg-violet-500',
  },
  'Ready Pickup': {
    label: 'Ready Pickup',
    variant: 'purple',
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
    dot: 'bg-purple-500',
  },
  Completed: {
    label: 'Completed',
    variant: 'success',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    dot: 'bg-emerald-500',
  },
  Cancelled: {
    label: 'Cancelled',
    variant: 'danger',
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200',
    dot: 'bg-rose-500',
  },
}

export const ORDER_STATUS_TRANSITIONS = {
  Pending: ['Measurement', 'Cancelled'],
  Measurement: ['Cutting', 'Cancelled'],
  Cutting: ['Sewing', 'Cancelled'],
  Sewing: ['Finishing', 'Cancelled'],
  Finishing: ['Ready Pickup'],
  'Ready Pickup': ['Completed'],
  Completed: [],
  Cancelled: [],
}

export const PAYMENT_STATUS_CONFIG = {
  Paid: {
    label: 'Paid',
    variant: 'success',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    dot: 'bg-emerald-500',
  },
  Pending: {
    label: 'Pending',
    variant: 'warning',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    dot: 'bg-amber-500',
  },
  Partial: {
    label: 'Partial',
    variant: 'warning',
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    border: 'border-orange-200',
    dot: 'bg-orange-500',
  },
  Unpaid: {
    label: 'Unpaid',
    variant: 'danger',
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200',
    dot: 'bg-rose-500',
  },
}

export const PAYMENT_METHOD_OPTIONS = ['Cash', 'Transfer', 'QRIS']
