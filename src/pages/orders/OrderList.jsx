import React, { useState, useEffect, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  ShoppingBag,
  Search,
  Plus,
  Eye,
  User,
  Clock,
} from 'lucide-react'
import orderApi from '../../api/orders'
import { formatCurrency, formatDate } from '../../utils/formatters'
import { ORDER_STATUS_CONFIG } from '../../utils/statusConfig'
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

const STATUS_FILTERS = [
  'All',
  'Pending',
  'Measurement',
  'Cutting',
  'Sewing',
  'Finishing',
  'Ready Pickup',
  'Completed',
  'Cancelled',
]

export function OrderList() {
  const [searchParams] = useSearchParams()
  const initialSearch = searchParams.get('search') || ''
  const initialStatus = searchParams.get('status') || 'All'

  const [orders, setOrders] = useState([])
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    total_pages: 1,
  })
  const [statusFilter, setStatusFilter] = useState(initialStatus)
  const [searchTerm, setSearchTerm] = useState(initialSearch)
  const [searchQuery, setSearchQuery] = useState(initialSearch)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchOrders = useCallback(
    async (page = 1, status = statusFilter, search = searchQuery) => {
      try {
        setIsLoading(true)
        setError(null)

        const params = {
          page,
          limit: pagination.limit,
          status: status !== 'All' ? status : undefined,
          search: search || undefined,
        }

        const res = await orderApi.getOrders(params)

        if (res.success) {
          setOrders(res.data || [])
          if (res.pagination) {
            setPagination(res.pagination)
          }
        }
      } catch (err) {
        setError(err.message || 'Gagal mengambil daftar order')
      } finally {
        setIsLoading(false)
      }
    },
    [pagination.limit, statusFilter, searchQuery]
  )

  useEffect(() => {
    fetchOrders(pagination.page, statusFilter, searchQuery)
  }, [pagination.page, statusFilter, searchQuery, fetchOrders])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    setSearchQuery(searchTerm)
    setPagination((prev) => ({ ...prev, page: 1 }))
  }

  const handleStatusChange = (newStatus) => {
    setStatusFilter(newStatus)
    setPagination((prev) => ({ ...prev, page: 1 }))
  }

  const handleClearFilters = () => {
    setSearchTerm('')
    setSearchQuery('')
    setStatusFilter('All')
    setPagination((prev) => ({ ...prev, page: 1 }))
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Daftar Order"
        subtitle="Kelola seluruh pesanan pakaian kustom, jadwal pengambilan, dan alur pengerjaan"
        breadcrumbs={[
          { label: 'Dashboard', to: '/dashboard' },
          { label: 'Orders' },
        ]}
        action={
          <Link to="/orders/new">
            <Button size="sm" icon={Plus}>
              Buat Order Baru
            </Button>
          </Link>
        }
      />

      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {STATUS_FILTERS.map((st) => {
          const isActive = statusFilter === st
          return (
            <button
              key={st}
              type="button"
              onClick={() => handleStatusChange(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {st === 'All' ? 'Semua Status' : st}
            </button>
          )
        })}
      </div>

      <Card bodyClassName="p-0" className="overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <form
            onSubmit={handleSearchSubmit}
            className="w-full sm:max-w-md relative flex items-center"
          >
            <div className="absolute left-3 text-slate-400 pointer-events-none">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Cari invoice, nama pelanggan, atau penjahit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white text-slate-900 text-sm pl-9 pr-20 py-2 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-colors"
            />
            <div className="absolute right-1.5 flex items-center gap-1">
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="px-2 py-1 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  Batal
                </button>
              )}
              <button
                type="submit"
                className="px-2.5 py-1 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors cursor-pointer"
              >
                Cari
              </button>
            </div>
          </form>

          <div className="text-xs text-slate-500 self-end sm:self-center">
            Total:{' '}
            <strong className="font-semibold text-slate-800">
              {pagination.total}
            </strong>{' '}
            Pesanan
          </div>
        </div>

        {isLoading ? (
          <TableSkeleton rows={5} cols={6} />
        ) : error ? (
          <ErrorState message={error} onRetry={() => fetchOrders(pagination.page)} />
        ) : orders.length === 0 ? (
          <EmptyState
            icon={ShoppingBag}
            title={
              searchQuery || statusFilter !== 'All'
                ? 'Tidak ada order yang cocok dengan filter'
                : 'Belum ada order pesanan'
            }
            description={
              searchQuery || statusFilter !== 'All'
                ? 'Coba ganti kata kunci pencarian atau pilih tab status lain.'
                : 'Buat order pertama Anda sekarang dengan mengklik tombol di bawah.'
            }
            actionLabel={
              searchQuery || statusFilter !== 'All'
                ? 'Reset Filter'
                : 'Buat Order Baru'
            }
            onAction={
              searchQuery || statusFilter !== 'All'
                ? handleClearFilters
                : undefined
            }
          />
        ) : (
          <>
            <Table>
              <TableHead>
                <TableRow hover={false}>
                  <TableHeaderCell className="pl-6 w-36">No. Invoice</TableHeaderCell>
                  <TableHeaderCell>Pelanggan</TableHeaderCell>
                  <TableHeaderCell>Penjahit / PIC</TableHeaderCell>
                  <TableHeaderCell className="hidden md:table-cell">
                    Jadwal (Ambil)
                  </TableHeaderCell>
                  <TableHeaderCell>Total Biaya</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                  <TableHeaderCell align="right" className="pr-6 w-24">
                    Aksi
                  </TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => {
                  const statusConf = ORDER_STATUS_CONFIG[order.status] || {
                    variant: 'neutral',
                    label: order.status,
                  }

                  return (
                    <TableRow key={order.id}>
                      <TableCell className="pl-6 font-bold text-slate-900 text-xs">
                        <Link
                          to={`/orders/${order.id}`}
                          className="hover:text-blue-600 transition-colors"
                        >
                          {order.invoice_number}
                        </Link>
                      </TableCell>

                      <TableCell>
                        <div className="font-semibold text-slate-800">
                          {order.customer_name || '-'}
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-1.5 text-xs text-slate-600">
                          <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{order.employee_name || '-'}</span>
                        </div>
                      </TableCell>

                      <TableCell className="hidden md:table-cell text-xs">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{formatDate(order.pickup_date)}</span>
                          </div>
                          <div className="text-[11px] text-slate-400">
                            Order: {formatDate(order.order_date)}
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="font-bold text-slate-900 text-sm">
                        {formatCurrency(order.total_amount)}
                      </TableCell>

                      <TableCell>
                        <Badge variant={statusConf.variant} dot size="sm">
                          {statusConf.label}
                        </Badge>
                      </TableCell>

                      <TableCell align="right" className="pr-6">
                        <Link to={`/orders/${order.id}`}>
                          <Button variant="outline" size="sm" icon={Eye}>
                            Detail
                          </Button>
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
    </div>
  )
}

export default OrderList
