import React, { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ShoppingBag,
  ArrowLeft,
  Calendar,
  Phone,
  Ruler,
  CreditCard,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react'
import orderApi from '../../api/orders'
import orderDetailApi from '../../api/orderDetails'
import measurementApi from '../../api/measurements'
import { formatCurrency, formatDate } from '../../utils/formatters'
import {
  ORDER_STATUS_CONFIG,
  ORDER_STATUS_TRANSITIONS,
  PAYMENT_STATUS_CONFIG,
} from '../../utils/statusConfig'
import { useToast } from '../../context/ToastContext'
import PageHeader from '../../components/layout/PageHeader'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Skeleton from '../../components/ui/Skeleton'
import ErrorState from '../../components/ui/ErrorState'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import MeasurementModal from './MeasurementModal'
import CreatePaymentModal from '../payments/CreatePaymentModal'
import OrderDetailItemModal from './OrderDetailItemModal'

export function OrderDetail() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [paymentSummary, setPaymentSummary] = useState(null)
  const [payments, setPayments] = useState([])
  const [statusHistory, setStatusHistory] = useState([])
  const [measurement, setMeasurement] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
  const [pendingStatusChange, setPendingStatusChange] = useState(null)

  const [isMeasurementModalOpen, setIsMeasurementModalOpen] = useState(false)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [isItemModalOpen, setIsItemModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [itemToDelete, setItemToDelete] = useState(null)
  const [isDeletingItem, setIsDeletingItem] = useState(false)

  const { success, error: toastError } = useToast()

  const fetchOrderData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const [orderRes, summaryRes, payRes, histRes] = await Promise.all([
        orderApi.getOrderById(id),
        orderApi.getPaymentSummary(id).catch(() => ({ success: false })),
        orderApi.getPayments(id).catch(() => ({ success: false })),
        orderApi.getStatusHistory(id).catch(() => ({ success: false })),
      ])

      if (orderRes.success) {
        setOrder(orderRes.data)
      } else {
        throw new Error(orderRes.message || 'Order tidak ditemukan')
      }

      if (summaryRes.success) setPaymentSummary(summaryRes.data)
      if (payRes.success) setPayments(payRes.data?.payments || [])
      if (histRes.success) setStatusHistory(histRes.data?.history || [])

      try {
        const measRes = await measurementApi.getByOrderId(id)
        if (measRes.success) {
          setMeasurement(measRes.data)
        }
      } catch {
        setMeasurement(null)
      }
    } catch (err) {
      console.error(err)
      setError(err.message || 'Gagal memuat detail order')
    } finally {
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchOrderData()
  }, [fetchOrderData])

  const handleStatusChangeConfirm = async () => {
    if (!pendingStatusChange) return
    try {
      setIsUpdatingStatus(true)
      await orderApi.updateOrderStatus(id, pendingStatusChange)
      success(
        `Status order berhasil diubah menjadi ${pendingStatusChange}`,
        'Status Diperbarui'
      )
      setPendingStatusChange(null)
      fetchOrderData()
    } catch (err) {
      toastError(err.message || 'Gagal memperbarui status order')
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  const handleDeleteItemConfirm = async () => {
    if (!itemToDelete) return
    try {
      setIsDeletingItem(true)
      await orderDetailApi.deleteOrderDetail(itemToDelete.id)
      success('Item berhasil dihapus dari order', 'Terhapus')
      setItemToDelete(null)
      fetchOrderData()
    } catch (err) {
      toastError(err.message || 'Gagal menghapus item')
    } finally {
      setIsDeletingItem(false)
    }
  }

  if (isLoading && !order) {
    return (
      <div className="space-y-6">
        <PageHeader title="Detail Order" />
        <Card bodyClassName="p-6">
          <Skeleton className="h-6 w-48 mb-4" />
          <Skeleton className="h-24 w-full mb-6" />
          <Skeleton className="h-40 w-full" />
        </Card>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="space-y-6">
        <PageHeader title="Detail Order" />
        <Card>
          <ErrorState message={error} onRetry={fetchOrderData} />
        </Card>
      </div>
    )
  }

  const statusConfig = ORDER_STATUS_CONFIG[order.status] || {
    label: order.status,
    variant: 'neutral',
  }
  const nextAllowedStatuses = ORDER_STATUS_TRANSITIONS[order.status] || []
  const isOrderClosed = order.status === 'Completed' || order.status === 'Cancelled'

  const remainingBalance = paymentSummary
    ? paymentSummary.remaining
    : Math.max(
        Number(order.total_amount || 0) -
          payments.reduce((sum, p) => sum + Number(p.amount || 0), 0),
        0
      )

  const paymentStatusConf =
    PAYMENT_STATUS_CONFIG[paymentSummary?.payment_status || (remainingBalance === 0 ? 'Paid' : 'Unpaid')] ||
    PAYMENT_STATUS_CONFIG.Pending

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader
        title={order.invoice_number}
        subtitle={`Order #${order.id} dibuat pada ${formatDate(order.order_date)}`}
        breadcrumbs={[
          { label: 'Dashboard', to: '/dashboard' },
          { label: 'Orders', to: '/orders' },
          { label: order.invoice_number },
        ]}
        action={
          <div className="flex items-center gap-2">
            <Link to="/orders">
              <Button variant="outline" size="sm" icon={ArrowLeft}>
                Kembali ke Daftar
              </Button>
            </Link>
          </div>
        }
      />

      <Card bodyClassName="p-5 sm:p-6" className="bg-white border-slate-200/80">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-lg font-bold text-slate-900">
                  {order.invoice_number}
                </h2>
                <Badge variant={statusConfig.variant} dot size="md">
                  {statusConfig.label}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Target Pickup:{' '}
                <strong className="text-slate-800 font-semibold">
                  {formatDate(order.pickup_date)}
                </strong>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
            {nextAllowedStatuses.length > 0 ? (
              <>
                <span className="text-xs font-semibold text-slate-500 mr-1">
                  Ubah Alur:
                </span>
                {nextAllowedStatuses.map((nextSt) => {
                  const isCancel = nextSt === 'Cancelled'
                  return (
                    <Button
                      key={nextSt}
                      variant={isCancel ? 'danger-outline' : 'primary'}
                      size="sm"
                      onClick={() => setPendingStatusChange(nextSt)}
                      disabled={isUpdatingStatus}
                    >
                      {isCancel ? 'Batalkan Order' : `Lanjut ke ${nextSt}`}
                    </Button>
                  )
                })}
              </>
            ) : (
              <span className="text-xs font-medium text-slate-400 italic">
                {order.status === 'Completed'
                  ? '✓ Order telah selesai'
                  : 'Order telah dibatalkan'}
              </span>
            )}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card title="Data Pelanggan" subtitle="Pihak pemesan jahitan">
          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Nama Pelanggan:</span>
              <span className="font-semibold text-slate-900 text-sm">
                {order.customer_name || '-'}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Telepon / WA:</span>
              <span className="font-medium text-slate-800 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                {order.customer_phone || '-'}
              </span>
            </div>
            {order.customer_id && (
              <div className="pt-1">
                <Link
                  to="/customers"
                  className="text-xs font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <span>Buka Data Pelanggan</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            )}
          </div>
        </Card>

        <Card title="Informasi Pengerjaan" subtitle="PIC & Catatan Khusus">
          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Penjahit PIC:</span>
              <span className="font-semibold text-slate-900">
                {order.employee_name || '-'}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Tanggal Order:</span>
              <span className="font-medium text-slate-800">
                {formatDate(order.order_date)}
              </span>
            </div>
            <div className="py-1">
              <span className="text-slate-500 block mb-1">Catatan Order:</span>
              <p className="text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100 leading-relaxed italic">
                {order.notes || 'Tidak ada catatan khusus.'}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card
        title="Rincian Item & Layanan Jahitan"
        subtitle="Layanan kustom yang dikerjakan pada invoice ini"
        action={
          !isOrderClosed && (
            <Button
              variant="outline"
              size="sm"
              icon={Plus}
              onClick={() => {
                setSelectedItem(null)
                setIsItemModalOpen(true)
              }}
            >
              Tambah Item
            </Button>
          )
        }
      >
        {!order.details || order.details.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">
            Belum ada rincian item pada order ini.
          </p>
        ) : (
          <div className="overflow-x-auto -mx-5 sm:-mx-6 -my-5 sm:-my-6">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3 sm:px-6">Layanan</th>
                  <th className="px-4 py-3 text-center">Jumlah</th>
                  <th className="px-4 py-3 text-right">Harga Satuan</th>
                  <th className="px-4 py-3 text-right">Subtotal</th>
                  {!isOrderClosed && (
                    <th className="px-5 py-3 sm:px-6 text-right w-20">Aksi</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {order.details.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80">
                    <td className="px-5 py-3.5 sm:px-6 font-semibold text-slate-900">
                      {item.service_name || `Layanan #${item.service_id}`}
                    </td>
                    <td className="px-4 py-3.5 text-center text-slate-700">
                      {item.qty} potong
                    </td>
                    <td className="px-4 py-3.5 text-right text-slate-600">
                      {formatCurrency(item.price)}
                    </td>
                    <td className="px-4 py-3.5 text-right font-bold text-slate-900">
                      {formatCurrency(item.subtotal)}
                    </td>
                    {!isOrderClosed && (
                      <td className="px-5 py-3.5 sm:px-6 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedItem(item)
                              setIsItemModalOpen(true)
                            }}
                            className="p-1 text-slate-400 hover:text-blue-600 rounded-md cursor-pointer"
                            title="Edit Item"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setItemToDelete(item)}
                            className="p-1 text-slate-400 hover:text-red-600 rounded-md cursor-pointer"
                            title="Hapus Item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-50/60 font-semibold text-slate-900 border-t border-slate-200">
                <tr>
                  <td colSpan={3} className="px-5 py-3.5 sm:px-6 text-right text-xs">
                    Total Biaya Keseluruhan:
                  </td>
                  <td className="px-4 py-3.5 text-right text-base text-blue-700 font-bold">
                    {formatCurrency(order.total_amount)}
                  </td>
                  {!isOrderClosed && <td />}
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </Card>

      <Card
        title="Ukuran Badan (Fitting)"
        subtitle="Data pengukuran tubuh pelanggan untuk penjahitan akurat"
        action={
          <Button
            variant="outline"
            size="sm"
            icon={measurement ? Edit2 : Ruler}
            onClick={() => setIsMeasurementModalOpen(true)}
          >
            {measurement ? 'Ubah Ukuran' : 'Catat Ukuran'}
          </Button>
        }
      >
        {measurement ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[11px]">Lingkar Dada</span>
                <span className="font-bold text-slate-800 text-sm">
                  {measurement.chest ? `${measurement.chest} cm` : '-'}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[11px]">
                  Lingkar Pinggang
                </span>
                <span className="font-bold text-slate-800 text-sm">
                  {measurement.waist ? `${measurement.waist} cm` : '-'}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[11px]">
                  Lingkar Pinggul
                </span>
                <span className="font-bold text-slate-800 text-sm">
                  {measurement.hip ? `${measurement.hip} cm` : '-'}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[11px]">Lebar Bahu</span>
                <span className="font-bold text-slate-800 text-sm">
                  {measurement.shoulder ? `${measurement.shoulder} cm` : '-'}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[11px]">
                  Panjang Lengan
                </span>
                <span className="font-bold text-slate-800 text-sm">
                  {measurement.sleeve_length
                    ? `${measurement.sleeve_length} cm`
                    : '-'}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[11px]">Panjang Baju</span>
                <span className="font-bold text-slate-800 text-sm">
                  {measurement.shirt_length
                    ? `${measurement.shirt_length} cm`
                    : '-'}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[11px]">Lingkar Leher</span>
                <span className="font-bold text-slate-800 text-sm">
                  {measurement.neck ? `${measurement.neck} cm` : '-'}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[11px]">Kerung Lengan</span>
                <span className="font-bold text-slate-800 text-sm">
                  {measurement.armhole ? `${measurement.armhole} cm` : '-'}
                </span>
              </div>
            </div>

            {measurement.notes && (
              <div className="text-xs bg-blue-50/50 p-3 rounded-xl border border-blue-100 text-slate-700">
                <span className="font-semibold text-blue-900 block mb-0.5">
                  Catatan Fitting:
                </span>
                {measurement.notes}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-6 border border-dashed border-slate-200 rounded-xl">
            <Ruler className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs text-slate-500 mb-3">
              Ukuran badan belum dicatat untuk pesanan ini.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsMeasurementModalOpen(true)}
            >
              Catat Ukuran Sekarang
            </Button>
          </div>
        )}
      </Card>

      <Card
        title="Status Pembayaran & Riwayat Kas"
        subtitle="Rincian pelunasan biaya pesanan"
        action={
          remainingBalance > 0 &&
          !isOrderClosed && (
            <Button
              size="sm"
              icon={CreditCard}
              onClick={() => setIsPaymentModalOpen(true)}
            >
              Catat Pembayaran
            </Button>
          )
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60">
            <span className="text-xs font-medium text-slate-500 block">
              Total Tagihan
            </span>
            <span className="text-lg font-bold text-slate-900 mt-1 block">
              {formatCurrency(order.total_amount)}
            </span>
          </div>

          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-emerald-700">
                Sudah Dibayar
              </span>
              <Badge variant={paymentStatusConf.variant} size="sm" dot>
                {paymentStatusConf.label}
              </Badge>
            </div>
            <span className="text-lg font-bold text-emerald-800 mt-1 block">
              {formatCurrency(paymentSummary?.total_paid || 0)}
            </span>
          </div>

          <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40">
            <span className="text-xs font-medium text-amber-700 block">
              Sisa Tagihan
            </span>
            <span className="text-lg font-bold text-amber-900 mt-1 block">
              {formatCurrency(remainingBalance)}
            </span>
          </div>
        </div>

        <div className="mt-4">
          <h4 className="text-xs font-semibold uppercase text-slate-400 tracking-wider mb-2">
            Riwayat Transaksi Masuk
          </h4>
          {payments.length === 0 ? (
            <p className="text-xs text-slate-400 py-3 text-center border rounded-lg bg-slate-50/50">
              Belum ada pencatatan pembayaran untuk order ini.
            </p>
          ) : (
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                  <tr>
                    <th className="px-4 py-2.5">Tanggal</th>
                    <th className="px-4 py-2.5">Metode</th>
                    <th className="px-4 py-2.5 text-right">Nominal</th>
                    <th className="px-4 py-2.5 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {payments.map((p) => (
                    <tr key={p.id}>
                      <td className="px-4 py-2.5 text-slate-700 font-medium">
                        {formatDate(p.payment_date)}
                      </td>
                      <td className="px-4 py-2.5 text-slate-600">
                        {p.payment_method}
                      </td>
                      <td className="px-4 py-2.5 text-right font-bold text-emerald-700">
                        {formatCurrency(p.amount)}
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        <Badge
                          variant={
                            p.payment_status === 'Paid' ? 'success' : 'warning'
                          }
                          size="sm"
                        >
                          {p.payment_status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Card>

      <Card
        title="Riwayat Status Produksi"
        subtitle="Jejak audit alur pengerjaan dan perubahan status"
      >
        {statusHistory.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">
            Belum ada riwayat perubahan status tercatat.
          </p>
        ) : (
          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {statusHistory.map((item, idx) => {
              const isLatest = idx === statusHistory.length - 1
              const stConf = ORDER_STATUS_CONFIG[item.status] || {
                variant: 'neutral',
                label: item.status,
              }

              return (
                <div key={item.id || idx} className="relative flex items-start gap-4">
                  <div
                    className={`absolute -left-6 top-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center shrink-0 ${
                      isLatest
                        ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                        : 'bg-slate-300 text-slate-600'
                    }`}
                  >
                    <CheckCircle2 className="w-3 h-3" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Badge variant={stConf.variant} size="sm">
                        {stConf.label}
                      </Badge>
                      {isLatest && (
                        <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                          Status Terkini
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(item.created_at, true)}</span>
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Card>

      <ConfirmDialog
        isOpen={Boolean(pendingStatusChange)}
        onClose={() => setPendingStatusChange(null)}
        onConfirm={handleStatusChangeConfirm}
        title="Konfirmasi Perubahan Status"
        message={`Apakah Anda yakin ingin memperbarui status order ini menjadi "${pendingStatusChange}"?`}
        confirmLabel={`Ya, Ubah ke ${pendingStatusChange}`}
        isDestructive={pendingStatusChange === 'Cancelled'}
        isLoading={isUpdatingStatus}
      />

      <MeasurementModal
        isOpen={isMeasurementModalOpen}
        onClose={() => setIsMeasurementModalOpen(false)}
        orderId={id}
        initialMeasurement={measurement}
        onSuccess={fetchOrderData}
      />

      <CreatePaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        orderId={id}
        orderInvoice={order.invoice_number}
        remainingBalance={remainingBalance}
        onSuccess={fetchOrderData}
      />

      <OrderDetailItemModal
        isOpen={isItemModalOpen}
        onClose={() => setIsItemModalOpen(false)}
        orderId={id}
        item={selectedItem}
        onSuccess={fetchOrderData}
      />

      <ConfirmDialog
        isOpen={Boolean(itemToDelete)}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleDeleteItemConfirm}
        title="Hapus Item Layanan"
        message={`Hapus layanan "${itemToDelete?.service_name}" dari order ini? Total tagihan akan dikalkulasi ulang.`}
        confirmLabel="Hapus Item"
        isLoading={isDeletingItem}
      />
    </div>
  )
}

export default OrderDetail
