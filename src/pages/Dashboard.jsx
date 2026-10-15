import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  TrendingUp,
  CreditCard,
  AlertCircle,
  ShoppingBag,
  Users,
  UserCheck,
  Plus,
  ArrowRight,
  Filter,
  BarChart3,
} from 'lucide-react'
import dashboardApi from '../api/dashboard'
import orderApi from '../api/orders'
import { formatCurrency, formatDate } from '../utils/formatters'
import { ORDER_STATUS_CONFIG } from '../utils/statusConfig'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Skeleton from '../components/ui/Skeleton'
import ErrorState from '../components/ui/ErrorState'
import PageHeader from '../components/layout/PageHeader'

export function Dashboard() {
  const [data, setData] = useState(null)
  const [recentOrders, setRecentOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const fetchDashboardData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const params = {}
      if (startDate) params.start_date = startDate
      if (endDate) params.end_date = endDate

      const [dashRes, ordersRes] = await Promise.all([
        dashboardApi.getSummary(params),
        orderApi.getOrders({ limit: 5 }),
      ])

      if (dashRes.success) {
        setData(dashRes.data)
      }
      if (ordersRes.success) {
        setRecentOrders(ordersRes.data || [])
      }
    } catch (err) {
      console.error(err)
      setError(err.message || 'Gagal memuat ringkasan dashboard')
    } finally {
      setIsLoading(false)
    }
  }, [startDate, endDate])

  useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  const handleResetFilter = () => {
    setStartDate('')
    setEndDate('')
  }

  if (error && !data) {
    return (
      <div>
        <PageHeader
          title="Dashboard"
          subtitle="Ringkasan operasional dan keuangan MM Tailor"
        />
        <Card>
          <ErrorState message={error} onRetry={fetchDashboardData} />
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        subtitle="Ringkasan operasional dan performa bisnis MM Tailor"
        action={
          <div className="flex items-center gap-2">
            <Link to="/reports">
              <Button variant="outline" size="sm" icon={BarChart3}>
                Lihat Laporan
              </Button>
            </Link>
            <Link to="/orders/new">
              <Button size="sm" icon={Plus}>
                Buat Order Baru
              </Button>
            </Link>
          </div>
        }
      />

      <Card
        bodyClassName="p-4"
        className="bg-white border border-slate-200/80"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <Filter className="w-4 h-4 text-slate-400" />
            <span>Filter Periode:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                aria-label="Tanggal mulai"
              />
              <span className="text-slate-400">-</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                aria-label="Tanggal akhir"
              />
            </div>

            {(startDate || endDate) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetFilter}
                className="text-xs text-slate-500 hover:text-slate-700"
              >
                Reset
              </Button>
            )}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} bodyClassName="p-5">
              <Skeleton className="h-4 w-24 mb-3" />
              <Skeleton className="h-7 w-36 mb-2" />
              <Skeleton className="h-3 w-28" />
            </Card>
          ))
        ) : (
          <>
            <Card bodyClassName="p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">
                  Total Pendapatan
                </span>
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <h4 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  {formatCurrency(data?.financial?.revenue || 0)}
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Dari seluruh order aktif
                </p>
              </div>
            </Card>

            <Card bodyClassName="p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">
                  Pembayaran Diterima
                </span>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                  <CreditCard className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <h4 className="text-xl sm:text-2xl font-bold text-emerald-700 tracking-tight">
                  {formatCurrency(data?.financial?.payments || 0)}
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Dana kas yang telah masuk
                </p>
              </div>
            </Card>

            <Card bodyClassName="p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">
                  Sisa Piutang
                </span>
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
                  <AlertCircle className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <h4 className="text-xl sm:text-2xl font-bold text-amber-700 tracking-tight">
                  {formatCurrency(data?.financial?.outstanding || 0)}
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Belum dilunasi oleh pelanggan
                </p>
              </div>
            </Card>

            <Card bodyClassName="p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">
                  Total Order
                </span>
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
                  <ShoppingBag className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <h4 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  {data?.orders?.total ?? 0} Order
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Total pesanan jahitan
                </p>
              </div>
            </Card>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card
          title="Status Produksi Order"
          subtitle="Distribusi tahap pengerjaan pakaian"
          className="lg:col-span-2"
        >
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
            </div>
          ) : !data?.orders?.by_status?.length ? (
            <p className="text-xs text-slate-400 py-4 text-center">
              Belum ada data status order.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {data.orders.by_status.map((item) => {
                const conf = ORDER_STATUS_CONFIG[item.status] || {
                  label: item.status,
                  bg: 'bg-slate-50',
                  text: 'text-slate-700',
                  border: 'border-slate-200',
                  dot: 'bg-slate-400',
                }

                return (
                  <div
                    key={item.status}
                    className={`p-3.5 rounded-xl border ${conf.border} ${conf.bg} flex items-center justify-between`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${conf.dot}`} />
                        <span className={`text-xs font-medium ${conf.text}`}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                    <span className="text-lg font-bold text-slate-900">
                      {item.total}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </Card>

        <Card title="Informasi Entitas" subtitle="Data master aktif pada sistem">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <div className="space-y-3">
              <Link
                to="/customers"
                className="p-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-800 block">
                      Total Pelanggan
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Kelola kontak & pesanan
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-bold text-slate-900">
                    {data?.master_data?.customers ?? 0}
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                </div>
              </Link>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-800 block">
                      Karyawan & Penjahit
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Tenaga kerja operasional
                    </span>
                  </div>
                </div>
                <span className="text-base font-bold text-slate-900">
                  {data?.master_data?.employees ?? 0}
                </span>
              </div>
            </div>
          )}
        </Card>
      </div>

      <Card
        title="Order Terbaru"
        subtitle="Daftar pesanan jahitan yang baru ditambahkan"
        action={
          <Link
            to="/orders"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>Lihat Semua Order</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        }
      >
        {isLoading ? (
          <div className="space-y-3 py-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : recentOrders.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">
            Belum ada order yang tercatat.
          </p>
        ) : (
          <div className="overflow-x-auto -mx-5 sm:-mx-6 -my-5 sm:-my-6">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3 sm:px-6">Invoice</th>
                  <th className="px-4 py-3">Pelanggan</th>
                  <th className="px-4 py-3">Tgl Ambil</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-5 py-3 sm:px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {recentOrders.map((order) => {
                  const statusConf = ORDER_STATUS_CONFIG[order.status] || {
                    variant: 'neutral',
                    label: order.status,
                  }
                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="px-5 py-3.5 sm:px-6 font-semibold text-slate-900">
                        {order.invoice_number}
                      </td>
                      <td className="px-4 py-3.5 text-slate-700 font-medium">
                        {order.customer_name || '-'}
                      </td>
                      <td className="px-4 py-3.5 text-slate-500 text-xs">
                        {formatDate(order.pickup_date)}
                      </td>
                      <td className="px-4 py-3.5 font-semibold text-slate-800">
                        {formatCurrency(order.total_amount)}
                      </td>
                      <td className="px-4 py-3.5">
                        <Badge variant={statusConf.variant} dot size="sm">
                          {statusConf.label}
                        </Badge>
                      </td>
                      <td className="px-5 py-3.5 sm:px-6 text-right">
                        <Link
                          to={`/orders/${order.id}`}
                          className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          Detail
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}

export default Dashboard
