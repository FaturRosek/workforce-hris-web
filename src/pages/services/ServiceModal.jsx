import React, { useState, useEffect } from 'react'
import serviceApi from '../../api/services'
import { useToast } from '../../context/ToastContext'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'

export function ServiceModal({ isOpen, onClose, service, onSuccess }) {
  const isEdit = Boolean(service?.id)
  const { success, error: toastError } = useToast()

  const [formData, setFormData] = useState({
    service_name: '',
    price: '',
    estimated_days: '3',
    description: '',
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (service) {
      setFormData({
        service_name: service.service_name || '',
        price: service.price ? String(service.price) : '',
        estimated_days: service.estimated_days ? String(service.estimated_days) : '3',
        description: service.description || '',
      })
    } else {
      setFormData({
        service_name: '',
        price: '',
        estimated_days: '3',
        description: '',
      })
    }
    setErrors({})
  }, [service, isOpen])

  const validate = () => {
    const errs = {}
    if (!formData.service_name.trim()) {
      errs.service_name = 'Nama layanan jasa jahit wajib diisi'
    }
    if (!formData.price || Number(formData.price) <= 0) {
      errs.price = 'Tarif harga harus lebih besar dari 0'
    }
    if (!formData.estimated_days || Number(formData.estimated_days) < 1) {
      errs.estimated_days = 'Estimasi pengerjaan minimal 1 hari'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    try {
      setIsSubmitting(true)
      const payload = {
        service_name: formData.service_name.trim(),
        price: Number(formData.price),
        estimated_days: Number(formData.estimated_days),
        description: formData.description.trim() || undefined,
      }

      if (isEdit) {
        await serviceApi.updateService(service.id, payload)
        success(`Layanan "${payload.service_name}" berhasil diperbarui`, 'Tersimpan')
      } else {
        await serviceApi.createService(payload)
        success(`Layanan "${payload.service_name}" berhasil ditambahkan`, 'Ditambahkan')
      }

      onSuccess?.()
      onClose()
    } catch (err) {
      toastError(err.message || 'Gagal menyimpan data layanan')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Ubah Data Layanan Jahit' : 'Tambah Layanan Jahit Baru'}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nama Layanan Jasa"
          placeholder="Contoh: Jahit Kemeja Batik Premium"
          value={formData.service_name}
          onChange={(e) => setFormData({ ...formData, service_name: e.target.value })}
          error={errors.service_name}
          required
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Tarif Harga (Rp)"
            type="number"
            min="0"
            step="1000"
            placeholder="Contoh: 150000"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            error={errors.price}
            required
          />

          <Input
            label="Estimasi (Hari)"
            type="number"
            min="1"
            placeholder="Contoh: 5"
            value={formData.estimated_days}
            onChange={(e) => setFormData({ ...formData, estimated_days: e.target.value })}
            error={errors.estimated_days}
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Deskripsi / Spesifikasi Layanan
          </label>
          <textarea
            rows={3}
            placeholder="Keterangan jenis bahan, lapisan puring, kancing, dll..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full text-xs rounded-lg border border-slate-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Batal
          </Button>
          <Button type="submit" size="sm" isLoading={isSubmitting}>
            {isEdit ? 'Simpan Perubahan' : 'Tambah Layanan'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default ServiceModal
