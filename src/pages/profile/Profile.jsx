import React, { useEffect } from 'react'
import { Mail, Phone, Shield, Briefcase, LogOut, RefreshCw } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import PageHeader from '../../components/layout/PageHeader'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'

export function Profile() {
  const { user, refreshUser, logout, isLoading } = useAuth()

  useEffect(() => {
    refreshUser()
  }, [refreshUser])

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <PageHeader
        title="Profil Pengguna"
        subtitle="Informasi akun pengguna dan identitas tenaga kerja MM Tailor"
        breadcrumbs={[
          { label: 'Dashboard', to: '/dashboard' },
          { label: 'Profil' },
        ]}
        action={
          <Button
            variant="outline"
            size="sm"
            icon={RefreshCw}
            onClick={refreshUser}
            isLoading={isLoading}
          >
            Muat Ulang
          </Button>
        }
      />

      <Card bodyClassName="p-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pb-6 border-b border-slate-100 text-center sm:text-left">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white font-bold text-2xl flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
            {user?.employee_name
              ? user.employee_name.charAt(0).toUpperCase()
              : user?.username?.charAt(0).toUpperCase() || 'U'}
          </div>

          <div className="flex-1">
            <h2 className="text-xl font-bold text-slate-900">
              {user?.employee_name || user?.username}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Username: <span className="font-mono font-medium">@{user?.username}</span>
            </p>
            <div className="mt-2.5 flex items-center justify-center sm:justify-start gap-2">
              <Badge variant="info" dot size="md">
                Role: {user?.role || 'Staff'}
              </Badge>
              {user?.employee_id && (
                <span className="text-xs text-slate-400">
                  ID Karyawan: #{user.employee_id}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="py-6 space-y-4 text-xs">
          <h3 className="font-semibold text-slate-400 uppercase tracking-wider text-[11px]">
            Data Akun & Kontak
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
              <span className="text-slate-400 block mb-1">Peran Akun (Role)</span>
              <div className="flex items-center gap-2 font-semibold text-slate-900 text-sm">
                <Shield className="w-4 h-4 text-blue-600" />
                <span>{user?.role || 'Staff'}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
              <span className="text-slate-400 block mb-1">Status Karyawan</span>
              <div className="flex items-center gap-2 font-semibold text-slate-900 text-sm">
                <Briefcase className="w-4 h-4 text-indigo-600" />
                <span>{user?.employee_name ? 'Terhubung' : 'Akun Sistem'}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
              <span className="text-slate-400 block mb-1">Email Terdaftar</span>
              <div className="flex items-center gap-2 font-medium text-slate-800 text-xs">
                <Mail className="w-4 h-4 text-slate-400" />
                <span>{user?.employee_email || 'Tidak tercantum'}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
              <span className="text-slate-400 block mb-1">Nomor Telepon</span>
              <div className="flex items-center gap-2 font-medium text-slate-800 text-xs">
                <Phone className="w-4 h-4 text-slate-400" />
                <span>{user?.employee_phone || 'Tidak tercantum'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 flex justify-end">
          <Button
            variant="danger-outline"
            size="md"
            icon={LogOut}
            onClick={logout}
          >
            Keluar dari Aplikasi (Logout)
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default Profile
