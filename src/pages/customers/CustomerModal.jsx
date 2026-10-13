import React, { useState, useEffect } from 'react'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import customerApi from '../../api/customers'
import { useToast } from '../../context/ToastContext'

export function CustomerModal({
  isOpen,
  onClose,
  customer = null,
  onSuccess,
}) {
  const [formData, setFormData] = useState({
    customer_code: '',
    full_name: '',
    phone: '',
    email: '',
    address: '',
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { success, error } = useToast()
  const isEdit = Boolean(customer?.id)

  useEffect(() => {
    if (customer) {
      setFormData({
        customer_code: customer.customer_code || '',
        full_name: customer.full_name || '',
        phone: customer.phone || '',
        email: customer.email || '',
        address: customer.address || '',
      })
    } else {
      const randomCode = `CUS-${String(Math.floor(100 + Math.random() * 900))}`
      setFormData({
        customer_code: randomCode,
        full_name: '',
        phone: '',
        email: '',
        address: '',
      })
    }
    setErrors({})
  }, [customer, isOpen])

  const validate = () => {
    const newErrors = {}
    if (!formData.customer_code.trim()) {
      newErrors.customer_code = 'Kode pelanggan wajib diisi'
    }
    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Nama lengkap wajib diisi'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    try {
      setIsSubmitting(true)
      if (isEdit) {
        await customerApi.updateCustomer(customer.id, formData)
        success('Data pelanggan berhasil diperbarui', 'Sukses')
      } else {
        await customerApi.createCustomer(formData)
        success('Pelanggan baru berhasil ditambahkan', 'Sukses')
      }
      onSuccess?.()
      onClose()
    } catch (err) {
      error(err.message || 'Gagal menyimpan data pelanggan')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Data Pelanggan' : 'Tambah Pelanggan Baru'}
      subtitle={
        isEdit
          ? `Perbarui informasi untuk ${customer?.full_name}`
          : 'Masukkan data pelanggan untuk pencatatan order'
      }
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
            {isEdit ? 'Simpan Perubahan' : 'Tambah Pelanggan'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Kode Pelanggan"
          name="customer_code"
          required
          placeholder="Contoh: CUS-001"
          value={formData.customer_code}
          onChange={(e) =>
            setFormData({ ...formData, customer_code: e.target.value })
          }
          error={errors.customer_code}
          disabled={isSubmitting}
        />

        <Input
          label="Nama Lengkap"
          name="full_name"
          required
          placeholder="Masukkan nama pelanggan"
          value={formData.full_name}
          onChange={(e) =>
            setFormData({ ...formData, full_name: e.target.value })
          }
          error={errors.full_name}
          disabled={isSubmitting}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Nomor Telepon / WhatsApp"
            name="phone"
            type="tel"
            placeholder="08xxxxxxxxxx"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            disabled={isSubmitting}
          />

          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="nama@email.com"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            disabled={isSubmitting}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-700">
            Alamat Lengkap
          </label>
          <textarea
            rows={3}
            placeholder="Alamat domisili atau pengantaran..."
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            disabled={isSubmitting}
            className="w-full rounded-lg border border-slate-300 bg-white text-slate-900 text-sm p-3 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 disabled:bg-slate-50 transition-colors"
          />
        </div>
      </form>
    </Modal>
  )
}

export default CustomerModal
