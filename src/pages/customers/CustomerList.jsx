import React, { useState, useEffect, useCallback } from 'react'
import {
  Users,
  Search,
  Plus,
  Edit2,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Eye,
} from 'lucide-react'
import customerApi from '../../api/customers'
import { formatDate } from '../../utils/formatters'
import { useToast } from '../../context/ToastContext'
import PageHeader from '../../components/layout/PageHeader'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from '../../components/ui/Table'
import Pagination from '../../components/ui/Pagination'
import { TableSkeleton } from '../../components/ui/Skeleton'
import EmptyState from '../../components/ui/EmptyState'
import ErrorState from '../../components/ui/ErrorState'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import CustomerModal from './CustomerModal'
import CustomerDetailModal from './CustomerDetailModal'

export function CustomerList() {
  const [customers, setCustomers] = useState([])
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    total_pages: 1,
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState(null)

  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [detailCustomer, setDetailCustomer] = useState(null)

  const [customerToDelete, setCustomerToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const { success, error: toastError } = useToast()

  const fetchCustomers = useCallback(
    async (page = 1, search = searchQuery) => {
      try {
        setIsLoading(true)
        setError(null)
        const res = await customerApi.getCustomers({
          page,
          limit: pagination.limit,
          search: search || undefined,
        })

        if (res.success) {
          setCustomers(res.data || [])
          if (res.pagination) {
            setPagination(res.pagination)
          }
        }
      } catch (err) {
        setError(err.message || 'Gagal mengambil data pelanggan')
      } finally {
        setIsLoading(false)
      }
    },
    [pagination.limit, searchQuery]
  )

  useEffect(() => {
    fetchCustomers(pagination.page, searchQuery)
  }, [pagination.page, searchQuery, fetchCustomers])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    setSearchQuery(searchTerm)
    setPagination((prev) => ({ ...prev, page: 1 }))
  }

  const handleClearSearch = () => {
    setSearchTerm('')
    setSearchQuery('')
    setPagination((prev) => ({ ...prev, page: 1 }))
  }

  const handleOpenCreate = () => {
    setSelectedCustomer(null)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (customer) => {
    setSelectedCustomer(customer)
    setIsModalOpen(true)
  }

  const handleOpenDetail = (customer) => {
    setDetailCustomer(customer)
    setIsDetailOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!customerToDelete) return
    try {
      setIsDeleting(true)
      await customerApi.deleteCustomer(customerToDelete.id)
      success(
        `Pelanggan ${customerToDelete.full_name} berhasil dihapus`,
        'Terhapus'
      )
      setCustomerToDelete(null)
      fetchCustomers(pagination.page)
    } catch (err) {
      toastError(err.message || 'Gagal menghapus data pelanggan')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Daftar Pelanggan"
        subtitle="Kelola data pelanggan, kontak, dan alamat untuk pemesanan jahitan"
        breadcrumbs={[
          { label: 'Dashboard', to: '/dashboard' },
          { label: 'Customers' },
        ]}
        action={
          <Button size="sm" icon={Plus} onClick={handleOpenCreate}>
            Tambah Pelanggan
          </Button>
        }
      />

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
              placeholder="Cari nama, nomor telepon, atau email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white text-slate-900 text-sm pl-9 pr-20 py-2 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-colors"
            />
            <div className="absolute right-1.5 flex items-center gap-1">
              {searchTerm && (
                <button
                  type="button"
                  onClick={handleClearSearch}
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
            Pelanggan
          </div>
        </div>

        {isLoading ? (
          <TableSkeleton rows={5} cols={5} />
        ) : error ? (
          <ErrorState message={error} onRetry={() => fetchCustomers(pagination.page)} />
        ) : customers.length === 0 ? (
          <EmptyState
            icon={Users}
            title={
              searchQuery
                ? `Tidak ditemukan pelanggan dengan kata kunci "${searchQuery}"`
                : 'Belum ada data pelanggan'
            }
            description={
              searchQuery
                ? 'Silakan coba kata kunci lain atau bersihkan pencarian.'
                : 'Mulai daftarkan pelanggan pertama Anda untuk membuat order.'
            }
            actionLabel={searchQuery ? 'Hapus Pencarian' : 'Tambah Pelanggan Baru'}
            onAction={searchQuery ? handleClearSearch : handleOpenCreate}
          />
        ) : (
          <>
            <Table>
              <TableHead>
                <TableRow hover={false}>
                  <TableHeaderCell className="pl-6 w-28">Kode</TableHeaderCell>
                  <TableHeaderCell>Nama Pelanggan</TableHeaderCell>
                  <TableHeaderCell>Kontak</TableHeaderCell>
                  <TableHeaderCell className="hidden md:table-cell">
                    Alamat
                  </TableHeaderCell>
                  <TableHeaderCell className="hidden lg:table-cell">
                    Tgl Terdaftar
                  </TableHeaderCell>
                  <TableHeaderCell align="right" className="pr-6 w-32">
                    Aksi
                  </TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {customers.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="pl-6 font-semibold text-blue-700 text-xs">
                      <button
                        type="button"
                        onClick={() => handleOpenDetail(c)}
                        className="hover:underline font-mono text-left cursor-pointer"
                      >
                        {c.customer_code || `CUS-${c.id}`}
                      </button>
                    </TableCell>

                    <TableCell>
                      <button
                        type="button"
                        onClick={() => handleOpenDetail(c)}
                        className="font-medium text-slate-900 hover:text-blue-600 transition-colors text-left cursor-pointer"
                      >
                        {c.full_name}
                      </button>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-1 text-xs">
                        {c.phone && (
                          <div className="flex items-center gap-1.5 text-slate-600">
                            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{c.phone}</span>
                          </div>
                        )}
                        {c.email && (
                          <div className="flex items-center gap-1.5 text-slate-500">
                            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate max-w-[180px]">
                              {c.email}
                            </span>
                          </div>
                        )}
                        {!c.phone && !c.email && (
                          <span className="text-slate-400">-</span>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="hidden md:table-cell text-xs text-slate-600 max-w-xs">
                      {c.address ? (
                        <div className="flex items-start gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                          <span className="line-clamp-2">{c.address}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </TableCell>

                    <TableCell className="hidden lg:table-cell text-xs text-slate-500">
                      {formatDate(c.created_at)}
                    </TableCell>

                    <TableCell align="right" className="pr-6">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenDetail(c)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Lihat Detail Pelanggan"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(c)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Edit Pelanggan"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setCustomerToDelete(c)}
                          className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Hapus Pelanggan"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
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

      <CustomerDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        customer={detailCustomer}
        onEdit={(cust) => {
          setSelectedCustomer(cust)
          setIsModalOpen(true)
        }}
      />

      <CustomerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        customer={selectedCustomer}
        onSuccess={() => fetchCustomers(pagination.page)}
      />

      <ConfirmDialog
        isOpen={Boolean(customerToDelete)}
        onClose={() => setCustomerToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Hapus Data Pelanggan"
        message={`Apakah Anda yakin ingin menghapus pelanggan "${customerToDelete?.full_name}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmLabel="Hapus Pelanggan"
        isLoading={isDeleting}
      />
    </div>
  )
}

export default CustomerList
