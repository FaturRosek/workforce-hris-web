import React, { useState, useEffect } from 'react'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import measurementApi from '../../api/measurements'
import { useToast } from '../../context/ToastContext'

export function MeasurementModal({
  isOpen,
  onClose,
  orderId,
  initialMeasurement = null,
  onSuccess,
}) {
  const [formData, setFormData] = useState({
    chest: '',
    waist: '',
    hip: '',
    shoulder: '',
    sleeve_length: '',
    shirt_length: '',
    neck: '',
    armhole: '',
    notes: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { success, error } = useToast()

  const isEdit = Boolean(initialMeasurement?.id)

  useEffect(() => {
    if (initialMeasurement) {
      setFormData({
        chest: initialMeasurement.chest || '',
        waist: initialMeasurement.waist || '',
        hip: initialMeasurement.hip || '',
        shoulder: initialMeasurement.shoulder || '',
        sleeve_length: initialMeasurement.sleeve_length || '',
        shirt_length: initialMeasurement.shirt_length || '',
        neck: initialMeasurement.neck || '',
        armhole: initialMeasurement.armhole || '',
        notes: initialMeasurement.notes || '',
      })
    } else {
      setFormData({
        chest: '',
        waist: '',
        hip: '',
        shoulder: '',
        sleeve_length: '',
        shirt_length: '',
        neck: '',
        armhole: '',
        notes: '',
      })
    }
  }, [initialMeasurement, isOpen])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setIsSubmitting(true)

      const payload = {
        chest: formData.chest ? Number(formData.chest) : null,
        waist: formData.waist ? Number(formData.waist) : null,
        hip: formData.hip ? Number(formData.hip) : null,
        shoulder: formData.shoulder ? Number(formData.shoulder) : null,
        sleeve_length: formData.sleeve_length
          ? Number(formData.sleeve_length)
          : null,
        shirt_length: formData.shirt_length
          ? Number(formData.shirt_length)
          : null,
        neck: formData.neck ? Number(formData.neck) : null,
        armhole: formData.armhole ? Number(formData.armhole) : null,
        notes: formData.notes || null,
      }

      if (isEdit) {
        await measurementApi.update(orderId, payload)
        success('Ukuran badan berhasil diperbarui', 'Sukses')
      } else {
        await measurementApi.create(orderId, payload)
        success('Ukuran badan berhasil disimpan', 'Sukses')
      }

      onSuccess?.()
      onClose()
    } catch (err) {
      error(err.message || 'Gagal menyimpan ukuran badan')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Ubah Ukuran Badan Pelanggan' : 'Catat Ukuran Badan (Fitting)'}
      subtitle="Satuan pengukuran dalam centimeter (cm)"
      maxWidth="max-w-xl"
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
            {isEdit ? 'Simpan Ukuran' : 'Catat Ukuran'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <Input
            label="Lingkar Dada (cm)"
            type="number"
            step="0.1"
            placeholder="misal 96"
            value={formData.chest}
            onChange={(e) =>
              setFormData({ ...formData, chest: e.target.value })
            }
            disabled={isSubmitting}
          />
          <Input
            label="Lingkar Pinggang (cm)"
            type="number"
            step="0.1"
            placeholder="misal 82"
            value={formData.waist}
            onChange={(e) =>
              setFormData({ ...formData, waist: e.target.value })
            }
            disabled={isSubmitting}
          />
          <Input
            label="Lingkar Pinggul (cm)"
            type="number"
            step="0.1"
            placeholder="misal 98"
            value={formData.hip}
            onChange={(e) => setFormData({ ...formData, hip: e.target.value })}
            disabled={isSubmitting}
          />
          <Input
            label="Lebar Bahu (cm)"
            type="number"
            step="0.1"
            placeholder="misal 44"
            value={formData.shoulder}
            onChange={(e) =>
              setFormData({ ...formData, shoulder: e.target.value })
            }
            disabled={isSubmitting}
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <Input
            label="Panjang Lengan (cm)"
            type="number"
            step="0.1"
            placeholder="misal 58"
            value={formData.sleeve_length}
            onChange={(e) =>
              setFormData({ ...formData, sleeve_length: e.target.value })
            }
            disabled={isSubmitting}
          />
          <Input
            label="Panjang Baju (cm)"
            type="number"
            step="0.1"
            placeholder="misal 72"
            value={formData.shirt_length}
            onChange={(e) =>
              setFormData({ ...formData, shirt_length: e.target.value })
            }
            disabled={isSubmitting}
          />
          <Input
            label="Lingkar Leher (cm)"
            type="number"
            step="0.1"
            placeholder="misal 40"
            value={formData.neck}
            onChange={(e) =>
              setFormData({ ...formData, neck: e.target.value })
            }
            disabled={isSubmitting}
          />
          <Input
            label="Kerung Lengan (cm)"
            type="number"
            step="0.1"
            placeholder="misal 48"
            value={formData.armhole}
            onChange={(e) =>
              setFormData({ ...formData, armhole: e.target.value })
            }
            disabled={isSubmitting}
          />
        </div>

        <div className="flex flex-col gap-1.5 pt-1">
          <label className="text-xs font-semibold text-slate-700">
            Catatan Khusus Fitting / Postur
          </label>
          <textarea
            rows={2}
            placeholder="Contoh: Bahu kanan sedikit turun, perut agak buncit..."
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
            disabled={isSubmitting}
            className="w-full rounded-lg border border-slate-300 bg-white text-slate-900 text-sm p-3 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 disabled:bg-slate-50 transition-colors"
          />
        </div>
      </form>
    </Modal>
  )
}

export default MeasurementModal
