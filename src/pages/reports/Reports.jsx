import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  BarChart3,
  TrendingUp,
  Receipt,
  CreditCard,
  DollarSign,
  AlertCircle,
  ShoppingBag,
  Calendar,
  Download,
  Printer,
  RefreshCw,
  ArrowDownLeft,
  ChevronRight,
} from 'lucide-react'
import reportApi from '../../api/reports'
import { formatCurrency, formatDate, toInputDate } from '../../utils/formatters'
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
import EmptyState from '../../components/ui/EmptyState'
import ErrorState from '../../components/ui/ErrorState'
import { TableSkeleton } from '../../components/ui/Skeleton'

export function Reports() {
  const [activeTab, setActiveTab] = useState('sales')

  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [activePreset, setActivePreset] = useState('all')

  const [salesData, setSalesData] = useState({
    summary: { total_orders: 0, total_revenue: 0 },
    orders: [],
  })
  const [paymentData, setPaymentData] = useState({
    summary: {
      total_orders: 0,
      total_revenue: 0,
      total_payments: 0,
      total_paid: 0,
      outstanding: 0,
    },
    payments: [],
  })

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchReports = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const params = {}
      if (startDate) params.start_date = startDate
      if (endDate) params.end_date = endDate

      if (activeTab === 'sales') {
        const res = await reportApi.getSalesReport(params)
        if (res.success && res.data) {
          setSalesData(res.data)
        }
      } else {
        const res = await reportApi.getPaymentReport(params)
        if (res.success && res.data) {
          setPaymentData(res.data)
        }
      }
    } catch (err) {
      setError(err.message || 'Gagal memuat data laporan')
    } finally {
      setIsLoading(false)
    }
  }, [activeTab, startDate, endDate])

  useEffect(() => {
    fetchReports()
  }, [fetchReports])

  const handleApplyPreset = (preset) => {
    setActivePreset(preset)
    const now = new Date()

    if (preset === 'today') {
      const todayStr = toInputDate(now)
      setStartDate(todayStr)
      setEndDate(todayStr)
    } else if (preset === '7days') {
      const past = new Date()
      past.setDate(now.getDate() - 7)
      setStartDate(toInputDate(past))
      setEndDate(toInputDate(now))
    } else if (preset === 'month') {
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
      setStartDate(toInputDate(firstDay))
      setEndDate(toInputDate(now))
    } else {
      setStartDate('')
      setEndDate('')
    }
  }

  const handleExportSalesCSV = () => {
    if (!salesData.orders.length) return
    const headers = ['No Invoice', 'Tanggal Pesanan', 'Pelanggan', 'Staf Penjahit', 'Status', 'Total Tagihan']
    const rows = salesData.orders.map((o) => [
      `"${o.invoice_number}"`,
      `"${o.order_date}"`,
      `"${o.customer_name || '-'}"`,
      `"${o.employee_name || '-'}"`,
      `"${o.status}"`,
      Number(o.total_amount || 0),
    ])
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `laporan-penjualan-mm-tailor-${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleExportPaymentCSV = () => {
    if (!paymentData.payments.length) return
    const headers = ['No Invoice', 'Tanggal Bayar', 'Metode Pembayaran', 'Status', 'Jumlah Bayar', 'Total Nilai Pesanan']
    const rows = paymentData.payments.map((p) => [
      `"${p.invoice_number || '-'}"`,
      `"${p.payment_date}"`,
      `"${p.payment_method}"`,
      `"${p.payment_status}"`,
      Number(p.amount || 0),
      Number(p.total_amount || 0),
    ])
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `laporan-pembayaran-mm-tailor-${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handlePrint = () => {
    window.print()
  }

  const avgOrderValue =
    salesData.summary.total_orders > 0
      ? salesData.summary.total_revenue / salesData.summary.total_orders
      : 0

  return (
    <div className="space-y-6">
      <PageHeader
        title="Laporan & Rekapitulasi"
        subtitle="Analisis performa penjualan, penerimaan kas, dan sisa piutang operasional"
        breadcrumbs={[
          { label: 'Dashboard', to: '/dashboard' },
          { label: 'Laporan' },
        ]}
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={Download}
              onClick={activeTab === 'sales' ? handleExportSalesCSV : handleExportPaymentCSV}
            >
              Ekspor CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon={Printer}
              onClick={handlePrint}
            >
              Cetak Laporan
            </Button>
          </div>
        }
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab('sales')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'sales'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Laporan Penjualan
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('payments')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'payments'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Laporan Pembayaran & Kas
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-slate-500 mr-1">Filter Periode:</span>
          <button
            type="button"
            onClick={() => handleApplyPreset('all')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              activePreset === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Semua
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset('month')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              activePreset === 'month'
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Bulan Ini
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset('7days')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              activePreset === '7days'
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            7 Hari Terakhir
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset('today')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              activePreset === 'today'
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Hari Ini
          </button>
        </div>
      </div>

      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span className="font-medium">Rentang Kustom:</span>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value)
              setActivePreset('custom')
            }}
            className="text-xs bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <span className="text-xs text-slate-400">s/d</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value)
              setActivePreset('custom')
            }}
            className="text-xs bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        {(startDate || endDate) && (
          <button
            type="button"
            onClick={() => handleApplyPreset('all')}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium cursor-pointer ml-auto"
          >
            Reset Rentang
          </button>
        )}
      </div>

      {activeTab === 'sales' ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="border-l-4 border-l-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Total Volume Pesanan
                  </p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    {salesData.summary.total_orders}{' '}
                    <span className="text-sm font-normal text-slate-500">
                      Pesanan
                    </span>
                  </p>
                </div>
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                  <ShoppingBag className="w-6 h-6" />
                </div>
              </div>
            </Card>

            <Card className="border-l-4 border-l-emerald-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Total Omzet Penjualan
                  </p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    {formatCurrency(salesData.summary.total_revenue)}
                  </p>
                </div>
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>
            </Card>

            <Card className="border-l-4 border-l-indigo-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Rata-rata Nilai Pesanan
                  </p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    {formatCurrency(avgOrderValue)}
                  </p>
                </div>
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Receipt className="w-6 h-6" />
                </div>
              </div>
            </Card>
          </div>

          <Card bodyClassName="p-0" className="overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                Daftar Transaksi Pesanan
              </h3>
              <span className="text-xs text-slate-500">
                {salesData.orders.length} transaksi tercatat
              </span>
            </div>

            {isLoading ? (
              <TableSkeleton rows={5} cols={6} />
            ) : error ? (
              <ErrorState message={error} onRetry={fetchReports} />
            ) : salesData.orders.length === 0 ? (
              <EmptyState
                icon={ShoppingBag}
                title="Tidak ada data penjualan pada periode ini"
                description="Ubah filter tanggal atau buat pesanan baru untuk melihat laporan."
              />
            ) : (
              <Table>
                <TableHead>
                  <TableRow hover={false}>
                    <TableHeaderCell className="pl-6 w-36">No. Invoice</TableHeaderCell>
                    <TableHeaderCell>Tanggal</TableHeaderCell>
                    <TableHeaderCell>Pelanggan</TableHeaderCell>
                    <TableHeaderCell>Penjahit / PIC</TableHeaderCell>
                    <TableHeaderCell>Status</TableHeaderCell>
                    <TableHeaderCell align="right" className="pr-6">
                      Total Tagihan
                    </TableHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {salesData.orders.map((order) => {
                    const statusCfg = ORDER_STATUS_CONFIG[order.status] || {
                      label: order.status,
                      variant: 'default',
                    }
                    return (
                      <TableRow key={order.id}>
                        <TableCell className="pl-6 font-semibold text-blue-700 text-xs">
                          <Link
                            to={`/orders/${order.id}`}
                            className="hover:underline flex items-center gap-1 font-mono"
                          >
                            <span>{order.invoice_number}</span>
                            <ChevronRight className="w-3 h-3 text-slate-400" />
                          </Link>
                        </TableCell>
                        <TableCell className="text-xs text-slate-600">
                          {formatDate(order.order_date)}
                        </TableCell>
                        <TableCell className="font-medium text-slate-900 text-xs">
                          {order.customer_name || '-'}
                        </TableCell>
                        <TableCell className="text-xs text-slate-600">
                          {order.employee_name || '-'}
                        </TableCell>
                        <TableCell>
                          <Badge variant={statusCfg.variant} size="sm">
                            {statusCfg.label}
                          </Badge>
                        </TableCell>
                        <TableCell align="right" className="pr-6 font-bold text-slate-900 text-xs">
                          {formatCurrency(order.total_amount)}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )}
          </Card>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-l-4 border-l-blue-500">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Target Tagihan
              </p>
              <p className="text-xl font-bold text-slate-900 mt-1">
                {formatCurrency(paymentData.summary.total_revenue)}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Total seluruh order non-batal
              </p>
            </Card>

            <Card className="border-l-4 border-l-emerald-500">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Kas Masuk (Terbayar)
              </p>
              <p className="text-xl font-bold text-emerald-600 mt-1">
                {formatCurrency(paymentData.summary.total_paid)}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                {paymentData.summary.total_payments} kali transaksi pembayaran
              </p>
            </Card>

            <Card className="border-l-4 border-l-rose-500">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Sisa Piutang Berjalan
              </p>
              <p className="text-xl font-bold text-rose-600 mt-1">
                {formatCurrency(paymentData.summary.outstanding)}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Tagihan belum dilunasi
              </p>
            </Card>

            <Card className="border-l-4 border-l-purple-500">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Tingkat Pelunasan
              </p>
              <p className="text-xl font-bold text-purple-600 mt-1">
                {paymentData.summary.total_revenue > 0
                  ? Math.round(
                      (paymentData.summary.total_paid /
                        paymentData.summary.total_revenue) *
                        100
                    )
                  : 0}
                %
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Rasio pembayaran vs tagihan
              </p>
            </Card>
          </div>

          <Card bodyClassName="p-0" className="overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                Rincian Arus Pembayaran
              </h3>
              <span className="text-xs text-slate-500">
                {paymentData.payments.length} transaksi pembayaran tercatat
              </span>
            </div>

            {isLoading ? (
              <TableSkeleton rows={5} cols={6} />
            ) : error ? (
              <ErrorState message={error} onRetry={fetchReports} />
            ) : paymentData.payments.length === 0 ? (
              <EmptyState
                icon={CreditCard}
                title="Tidak ada data pembayaran pada periode ini"
                description="Ubah filter tanggal atau catat pembayaran baru untuk melihat laporan."
              />
            ) : (
              <Table>
                <TableHead>
                  <TableRow hover={false}>
                    <TableHeaderCell className="pl-6 w-36">No. Invoice</TableHeaderCell>
                    <TableHeaderCell>Tanggal Bayar</TableHeaderCell>
                    <TableHeaderCell>Metode Pembayaran</TableHeaderCell>
                    <TableHeaderCell>Status</TableHeaderCell>
                    <TableHeaderCell align="right">Nilai Tagihan</TableHeaderCell>
                    <TableHeaderCell align="right" className="pr-6">
                      Jumlah Terbayar
                    </TableHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paymentData.payments.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="pl-6 font-semibold text-blue-700 text-xs">
                        {p.order_id ? (
                          <Link
                            to={`/orders/${p.order_id}`}
                            className="hover:underline flex items-center gap-1 font-mono"
                          >
                            <span>{p.invoice_number || `ORD-${p.order_id}`}</span>
                            <ChevronRight className="w-3 h-3 text-slate-400" />
                          </Link>
                        ) : (
                          <span className="font-mono text-slate-500">
                            {p.invoice_number || '-'}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-slate-600">
                        {formatDate(p.payment_date)}
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700">
                          {p.payment_method}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={p.payment_status === 'Paid' ? 'success' : 'warning'}
                          size="sm"
                        >
                          {p.payment_status}
                        </Badge>
                      </TableCell>
                      <TableCell align="right" className="text-xs text-slate-500">
                        {formatCurrency(p.total_amount)}
                      </TableCell>
                      <TableCell align="right" className="pr-6 font-bold text-emerald-600 text-xs">
                        +{formatCurrency(p.amount)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Card>
        </div>
      )}
    </div>
  )
}

export default Reports
