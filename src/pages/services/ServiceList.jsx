import React, { useState, useEffect, useCallback } from 'react'
import {
  Scissors,
  Search,
  Plus,
  Edit2,
  Trash2,
  Clock,
  Tag,
} from 'lucide-react'
import serviceApi from '../../api/services'
import { formatCurrency, formatDate } from '../../utils/formatters'
import { useToast } from '../../context/ToastContext'
import PageHeader from '../../components/layout/PageHeader'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
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
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import ServiceModal from './ServiceModal'

export function ServiceList() {
  const [services, setServices] = useState([])
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
  const [selectedService, setSelectedService] = useState(null)
  const [serviceToDelete, setServiceToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const { success, error: toastError } = useToast()

  const fetchServices = useCallback(
    async (page = 1, search = searchQuery) => {
      try {
        setIsLoading(true)
        setError(null)
        const res = await serviceApi.getServices({
          page,
          limit: pagination.limit,
          search: search || undefined,
        })

        if (res.success) {
          setServices(res.data || [])
          if (res.pagination) {
            setPagination(res.pagination)
          }
        }
      } catch (err) {
        setError(err.message || 'Gagal memuat katalog layanan jahit')
      } finally {
        setIsLoading(false)
      }
    },
    [pagination.limit, searchQuery]
  )

  useEffect(() => {
    fetchServices(pagination.page, searchQuery)
  }, [pagination.page, searchQuery, fetchServices])

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
    setSelectedService(null)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (svc) => {
    setSelectedService(svc)
    setIsModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!serviceToDelete) return
    try {
      setIsDeleting(true)
      await serviceApi.deleteService(serviceToDelete.id)
      success(
        `Layanan "${serviceToDelete.service_name}" berhasil dihapus`,
        'Terhapus'
      )
      setServiceToDelete(null)
      fetchServices(pagination.page)
    } catch (err) {
      toastError(err.message || 'Gagal menghapus layanan jahit')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Katalog Layanan Jahit"
        subtitle="Kelola daftar jenis jahitan, tarif harga, dan estimasi waktu pengerjaan"
        breadcrumbs={[
          { label: 'Dashboard', to: '/dashboard' },
          { label: 'Layanan' },
        ]}
        action={
          <Button size="sm" icon={Plus} onClick={handleOpenCreate}>
            Tambah Layanan
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
              placeholder="Cari nama layanan atau spesifikasi..."
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
            Layanan
          </div>
        </div>

        {isLoading ? (
          <TableSkeleton rows={5} cols={5} />
        ) : error ? (
          <ErrorState message={error} onRetry={() => fetchServices(pagination.page)} />
        ) : services.length === 0 ? (
          <EmptyState
            icon={Scissors}
            title={
              searchQuery
                ? `Tidak ditemukan layanan dengan kata kunci "${searchQuery}"`
                : 'Belum ada data layanan jahit'
            }
            description={
              searchQuery
                ? 'Silakan coba kata kunci lain atau bersihkan pencarian.'
                : 'Mulai daftarkan layanan jahit untuk digunakan pada pembuatan order.'
            }
            actionLabel={searchQuery ? 'Hapus Pencarian' : 'Tambah Layanan Baru'}
            onAction={searchQuery ? handleClearSearch : handleOpenCreate}
          />
        ) : (
          <>
            <Table>
              <TableHead>
                <TableRow hover={false}>
                  <TableHeaderCell className="pl-6 w-20">ID</TableHeaderCell>
                  <TableHeaderCell>Nama Layanan</TableHeaderCell>
                  <TableHeaderCell>Tarif Harga</TableHeaderCell>
                  <TableHeaderCell>Estimasi</TableHeaderCell>
                  <TableHeaderCell className="hidden md:table-cell">
                    Keterangan
                  </TableHeaderCell>
                  <TableHeaderCell align="right" className="pr-6 w-28">
                    Aksi
                  </TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {services.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="pl-6 font-semibold text-slate-500 text-xs font-mono">
                      #{s.id}
                    </TableCell>

                    <TableCell>
                      <div className="font-semibold text-slate-900 text-xs">
                        {s.service_name}
                      </div>
                    </TableCell>

                    <TableCell className="text-xs font-bold text-slate-900">
                      {formatCurrency(s.price)}
                    </TableCell>

                    <TableCell>
                      <div className="inline-flex items-center gap-1 text-xs text-slate-600 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{s.estimated_days} Hari</span>
                      </div>
                    </TableCell>

                    <TableCell className="hidden md:table-cell text-xs text-slate-500 max-w-xs truncate">
                      {s.description || '-'}
                    </TableCell>

                    <TableCell align="right" className="pr-6">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(s)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Edit Layanan"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setServiceToDelete(s)}
                          className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Hapus Layanan"
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

      <ServiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        service={selectedService}
        onSuccess={() => fetchServices(pagination.page)}
      />

      <ConfirmDialog
        isOpen={Boolean(serviceToDelete)}
        onClose={() => setServiceToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Hapus Layanan Jahit"
        message={`Apakah Anda yakin ingin menghapus layanan "${serviceToDelete?.service_name}"? Item order yang telah menggunakan layanan ini tetap akan mencatat data harga sebelumnya.`}
        confirmLabel="Hapus Layanan"
        isLoading={isDeleting}
      />
    </div>
  )
}

export default ServiceList
