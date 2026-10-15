import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Scissors,
  Ruler,
  Clock,
  Sparkles,
  MapPin,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  Users,
  Award,
  Layers,
  ExternalLink,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import serviceApi from '../api/services'
import employeeApi from '../api/employees'
import { formatCurrency } from '../utils/formatters'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'

export function Landing() {
  const { isAuthenticated } = useAuth()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [services, setServices] = useState([])
  const [employees, setEmployees] = useState([])
  const [isLoadingServices, setIsLoadingServices] = useState(true)

  const slides = [
    {
      image: '/images/hero.jpg',
      title: 'Busana Kustom Elegan dengan Presisi Sempurna',
      description:
        'Penjahitan busana pria & wanita, setelan jas, dan seragam profesional dengan standar kualitas jahitan tinggi dan fitting akurat.',
    },
    {
      image: '/images/hero2.jpg',
      title: 'Sentuhan Tangan Pengrajin Busana Berpengalaman',
      description:
        'Setiap potongan kain diukur dan dijahit secara cermat mengikuti lekuk tubuh untuk kenyamanan dan penampilan maksimal.',
    },
    {
      image: '/images/hero3.jpg',
      title: 'Pemantauan Status Produksi Transparan & Tepat Waktu',
      description:
        'Ketahui progres pembuatan busana Anda dari tahap pengukuran, pemotongan, penjahitan, hingga siap diambil.',
    },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [slides.length])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingServices(true)
        const [sRes, eRes] = await Promise.all([
          serviceApi.getServices({ limit: 8 }).catch(() => ({ success: false })),
          employeeApi.getEmployees({ limit: 8 }).catch(() => ({ success: false })),
        ])

        if (sRes.success && sRes.data?.length) {
          setServices(sRes.data)
        } else {
          setServices([
            {
              id: 1,
              service_name: 'Jahit Jas Custom',
              price: 750000,
              estimated_days: 7,
              description: 'Setelan jas pria & wanita lengkap furing silk dengan cutting modern.',
            },
            {
              id: 2,
              service_name: 'Jahit Kemeja Eksklusif',
              price: 350000,
              estimated_days: 4,
              description: 'Kemeja formal atau batik dengan kerah kaku presisi dan jahitan stik halus.',
            },
            {
              id: 3,
              service_name: 'Jahit Seragam Kantor',
              price: 300000,
              estimated_days: 5,
              description: 'Seragam dinas, korporat, atau komunitas dengan daya tahan kain maksimal.',
            },
            {
              id: 4,
              service_name: 'Permak Celana & Baju',
              price: 50000,
              estimated_days: 2,
              description: 'Permak ukuran pinggang, panjang celana, hingga penyesuaian lingkar dada.',
            },
          ])
        }

        if (eRes.success && eRes.data?.length) {
          setEmployees(eRes.data)
        } else {
          setEmployees([
            { id: 1, full_name: 'Andi Pratama', position_name: 'Master Tailor' },
            { id: 2, full_name: 'Siti Rahma', position_name: 'Pattern Specialist' },
            { id: 3, full_name: 'Budi Santoso', position_name: 'Master Cutter' },
            { id: 4, full_name: 'Dimas Saputra', position_name: 'Finishing & QC' },
          ])
        }
      } catch {
      } finally {
        setIsLoadingServices(false)
      }
    }

    fetchData()
  }, [])

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/logo.jpg"
              alt="MM Tailor Logo"
              className="w-10 h-10 object-contain rounded-xl bg-white border border-slate-200 p-0.5 shadow-2xs group-hover:scale-105 transition-transform"
            />
            <div>
              <span className="text-lg font-bold text-slate-900 tracking-tight leading-none block">
                MM Tailor
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-7 text-sm font-semibold text-slate-600">
            <a href="#hero" className="hover:text-blue-600 transition-colors">
              Beranda
            </a>
            <a href="#services" className="hover:text-blue-600 transition-colors">
              Layanan
            </a>
            <a href="#team" className="hover:text-blue-600 transition-colors">
              Tim Penjahit
            </a>
            <a href="#features" className="hover:text-blue-600 transition-colors">
              Keunggulan
            </a>
            <a href="#location" className="hover:text-blue-600 transition-colors">
              Lokasi
            </a>
          </div>

          <div className="flex items-center gap-2.5">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button size="sm" icon={ArrowRight}>
                  Buka Dashboard
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button size="sm" icon={ArrowRight}>
                  Masuk Sistem
                </Button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      <section id="hero" className="relative pt-18 min-h-[580px] sm:min-h-[640px] flex items-center overflow-hidden bg-slate-950">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center transform scale-105 transition-transform duration-7000 ease-out"
              style={{ backgroundImage: `url(${slide.image})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-slate-950/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
          </div>
        ))}

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-white w-full">
          <div className="max-w-2xl space-y-6">
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-white">
              {slides[currentSlide].title}
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              {slides[currentSlide].description}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3.5">
              {isAuthenticated ? (
                <Link to="/dashboard">
                  <Button size="lg" icon={ArrowRight}>
                    Masuk ke Dashboard
                  </Button>
                </Link>
              ) : (
                <Link to="/login">
                  <Button size="lg" icon={ArrowRight}>
                    Masuk ke Sistem Workforce
                  </Button>
                </Link>
              )}

              <a href="#services">
                <Button variant="outline" size="lg" className="bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white">
                  Lihat Katalog Layanan
                </Button>
              </a>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center border border-white/10 backdrop-blur-xs transition-colors cursor-pointer"
          aria-label="Slide sebelumnya"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center border border-white/10 backdrop-blur-xs transition-colors cursor-pointer"
          aria-label="Slide selanjutnya"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrentSlide(i)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                i === currentSlide ? 'w-8 bg-blue-500' : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Ke slide ${i + 1}`}
            />
          ))}
        </div>
      </section>

      <section className="bg-white border-b border-slate-200/80 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-10 h-10 mx-auto rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-3">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                10+ Tahun
              </h3>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Pengalaman Menjahit Busana
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-10 h-10 mx-auto rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                <Ruler className="w-5 h-5" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-emerald-700 tracking-tight">
                8 Titik
              </h3>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Pengukuran Badan Akurat (Fitting)
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-10 h-10 mx-auto rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-amber-700 tracking-tight">
                6 Tahap
              </h3>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Alur Produksi Terorganisir
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-10 h-10 mx-auto rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-3">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                100%
              </h3>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Pelacakan Pesanan & Transparansi
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <Badge variant="primary" size="md">
            Layanan Unggulan
          </Badge>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
            Katalog Layanan Jahit MM Tailor
          </h2>
          <p className="text-sm text-slate-500 mt-2 leading-relaxed">
            Pilihan jasa pembuatan busana kustom, permak, dan seragam dengan estimasi pengerjaan terstandarisasi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((svc) => (
            <div
              key={svc.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs hover:shadow-md hover:border-blue-200 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 border border-blue-100">
                  <Scissors className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  {svc.service_name}
                </h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  {svc.description || 'Layanan jahit kustom terpercaya dengan jaminan hasil presisi.'}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-medium text-slate-400 block">
                    Mulai dari
                  </span>
                  <span className="text-base font-bold text-slate-900">
                    {formatCurrency(svc.price)}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>± {svc.estimated_days} Hari</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="features" className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-widest block mb-2">
              Transformasi Digital
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Mengapa Memilih MM Tailor Workforce?
            </h2>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
              Pembaruan menyeluruh dari sistem terdahulu menjadi platform HRIS & Order terpadu yang modern.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-slate-800/60 border border-slate-700/80 backdrop-blur-sm">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-5 border border-blue-400/20">
                <Ruler className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Fitting 8 Titik Tubuh
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Pencatatan ukuran lingkar dada, pinggang, pinggul, bahu, panjang lengan, kemeja, kerung lengan, hingga catatan postur unik untuk hasil pakaian pas di badan.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-800/60 border border-slate-700/80 backdrop-blur-sm">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-5 border border-emerald-400/20">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Pelacakan Tahap Produksi
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Alur pesanan jelas terverifikasi mulai dari Pending, Fitting, Cutting, Sewing, Finishing, hingga Ready Pickup dengan jejak audit tanggal otomatis.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-800/60 border border-slate-700/80 backdrop-blur-sm">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-5 border border-amber-400/20">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Pencatatan Keuangan Akurat
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Kalkulasi otomatis pembayaran uang muka (DP), sisa tagihan, dan pelunasan dengan invoice digital tanpa resiko selisih catatan pembukuan manual.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="team" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <Badge variant="primary" size="md">
            Tenaga Kerja Handal
          </Badge>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
            Tim Penjahit & Pengrajin MM Tailor
          </h2>
          <p className="text-sm text-slate-500 mt-2 leading-relaxed">
            Tenaga profesional yang berdedikasi menciptakan karya busana berkualitas tinggi di workshop kami.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {employees.map((emp) => (
            <div
              key={emp.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 text-center shadow-xs hover:shadow-md transition-all group"
            >
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-bold text-2xl flex items-center justify-center mx-auto mb-4 shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                {emp.full_name ? emp.full_name.charAt(0).toUpperCase() : 'T'}
              </div>
              <h3 className="text-base font-bold text-slate-900">
                {emp.full_name}
              </h3>
              <span className="inline-block mt-1 text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
                {emp.position_name || 'Staff Penjahit'}
              </span>
              <p className="text-[11px] text-slate-400 mt-2.5">
                Spesialis pengerjaan detail busana kustom dan seragam
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="location" className="py-20 bg-slate-100 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <Badge variant="primary" size="md">
              Lokasi Workshop
            </Badge>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
              Temukan Workshop MM Tailor
            </h2>
            <p className="text-sm text-slate-500 mt-2 leading-relaxed">
              Kunjungi workshop kami untuk konsultasi bahan, fitting ukuran tubuh, atau pengambilan pesanan jahitan Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-xs">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">
                    MM&apos;s Tailor Workshop
                  </h3>
                  <p className="text-xs text-slate-500">
                    Pusat penjahitan kustom & pengerjaan busana berkualitas
                  </p>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-semibold text-slate-800 block">
                        Alamat:
                      </strong>
                      <span className="text-slate-600 leading-relaxed block mt-0.5">
                        Jl. KH. Moh. Kholil, Bangkalan, Madura, Jawa Timur, Indonesia
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono block mt-1">
                        Koordinat: -6.9482, 112.8349
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-semibold text-slate-800 block">
                        Jam Operasional:
                      </strong>
                      <span className="text-slate-600 block mt-0.5">
                        Senin - Sabtu: 08.00 - 20.00 WIB
                      </span>
                      <span className="text-slate-500 block">
                        Minggu: 09.00 - 17.00 WIB
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-semibold text-slate-800 block">
                        Kontak & WhatsApp:
                      </strong>
                      <span className="text-slate-600 block mt-0.5">
                        0812-3456-7890
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100">
                <a
                  href="https://www.google.com/maps?q=-6.9482,112.8349"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors shadow-xs"
                >
                  <span>Buka di Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs min-h-[380px] relative">
              <iframe
                title="Peta Lokasi MM Tailor"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '380px' }}
                loading="lazy"
                src="https://www.openstreetmap.org/export/embed.html?bbox=112.8249%2C-6.9582%2C112.8449%2C-6.9382&amp;layer=mapnik&amp;marker=-6.9482%2C112.8349"
              />
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-800 shadow-xs flex items-center gap-1.5 pointer-events-none">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span>MM&apos;s Tailor Workshop</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Ingin Mengelola Pesanan Jahitan dengan Lebih Cepat?
          </h2>
          <p className="text-sm text-blue-100 max-w-xl mx-auto leading-relaxed">
            Akses sistem MM Tailor Workforce untuk mendaftarkan order baru, mencatat ukuran fitting pelanggan, dan memantau progres produksi.
          </p>
          <div className="pt-2">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 border-transparent shadow-md" icon={ArrowRight}>
                  Buka Dashboard Sekarang
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 border-transparent shadow-md" icon={ArrowRight}>
                  Masuk ke Portal Workforce
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-800 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="MM Tailor Logo"
                className="w-10 h-10 object-contain rounded-xl bg-white p-0.5"
              />
              <div>
                <span className="text-base font-bold text-white block">
                  MM Tailor Workforce
                </span>
                <span className="text-[11px] text-slate-500 block">
                  Sistem HRIS & Manajemen Operasional Penjahitan
                </span>
              </div>
            </div>

            <div className="flex items-center gap-6 font-medium">
              <a href="#hero" className="hover:text-white transition-colors">
                Beranda
              </a>
              <a href="#services" className="hover:text-white transition-colors">
                Layanan
              </a>
              <a href="#team" className="hover:text-white transition-colors">
                Tim Penjahit
              </a>
              <a href="#location" className="hover:text-white transition-colors">
                Lokasi
              </a>
              <Link to="/login" className="text-blue-400 hover:text-blue-300 transition-colors">
                Login
              </Link>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-slate-500">
            <p>
              &copy; {new Date().getFullYear()} MM Tailor. Hak cipta dilindungi undang-undang.
            </p>
            <p className="text-[11px]">
              Diperbarui dari platform MM Tailor BNSP menjadi MM Tailor Workforce.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing
