import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  CreditCard,
  Search,
  Plus,
} from 'lucide-react'
import paymentApi from '../../api/payments'
import orderApi from '../../api/orders'
import { formatCurrency, formatDate } from '../../utils/formatters'
import {
  PAYMENT_STATUS_CONFIG,
  PAYMENT_METHOD_OPTIONS,
} from '../../utils/statusConfig'
import PageHeader from '../../components/layout/PageHeader'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeaderCell,
  TableCell,
} from '../../components/ui/Table'
import Pagination from '../../components/ui/Pagination'
import { TableSkeleton } from '../../components/ui/Skeleton'
import EmptyState from '../../components/ui/EmptyState'
import ErrorState from '../../components/ui/ErrorState'
import CreatePaymentModal from './CreatePaymentModal'

export function PaymentList() {
  const [payments, setPayments] = useState([])
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    total_pages: 1,
  })

  const [searchTerm, setSearchTerm] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [paymentStatus, setPaymentStatus] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false)
  const [unpaidOrders, setUnpaidOrders] = useState([])
  const [selectedOrderForPayment, setSelectedOrderForPayment] = useState(null)

  const fetchPayments = useCallback(
    async (
      page = 1,
      search = searchQuery,
      method = paymentMethod,
      status = paymentStatus
    ) => {
      try {
        setIsLoading(true)
        setError(null)

        const params = {
          page,
          limit: pagination.limit,
          search: search || undefined,
          payment_method: method || undefined,
          payment_status: status || undefined,
        }

        const res = await paymentApi.getPayments(params)

        if (res.success) {
          setPayments(res.data || [])
          if (res.pagination) {
            setPagination(res.pagination)
          }
        }
      } catch (err) {
        setError(err.message || 'Gagal mengambil data pembayaran')
      } finally {
        setIsLoading(false)
      }
    },
    [pagination.limit, searchQuery, paymentMethod, paymentStatus]
  )

  useEffect(() => {
    fetchPayments(pagination.page, searchQuery, paymentMethod, paymentStatus)
  }, [pagination.page, searchQuery, paymentMethod, paymentStatus, fetchPayments])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    setSearchQuery(searchTerm)
    setPagination((prev) => ({ ...prev, page: 1 }))
  }

  const handleResetFilters = () => {
    setSearchTerm('')
    setSearchQuery('')
    setPaymentMethod('')
    setPaymentStatus('')
    setPagination((prev) => ({ ...prev, page: 1 }))
  }

  const handleOpenRecordPayment = async () => {
    try {
      const res = await orderApi.getOrders({ limit: 50 })
      if (res.success) {
        const activeOrders = (res.data || []).filter(
          (o) => o.status !== 'Cancelled'
        )
        setUnpaidOrders(activeOrders)
        if (activeOrders.length > 0) {
          setSelectedOrderForPayment(activeOrders[0])
          setIsRecordModalOpen(true)
        } else {
          alert('Tidak ada order aktif untuk dicatat pembayaran.')
        }
      }
    } catch (err) {
      alert('Gagal mengambil daftar order: ' + err.message)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Daftar Pembayaran"
        subtitle="Riwayat transaksi pembayaran pesanan, kas masuk, dan bukti pembayaran"
        breadcrumbs={[
          { label: 'Dashboard', to: '/dashboard' },
          { label: 'Payments' },
        ]}
        action={
          <Button size="sm" icon={Plus} onClick={handleOpenRecordPayment}>
            Catat Pembayaran
          </Button>
        }
      />

      <Card bodyClassName="p-0" className="overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <form
            onSubmit={handleSearchSubmit}
            className="w-full md:max-w-xs relative flex items-center"
          >
            <div className="absolute left-3 text-slate-400 pointer-events-none">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Cari invoice pesanan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white text-slate-900 text-sm pl-9 pr-16 py-2 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-colors"
            />
            <button
              type="submit"
              className="absolute right-1.5 px-2.5 py-1 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors cursor-pointer"
            >
              Cari
            </button>
          </form>

          <div className="flex flex-wrap items-center gap-2.5">
            <select
              value={paymentMethod}
              onChange={(e) => {
                setPaymentMethod(e.target.value)
                setPagination((prev) => ({ ...prev, page: 1 }))
              }}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Semua Metode</option>
              {PAYMENT_METHOD_OPTIONS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>

            <select
              value={paymentStatus}
              onChange={(e) => {
                setPaymentStatus(e.target.value)
                setPagination((prev) => ({ ...prev, page: 1 }))
              }}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Semua Status</option>
              <option value="Paid">Paid (Lunas)</option>
              <option value="Pending">Pending (Belum Lunas)</option>
            </select>

            {(searchQuery || paymentMethod || paymentStatus) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetFilters}
                className="text-xs text-slate-500"
              >
                Reset
              </Button>
            )}

            <div className="text-xs text-slate-500 ml-auto md:ml-2">
              Total:{' '}
              <strong className="font-semibold text-slate-800">
                {pagination.total}
              </strong>{' '}
              Transaksi
            </div>
          </div>
        </div>

        {isLoading ? (
          <TableSkeleton rows={5} cols={6} />
        ) : error ? (
          <ErrorState message={error} onRetry={() => fetchPayments(pagination.page)} />
        ) : payments.length === 0 ? (
          <EmptyState
            icon={CreditCard}
            title={
              searchQuery || paymentMethod || paymentStatus
                ? 'Tidak ada transaksi yang cocok dengan filter'
                : 'Belum ada transaksi pembayaran'
            }
            description={
              searchQuery || paymentMethod || paymentStatus
                ? 'Silakan ubah filter atau kata kunci pencarian Anda.'
                : 'Catat pembayaran pertama dari pesanan yang sedang berjalan.'
            }
            actionLabel={
              searchQuery || paymentMethod || paymentStatus
                ? 'Reset Filter'
                : 'Catat Pembayaran Baru'
            }
            onAction={
              searchQuery || paymentMethod || paymentStatus
                ? handleResetFilters
                : handleOpenRecordPayment
            }
          />
        ) : (
          <>
            <Table>
              <TableHead>
                <TableRow hover={false}>
                  <TableHeaderCell className="pl-6 w-24">ID</TableHeaderCell>
                  <TableHeaderCell>No. Invoice</TableHeaderCell>
                  <TableHeaderCell>Tanggal Bayar</TableHeaderCell>
                  <TableHeaderCell>Metode</TableHeaderCell>
                  <TableHeaderCell className="text-right">Nominal</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                  <TableHeaderCell align="right" className="pr-6 w-24">
                    Order
                  </TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payments.map((p) => {
                  const statusConf =
                    PAYMENT_STATUS_CONFIG[p.payment_status] ||
                    PAYMENT_STATUS_CONFIG.Pending

                  return (
                    <TableRow key={p.id}>
                      <TableCell className="pl-6 font-medium text-slate-400 text-xs">
                        #{p.id}
                      </TableCell>

                      <TableCell>
                        <Link
                          to={`/orders/${p.order_id}`}
                          className="font-bold text-slate-900 hover:text-blue-600 transition-colors"
                        >
                          {p.invoice_number || `Order #${p.order_id}`}
                        </Link>
                      </TableCell>

                      <TableCell className="text-xs text-slate-600">
                        {formatDate(p.payment_date)}
                      </TableCell>

                      <TableCell>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">
                          {p.payment_method}
                        </span>
                      </TableCell>

                      <TableCell className="text-right font-bold text-emerald-700 text-sm">
                        {formatCurrency(p.amount)}
                      </TableCell>

                      <TableCell>
                        <Badge variant={statusConf.variant} dot size="sm">
                          {statusConf.label}
                        </Badge>
                      </TableCell>

                      <TableCell align="right" className="pr-6">
                        <Link
                          to={`/orders/${p.order_id}`}
                          className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                        >
                          Lihat Order
                        </Link>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>

            <Pagination
              page={pagination.page}
              totalPages={pagination.total_pages}
              total={pagination.total}
              limit={pagination.limit}
              onPageChange={(newPage) =>
                setPagination((prev) => ({ ...prev, page: newPage }))
              }
            />
          </>
        )}
      </Card>

      {selectedOrderForPayment && (
        <CreatePaymentModal
          isOpen={isRecordModalOpen}
          onClose={() => {
            setIsRecordModalOpen(false)
            setSelectedOrderForPayment(null)
          }}
          orderId={selectedOrderForPayment.id}
          orderInvoice={selectedOrderForPayment.invoice_number}
          remainingBalance={selectedOrderForPayment.total_amount}
          onSuccess={() => fetchPayments(pagination.page)}
        />
      )}
    </div>
  )
}

export default PaymentList
