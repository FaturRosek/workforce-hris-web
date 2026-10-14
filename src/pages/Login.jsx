import React, { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { Eye, EyeOff, AlertCircle, ArrowLeft } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

export function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formError, setFormError] = useState('')

  const { login } = useAuth()
  const { success } = useToast()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/dashboard'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')

    const trimmedUsername = username.trim()
    if (!trimmedUsername) {
      setFormError('Username wajib diisi')
      return
    }

    if (!password) {
      setFormError('Password wajib diisi')
      return
    }

    try {
      setIsLoading(true)
      await login(trimmedUsername, password)
      success('Selamat datang kembali di MM Tailor Workforce', 'Login Berhasil')
      navigate(from, { replace: true })
    } catch (err) {
      setFormError(err.message || 'Gagal masuk. Periksa username dan password.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>

        <div className="text-center mb-8">
          <Link to="/" className="inline-block group">
            <img
              src="/logo.png"
              alt="MM Tailor Logo"
              className="w-20 h-20 mx-auto mb-3 object-contain drop-shadow-sm group-hover:scale-105 transition-transform"
            />
          </Link>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            MM Tailor Workforce
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Masuk ke sistem operasional order & HRIS
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200/80 rounded-2xl sm:px-8">
          {formError && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-700 animate-in fade-in duration-150">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-600 mt-0.5" />
              <div className="text-xs sm:text-sm font-medium leading-relaxed">
                {formError}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4.5" noValidate>
            <Input
              label="Username"
              id="username"
              name="username"
              type="text"
              required
              autoComplete="username"
              placeholder="Masukkan username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value)
                if (formError) setFormError('')
              }}
              disabled={isLoading}
            />

            <Input
              label="Password"
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="current-password"
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (formError) setFormError('')
              }}
              disabled={isLoading}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-600 transition-colors p-1 cursor-pointer"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              }
            />

            <div className="pt-2">
              <Button
                type="submit"
                className="w-full"
                size="md"
                isLoading={isLoading}
                disabled={isLoading}
              >
                Masuk ke Aplikasi
              </Button>
            </div>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-400">
            Aplikasi internal operasional MM Tailor
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
