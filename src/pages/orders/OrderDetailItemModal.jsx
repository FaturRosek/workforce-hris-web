import React, { useState, useEffect } from 'react'
import Modal from '../../components/ui/Modal'
import Select from '../../components/ui/Select'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import orderDetailApi from '../../api/orderDetails'
import serviceApi from '../../api/services'
import { formatCurrency } from '../../utils/formatters'
import { useToast } from '../../context/ToastContext'

export function OrderDetailItemModal({
  isOpen,
  onClose,
  orderId,
  item = null,
  onSuccess,
}) {
  const [services, setServices] = useState([])
  const [serviceId, setServiceId] = useState('')
  const [qty, setQty] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  const { success, error } = useToast()
  const isEdit = Boolean(item?.id)

  useEffect(() => {
    serviceApi.getServices({ limit: 100 }).then((res) => {
      if (res.success) setServices(res.data || [])
    })
  }, [])

  useEffect(() => {
    if (item) {
      setServiceId(String(item.service_id || ''))
      setQty(item.qty || 1)
    } else {
      setServiceId('')
      setQty(1)
    }
    setErrors({})
  }, [item, isOpen])

  const selectedService = services.find((s) => s.id === Number(serviceId))
  const price = selectedService ? Number(selectedService.price) : 0
  const subtotal = price * (Number(qty) || 0)

  const validate = () => {
    const errs = {}
    if (!serviceId) errs.service_id = 'Pilih layanan jahit'
    if (!qty || Number(qty) < 1) errs.qty = 'Qty minimal 1'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    try {
      setIsSubmitting(true)
      if (isEdit) {
        await orderDetailApi.updateOrderDetail(item.id, {
          service_id: Number(serviceId),
          qty: Number(qty),
        })
        success('Item pesanan berhasil diperbarui', 'Sukses')
      } else {
        await orderDetailApi.createOrderDetail({
          order_id: Number(orderId),
          service_id: Number(serviceId),
          qty: Number(qty),
        })
        success('Item pesanan baru berhasil ditambahkan', 'Sukses')
      }
      onSuccess?.()
      onClose()
    } catch (err) {
      error(err.message || 'Gagal menyimpan item pesanan')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Ubah Item Layanan' : 'Tambah Item Layanan'}
      subtitle="Total biaya order akan diperbarui secara otomatis"
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
            {isEdit ? 'Simpan Item' : 'Tambah ke Order'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Layanan Jahit"
          required
          value={serviceId}
          onChange={(e) => setServiceId(e.target.value)}
          error={errors.service_id}
          disabled={isSubmitting}
        >
          <option value="">-- Pilih Layanan --</option>
          {services.map((s) => (
            <option key={s.id} value={s.id}>
              {s.service_name} ({formatCurrency(s.price)})
            </option>
          ))}
        </Select>

        <Input
          label="Jumlah (Qty)"
          type="number"
          min="1"
          required
          value={qty}
          onChange={(e) => setQty(e.target.value)}
          error={errors.qty}
          disabled={isSubmitting}
        />

        {selectedService && (
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Harga Satuan:</span>
              <span className="font-medium text-slate-800">
                {formatCurrency(price)}
              </span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Estimasi Subtotal:</span>
              <span className="font-bold text-slate-900 text-sm">
                {formatCurrency(subtotal)}
              </span>
            </div>
          </div>
        )}
      </form>
    </Modal>
  )
}

export default OrderDetailItemModal
