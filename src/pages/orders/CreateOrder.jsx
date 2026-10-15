import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import {
  ShoppingBag,
  Plus,
  Trash2,
  Calendar,
  AlertCircle,
  ArrowLeft,
  Check,
} from 'lucide-react'
import orderApi from '../../api/orders'
import customerApi from '../../api/customers'
import employeeApi from '../../api/employees'
import serviceApi from '../../api/services'
import { formatCurrency, toInputDate } from '../../utils/formatters'
import { useToast } from '../../context/ToastContext'
import PageHeader from '../../components/layout/PageHeader'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'

export function CreateOrder() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { success, error: toastError } = useToast()

  const [customers, setCustomers] = useState([])
  const [employees, setEmployees] = useState([])
  const [services, setServices] = useState([])
  const [isLoadingMaster, setIsLoadingMaster] = useState(true)

  const [customerId, setCustomerId] = useState(
    () => searchParams.get('customer_id') || ''
  )
  const [employeeId, setEmployeeId] = useState('')
  const [orderDate, setOrderDate] = useState(() => toInputDate(new Date()))
  const [pickupDate, setPickupDate] = useState(() => {
    const nextWeek = new Date()
    nextWeek.setDate(nextWeek.getDate() + 7)
    return toInputDate(nextWeek)
  })
  const [notes, setNotes] = useState('')

  const [details, setDetails] = useState([{ service_id: '', qty: 1 }])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formErrors, setFormErrors] = useState({})

  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        setIsLoadingMaster(true)
        const [cRes, eRes, sRes] = await Promise.all([
          customerApi.getCustomers({ limit: 100 }),
          employeeApi.getEmployees({ limit: 100 }),
          serviceApi.getServices({ limit: 100 }),
        ])

        if (cRes.success) setCustomers(cRes.data || [])
        if (eRes.success) setEmployees(eRes.data || [])
        if (sRes.success) setServices(sRes.data || [])
      } catch (err) {
        toastError('Gagal memuat daftar master data: ' + err.message)
      } finally {
        setIsLoadingMaster(false)
      }
    }

    fetchMasterData()
  }, [])

  const handleAddDetail = () => {
    setDetails([...details, { service_id: '', qty: 1 }])
  }

  const handleRemoveDetail = (index) => {
    if (details.length <= 1) return
    setDetails(details.filter((_, i) => i !== index))
  }

  const handleDetailChange = (index, field, value) => {
    const updated = [...details]
    updated[index][field] = value
    setDetails(updated)
  }

  const calculateTotal = () => {
    return details.reduce((sum, item) => {
      if (!item.service_id) return sum
      const svc = services.find((s) => s.id === Number(item.service_id))
      const price = svc ? Number(svc.price) : 0
      const qty = Number(item.qty) || 0
      return sum + price * qty
    }, 0)
  }

  const validate = () => {
    const errors = {}
    if (!customerId) errors.customer_id = 'Pilih pelanggan yang memesan'
    if (!employeeId) errors.employee_id = 'Pilih karyawan penanggung jawab'
    if (!orderDate) errors.order_date = 'Tanggal order wajib diisi'
    if (!pickupDate) errors.pickup_date = 'Tanggal rencana ambil wajib diisi'

    const hasInvalidDetail = details.some(
      (d) => !d.service_id || !d.qty || Number(d.qty) < 1
    )
    if (hasInvalidDetail) {
      errors.details = 'Pilih layanan dan tentukan jumlah (qty) minimal 1'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    try {
      setIsSubmitting(true)

      const payload = {
        customer_id: Number(customerId),
        employee_id: Number(employeeId),
        order_date: orderDate,
        pickup_date: pickupDate,
        notes: notes.trim() || undefined,
        details: details.map((d) => ({
          service_id: Number(d.service_id),
          qty: Number(d.qty),
        })),
      }

      const res = await orderApi.createOrder(payload)
      if (res.success && res.data?.id) {
        success('Order berhasil dibuat', 'Sukses')
        navigate(`/orders/${res.data.id}`)
      }
    } catch (err) {
      toastError(err.message || 'Gagal membuat order')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="Buat Order Baru"
        subtitle="Daftarkan pesanan jahit baru lengkap dengan rincian layanan dan jadwal pengerjaan"
        breadcrumbs={[
          { label: 'Dashboard', to: '/dashboard' },
          { label: 'Orders', to: '/orders' },
          { label: 'Buat Order' },
        ]}
        action={
          <Link to="/orders">
            <Button variant="outline" size="sm" icon={ArrowLeft}>
              Kembali
            </Button>
          </Link>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card title="Informasi Pemesan & Penjahit">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Select
              label="Pelanggan"
              required
              placeholder="-- Pilih Pelanggan --"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              error={formErrors.customer_id}
              disabled={isLoadingMaster || isSubmitting}
            >
              <option value="">-- Pilih Pelanggan --</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.full_name} ({c.phone || c.customer_code || `#${c.id}`})
                </option>
              ))}
            </Select>

            <Select
              label="Karyawan / Penjahit PIC"
              required
              placeholder="-- Pilih Karyawan --"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              error={formErrors.employee_id}
              disabled={isLoadingMaster || isSubmitting}
            >
              <option value="">-- Pilih Karyawan --</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.full_name} ({emp.position_name || 'Staff'})
                </option>
              ))}
            </Select>
          </div>
        </Card>

        <Card title="Jadwal Pengerjaan & Catatan">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input
              label="Tanggal Masuk Order"
              type="date"
              required
              value={orderDate}
              onChange={(e) => setOrderDate(e.target.value)}
              error={formErrors.order_date}
              disabled={isSubmitting}
            />

            <Input
              label="Target Tanggal Pengambilan (Pickup)"
              type="date"
              required
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              error={formErrors.pickup_date}
              disabled={isSubmitting}
            />
          </div>

          <div className="mt-5">
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">
              Catatan Order (Opsional)
            </label>
            <textarea
              rows={3}
              placeholder="Contoh: Model kerah shanghai, bahan dari pelanggan, furing silk..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={isSubmitting}
              className="w-full rounded-lg border border-slate-300 bg-white text-slate-900 text-sm p-3 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 disabled:bg-slate-50 transition-colors"
            />
          </div>
        </Card>

        <Card
          title="Rincian Layanan Jahitan"
          subtitle="Tentukan item pakaian, tipe layanan, dan jumlah potong"
          action={
            <Button
              type="button"
              variant="outline"
              size="sm"
              icon={Plus}
              onClick={handleAddDetail}
              disabled={isSubmitting}
            >
              Tambah Item
            </Button>
          }
        >
          {formErrors.details && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs font-medium text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{formErrors.details}</span>
            </div>
          )}

          <div className="space-y-4">
            {details.map((item, idx) => {
              const selectedSvc = services.find(
                (s) => s.id === Number(item.service_id)
              )
              const price = selectedSvc ? Number(selectedSvc.price) : 0
              const subtotal = price * (Number(item.qty) || 0)

              return (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center gap-3.5"
                >
                  <div className="flex-1 w-full">
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Layanan #{idx + 1}
                    </label>
                    <select
                      value={item.service_id}
                      onChange={(e) =>
                        handleDetailChange(idx, 'service_id', e.target.value)
                      }
                      disabled={isSubmitting}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                    >
                      <option value="">-- Pilih Layanan Jahit --</option>
                      {services.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.service_name} ({formatCurrency(s.price)})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="w-24">
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Jumlah (Qty)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={item.qty}
                      onChange={(e) =>
                        handleDetailChange(idx, 'qty', e.target.value)
                      }
                      disabled={isSubmitting}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                    />
                  </div>

                  <div className="w-32">
                    <span className="text-xs font-medium text-slate-400 block mb-1">
                      Subtotal
                    </span>
                    <span className="text-sm font-bold text-slate-900 block py-2">
                      {formatCurrency(subtotal)}
                    </span>
                  </div>

                  {details.length > 1 && (
                    <div className="sm:mt-5">
                      <button
                        type="button"
                        onClick={() => handleRemoveDetail(idx)}
                        disabled={isSubmitting}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Hapus baris"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 block">
                Total Estimasi Biaya
              </span>
              <span className="text-xl sm:text-2xl font-bold text-slate-900">
                {formatCurrency(calculateTotal())}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Link to="/orders">
                <Button variant="outline" size="md" disabled={isSubmitting}>
                  Batal
                </Button>
              </Link>
              <Button
                type="submit"
                size="md"
                isLoading={isSubmitting}
                disabled={isSubmitting}
                icon={Check}
              >
                Simpan & Buat Order
              </Button>
            </div>
          </div>
        </Card>
      </form>
    </div>
  )
}

export default CreateOrder
