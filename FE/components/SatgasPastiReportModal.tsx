"use client"

import type React from "react"

import { useState, useRef } from "react"
import { X, Send, CheckCircle, AlertTriangle, FileText, Clock, Shield } from "lucide-react"
import type { ComplianceReport } from "@/types"

interface SatgasPastiReportModalProps {
  isOpen: boolean
  onClose: () => void
  complianceReport: ComplianceReport
  contractAddress: string
  showToast: (type: "success" | "error" | "info", message: string) => void
}

export const SatgasPastiReportModal = ({
  isOpen,
  onClose,
  complianceReport,
  contractAddress,
  showToast,
}: SatgasPastiReportModalProps) => {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [reportId, setReportId] = useState("")
  const modalRef = useRef<HTMLDivElement>(null)

  const reporterEmail = useRef<HTMLInputElement>(null)
  const reporterName = useRef<HTMLInputElement>(null)
  const reporterInstitution = useRef<HTMLInputElement>(null)
  const additionalNotes = useRef<HTMLTextAreaElement>(null)

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      if (!loading && !success) {
        onClose()
      }
    }
  }

  const generateReportId = () => {
    const timestamp = new Date().getTime()
    const random = Math.floor(Math.random() * 10000)
    return `PASTI-${timestamp}-${random}`
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulasi pengiriman laporan
    setTimeout(() => {
      const newReportId = generateReportId()
      setReportId(newReportId)
      setLoading(false)
      setSuccess(true)
      showToast("success", `Laporan berhasil dikirim ke Satgas PASTI dengan ID: ${newReportId}`)
    }, 3000)
  }

  const handleNextStep = () => {
    if (step < 3) {
      setStep(step + 1)
    }
  }

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  if (!isOpen) return null

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
  }

  const currentDate = formatDate(new Date())

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={handleOverlayClick}
    >
      <div
        ref={modalRef}
        className="bg-gray-900/90 backdrop-blur-xl rounded-xl border border-purple-500/30 shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        style={{
          boxShadow: "0 0 30px rgba(168, 85, 247, 0.2)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="bg-red-500/20 p-2 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-white">Pengiriman Laporan ke Satgas PASTI</h2>
          </div>
          {!loading && !success && (
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors duration-200">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {!success ? (
            <>
              {/* Progress Steps */}
              <div className="flex items-center justify-center mb-8">
                <div className="flex items-center w-full max-w-2xl">
                  <div className={`flex flex-col items-center ${step >= 1 ? "text-blue-400" : "text-gray-500"}`}>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 1 ? "border-blue-400 bg-blue-500/20" : "border-gray-600"}`}
                    >
                      <FileText className="w-4 h-4" />
                    </div>
                    <span className="text-xs mt-1">Data Laporan</span>
                  </div>
                  <div className={`flex-1 h-0.5 mx-2 ${step >= 2 ? "bg-blue-400" : "bg-gray-600"}`}></div>
                  <div className={`flex flex-col items-center ${step >= 2 ? "text-blue-400" : "text-gray-500"}`}>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 2 ? "border-blue-400 bg-blue-500/20" : "border-gray-600"}`}
                    >
                      <Shield className="w-4 h-4" />
                    </div>
                    <span className="text-xs mt-1">Informasi Pelapor</span>
                  </div>
                  <div className={`flex-1 h-0.5 mx-2 ${step >= 3 ? "bg-blue-400" : "bg-gray-600"}`}></div>
                  <div className={`flex flex-col items-center ${step >= 3 ? "text-blue-400" : "text-gray-500"}`}>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 3 ? "border-blue-400 bg-blue-500/20" : "border-gray-600"}`}
                    >
                      <Send className="w-4 h-4" />
                    </div>
                    <span className="text-xs mt-1">Konfirmasi</span>
                  </div>
                </div>
              </div>

              {/* Step 1: Data Laporan */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-lg font-semibold text-white mb-4">Data Pelanggaran</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-gray-400 text-sm">Alamat Kontrak:</p>
                          <p className="text-white font-mono">{contractAddress}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Tanggal Deteksi:</p>
                          <p className="text-white">
                            {new Date(complianceReport.scan_timestamp).toLocaleString("id-ID")}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-gray-400 text-sm">Total Pelanggaran:</p>
                        <p className="text-red-400 font-bold text-lg">{complianceReport.total_violations}</p>
                      </div>

                      <div>
                        <p className="text-gray-400 text-sm">Jenis Pelanggaran:</p>
                        <div className="mt-2 space-y-2">
                          {complianceReport.violations.map((violation, index) => (
                            <div key={index} className="bg-red-500/10 rounded-lg p-3 border border-red-500/20">
                              <div className="flex justify-between">
                                <span className="text-white capitalize">
                                  {violation.violation_type.replace(/_/g, " ")}
                                </span>
                                <span className="text-red-300">{violation.severity_level}</span>
                              </div>
                              <p className="text-gray-300 text-sm mt-1">{violation.law_article}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-gray-400 text-sm">Skor Risiko Hukum:</p>
                        <p className="text-orange-400 font-bold">{complianceReport.legal_risk_score}/20</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleNextStep}
                      className="px-6 py-2 bg-blue-500/20 text-blue-300 rounded-lg border border-blue-500/30 hover:bg-blue-500/30 transition-all duration-300"
                    >
                      Lanjutkan
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Informasi Pelapor */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-lg font-semibold text-white mb-4">Informasi Pelapor</h3>
                    <form className="space-y-4">
                      <div>
                        <label htmlFor="reporter-name" className="block text-gray-400 text-sm mb-1">
                          Nama Lengkap <span className="text-red-400">*</span>
                        </label>
                        <input
                          ref={reporterName}
                          type="text"
                          id="reporter-name"
                          className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                          placeholder="Masukkan nama lengkap"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="reporter-email" className="block text-gray-400 text-sm mb-1">
                          Email <span className="text-red-400">*</span>
                        </label>
                        <input
                          ref={reporterEmail}
                          type="email"
                          id="reporter-email"
                          className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                          placeholder="Masukkan email"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="reporter-institution" className="block text-gray-400 text-sm mb-1">
                          Institusi <span className="text-red-400">*</span>
                        </label>
                        <input
                          ref={reporterInstitution}
                          type="text"
                          id="reporter-institution"
                          className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                          placeholder="Masukkan nama institusi"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="additional-notes" className="block text-gray-400 text-sm mb-1">
                          Catatan Tambahan
                        </label>
                        <textarea
                          ref={additionalNotes}
                          id="additional-notes"
                          rows={4}
                          className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                          placeholder="Tambahkan catatan atau informasi tambahan (opsional)"
                        ></textarea>
                      </div>
                    </form>
                  </div>

                  <div className="flex justify-between">
                    <button
                      onClick={handlePrevStep}
                      className="px-6 py-2 bg-gray-700/50 text-gray-300 rounded-lg border border-gray-600 hover:bg-gray-700 transition-all duration-300"
                    >
                      Kembali
                    </button>
                    <button
                      onClick={handleNextStep}
                      className="px-6 py-2 bg-blue-500/20 text-blue-300 rounded-lg border border-blue-500/30 hover:bg-blue-500/30 transition-all duration-300"
                    >
                      Lanjutkan
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Konfirmasi */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-lg font-semibold text-white mb-4">Konfirmasi Pengiriman Laporan</h3>

                    <div className="space-y-4">
                      <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/20">
                        <p className="text-blue-300">
                          <span className="font-semibold">PERHATIAN:</span> Dengan mengirimkan laporan ini, Anda
                          menyatakan bahwa informasi yang diberikan adalah benar dan akurat sesuai dengan pengetahuan
                          Anda. Laporan ini akan dikirimkan ke Satuan Tugas Penanganan Aktivitas Siber Terintegrasi
                          (Satgas PASTI) untuk ditindaklanjuti.
                        </p>
                      </div>

                      <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                        <h4 className="text-white font-semibold mb-2">Ringkasan Laporan</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Alamat Kontrak:</span>
                            <span className="text-white font-mono">{contractAddress.substring(0, 10)}...</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Total Pelanggaran:</span>
                            <span className="text-red-400">{complianceReport.total_violations}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Skor Risiko Hukum:</span>
                            <span className="text-orange-400">{complianceReport.legal_risk_score}/20</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Pelapor:</span>
                            <span className="text-white">{reporterName.current?.value || "[Belum diisi]"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Institusi:</span>
                            <span className="text-white">{reporterInstitution.current?.value || "[Belum diisi]"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <button
                      onClick={handlePrevStep}
                      className="px-6 py-2 bg-gray-700/50 text-gray-300 rounded-lg border border-gray-600 hover:bg-gray-700 transition-all duration-300"
                      disabled={loading}
                    >
                      Kembali
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="px-6 py-2 bg-red-500/20 text-red-300 rounded-lg border border-red-500/30 hover:bg-red-500/30 transition-all duration-300 flex items-center space-x-2"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-red-300 border-t-transparent rounded-full animate-spin"></div>
                          <span>Mengirim...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Kirim Laporan</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Laporan Berhasil Dikirim!</h3>
              <p className="text-gray-400 text-center mb-6">
                Laporan Anda telah berhasil dikirim ke Satgas PASTI dan akan segera ditindaklanjuti.
              </p>

              <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700 w-full max-w-md mb-8">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">ID Laporan:</span>
                    <span className="text-green-400 font-mono">{reportId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Tanggal Pengiriman:</span>
                    <span className="text-white">{new Date().toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status:</span>
                    <span className="text-green-400">Terkirim</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/20 w-full max-w-md mb-8">
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <p className="text-blue-300 text-sm">
                    Satgas PASTI akan memproses laporan Anda dalam waktu 1-3 hari kerja. Anda akan menerima notifikasi
                    melalui email saat ada perkembangan terbaru.
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="px-6 py-2 bg-purple-500/20 text-purple-300 rounded-lg border border-purple-500/30 hover:bg-purple-500/30 transition-all duration-300"
              >
                Tutup
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        {!success && (
          <div className="p-6 border-t border-gray-700 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-blue-400" />
              <span className="text-gray-400 text-sm">Satgas PASTI - {currentDate}</span>
            </div>
            <div className="text-gray-400 text-sm">Confidential</div>
          </div>
        )}
      </div>
    </div>
  )
}
