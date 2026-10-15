import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  ShoppingBag,
  Plus,
  Edit2,
  ExternalLink,
} from 'lucide-react'
import Modal from '../../components/ui/Modal'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { formatDate } from '../../utils/formatters'

export function CustomerDetailModal({
  isOpen,
  onClose,
  customer,
  onEdit,
}) {
  const navigate = useNavigate()

  if (!customer) return null

  const handleCreateOrder = () => {
    onClose()
    navigate(`/orders/new?customer_id=${customer.id}`)
  }

  const handleViewOrders = () => {
    onClose()
    navigate(`/orders?search=${encodeURIComponent(customer.full_name)}`)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detail Informasi Pelanggan"
      maxWidth="max-w-lg"
    >
      <div className="space-y-6">
        <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
          <div className="w-14 h-14 rounded-full bg-blue-600 text-white font-bold text-xl flex items-center justify-center shrink-0 shadow-sm">
            {customer.full_name?.charAt(0).toUpperCase() || 'C'}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h4 className="text-base font-bold text-slate-900 truncate">
                {customer.full_name}
              </h4>
              <Badge variant="primary" size="sm">
                {customer.customer_code || `CUS-${customer.id}`}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              Terdaftar sejak {formatDate(customer.created_at)}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Informasi Kontak & Alamat
          </h5>

          <div className="grid grid-cols-1 gap-2.5">
            <div className="flex items-start gap-3 p-3 rounded-lg border border-slate-200/80 bg-white">
              <Phone className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <span className="text-[11px] font-medium text-slate-400 block">
                  Nomor Telepon / WhatsApp
                </span>
                {customer.phone ? (
                  <div className="flex items-center justify-between gap-2 mt-0.5">
                    <span className="text-sm font-semibold text-slate-800">
                      {customer.phone}
                    </span>
                    <a
                      href={`https://wa.me/${customer.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                    >
                      Hubungi <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ) : (
                  <span className="text-xs text-slate-400 italic">
                    Belum ditambahkan
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg border border-slate-200/80 bg-white">
              <Mail className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <span className="text-[11px] font-medium text-slate-400 block">
                  Email
                </span>
                {customer.email ? (
                  <div className="flex items-center justify-between gap-2 mt-0.5">
                    <span className="text-sm font-medium text-slate-800 truncate">
                      {customer.email}
                    </span>
                    <a
                      href={`mailto:${customer.email}`}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      Kirim <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ) : (
                  <span className="text-xs text-slate-400 italic">
                    Belum ditambahkan
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg border border-slate-200/80 bg-white">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <span className="text-[11px] font-medium text-slate-400 block">
                  Alamat Lengkap
                </span>
                <p className="text-sm text-slate-700 mt-0.5 whitespace-pre-line">
                  {customer.address || (
                    <span className="text-slate-400 italic">
                      Belum ada alamat tersimpan
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              size="sm"
              icon={Edit2}
              onClick={() => {
                onClose()
                if (onEdit) onEdit(customer)
              }}
              className="w-full sm:w-auto"
            >
              Ubah Data
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              icon={ShoppingBag}
              onClick={handleViewOrders}
              className="w-full sm:w-auto"
            >
              Riwayat Pesanan
            </Button>
          </div>

          <Button
            type="button"
            size="sm"
            icon={Plus}
            onClick={handleCreateOrder}
            className="w-full sm:w-auto"
          >
            Buat Pesanan
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default CustomerDetailModal
