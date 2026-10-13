import React, { useState, useEffect } from 'react'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Button from '../../components/ui/Button'
import paymentApi from '../../api/payments'
import {
  formatCurrency,
  toInputDate,
} from '../../utils/formatters'
import { PAYMENT_METHOD_OPTIONS } from '../../utils/statusConfig'
import { useToast } from '../../context/ToastContext'

export function CreatePaymentModal({
  isOpen,
  onClose,
  orderId,
  orderInvoice,
  remainingBalance,
  onSuccess,
}) {
  const [paymentDate, setPaymentDate] = useState(() => toInputDate(new Date()))
  const [paymentMethod, setPaymentMethod] = useState('Cash')
  const [amount, setAmount] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  const { success, error: toastError } = useToast()

  useEffect(() => {
    if (isOpen) {
      setPaymentDate(toInputDate(new Date()))
      setPaymentMethod('Cash')
      setAmount(remainingBalance ? String(remainingBalance) : '')
      setErrors({})
    }
  }, [isOpen, remainingBalance])

  const validate = () => {
    const newErrors = {}
    if (!paymentDate) newErrors.payment_date = 'Tanggal pembayaran wajib diisi'
    if (!paymentMethod) newErrors.payment_method = 'Metode pembayaran wajib dipilih'

    const numAmount = Number(amount)
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      newErrors.amount = 'Nominal pembayaran harus lebih dari 0'
    } else if (
      remainingBalance !== undefined &&
      remainingBalance !== null &&
      numAmount > Number(remainingBalance)
    ) {
      newErrors.amount = `Nominal tidak boleh melebihi sisa tagihan (${formatCurrency(
        remainingBalance
      )})`
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    try {
      setIsSubmitting(true)
      const payload = {
        order_id: Number(orderId),
        payment_date: paymentDate,
        payment_method: paymentMethod,
        amount: Number(amount),
      }

      await paymentApi.createPayment(payload)
      success('Pembayaran berhasil dicatat', 'Sukses')
      onSuccess?.()
      onClose()
    } catch (err) {
      toastError(err.message || 'Gagal mencatat pembayaran')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Catat Pembayaran Order"
      subtitle={`Invoice: ${orderInvoice || `#${orderId}`}`}
      maxWidth="max-w-md"
      footer={
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Batal
          </Button>
          <Button
            size="sm"
            onClick={handleSubmit}
            isLoading={isSubmitting}
          >
            Simpan Pembayaran
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {remainingBalance !== undefined && remainingBalance !== null && (
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Sisa Tagihan:</span>
            <span className="font-bold text-amber-700 text-sm">
              {formatCurrency(remainingBalance)}
            </span>
          </div>
        )}

        <Input
          label="Tanggal Pembayaran"
          type="date"
          required
          value={paymentDate}
          onChange={(e) => setPaymentDate(e.target.value)}
          error={errors.payment_date}
          disabled={isSubmitting}
        />

        <Select
          label="Metode Pembayaran"
          required
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          error={errors.payment_method}
          disabled={isSubmitting}
        >
          {PAYMENT_METHOD_OPTIONS.map((method) => (
            <option key={method} value={method}>
              {method}
            </option>
          ))}
        </Select>

        <div>
          <Input
            label="Nominal Pembayaran (Rp)"
            type="number"
            min="1000"
            step="1000"
            required
            placeholder="misal 500000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            error={errors.amount}
            disabled={isSubmitting}
          />
          {amount && !errors.amount && (
            <p className="text-[11px] text-slate-500 mt-1">
              Terbaca: <strong>{formatCurrency(amount)}</strong>
            </p>
          )}
        </div>
      </form>
    </Modal>
  )
}

export default CreatePaymentModal
