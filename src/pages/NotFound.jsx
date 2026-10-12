import React from 'react'
import { Link } from 'react-router-dom'
import { FileQuestion, ArrowLeft } from 'lucide-react'
import Button from '../components/ui/Button'

export function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 text-slate-400 flex items-center justify-center mb-4">
        <FileQuestion className="w-8 h-8" />
      </div>
      <h1 className="text-2xl font-bold text-slate-900 mb-1">
        404 — Halaman Tidak Ditemukan
      </h1>
      <p className="text-sm text-slate-500 max-w-sm mb-6">
        Halaman yang Anda tuju tidak ditemukan atau URL mungkin salah.
      </p>
      <Link to="/dashboard">
        <Button size="md" icon={ArrowLeft}>
          Kembali ke Dashboard
        </Button>
      </Link>
    </div>
  )
}

export default NotFound
