  "use client"

  import type React from "react"

  import { useState, useRef } from "react"
  import { X, Send, CheckCircle, AlertTriangle, FileText, Shield, User, MapPin } from "lucide-react"
  import { SmoothTransition } from "./SmoothTransition"
  import { InteractiveCard } from "./InteractiveCard"
  import { SmoothButton } from "./SmoothButton"
  import type { ComplianceReport, IndonesianCrimeAnalysis } from "@/types"

  interface SatgasPastiReportModalProps {
    isOpen: boolean
    onClose: () => void
    complianceReport: ComplianceReport
    indonesianCrimeAnalysis: IndonesianCrimeAnalysis
    contractAddress: string
    showToast: (type: "success" | "error" | "info", message: string) => void
  }

  export const SatgasPastiReportModal = ({
    isOpen,
    onClose,
    complianceReport,
    indonesianCrimeAnalysis,
    contractAddress,
    showToast,
  }: SatgasPastiReportModalProps) => {
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [reportId, setReportId] = useState("")
    const modalRef = useRef<HTMLDivElement>(null)

    const [formData, setFormData] = useState({
      reporterName: "",
      reporterPosition: "",
      organization: "",
      phone: "",
      email: "",
      urgencyLevel: "HIGH",
      additionalNotes: "",
      evidenceDescription: "",
    })

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
      return `SATGAS-${timestamp.toString().slice(-8)}-${random.toString().padStart(4, "0")}`
    }

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      setLoading(true)

      // Simulasi pengiriman laporan (3 detik)
      await new Promise((resolve) => setTimeout(resolve, 3000))

      const newReportId = generateReportId()
      setReportId(newReportId)
      setLoading(false)
      setSuccess(true)
      showToast("success", `Laporan berhasil dikirim ke Satgas PASTI dengan ID: ${newReportId}`)
    }

    const handleInputChange = (field: string, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const resetModal = () => {
      setStep(1)
      setSuccess(false)
      setLoading(false)
      setReportId("")
      setFormData({
        reporterName: "",
        reporterPosition: "",
        organization: "",
        phone: "",
        email: "",
        urgencyLevel: "HIGH",
        additionalNotes: "",
        evidenceDescription: "",
      })
      onClose()
    }

    if (!isOpen) return null

    const getUrgencyColor = (level: string) => {
      switch (level) {
        case "HIGH":
          return "text-red-400 bg-red-900/20 border-red-500/30"
        case "MEDIUM":
          return "text-yellow-400 bg-yellow-900/20 border-yellow-500/30"
        case "LOW":
          return "text-green-400 bg-green-900/20 border-green-500/30"
        default:
          return "text-gray-400 bg-gray-900/20 border-gray-500/30"
      }
    }

    // Gabungkan data dari compliance report dan crime analysis
    const combinedViolations = [
      ...(complianceReport?.violations || []).map((v) => ({
        type: "Legal Violation",
        description: v.violation_type,
        severity: v.severity_level,
        details: v.law_article,
      })),
      ...(indonesianCrimeAnalysis?.detected_crimes || []).map((c) => ({
        type: "Crime Pattern",
        description: c.crime_type,
        severity: c.severity,
        details: c.regulatory_violation,
      })),
    ]

    const totalRiskScore = Math.round(
      ((complianceReport?.legal_risk_score || 0) / 20) * 50 +
      ((indonesianCrimeAnalysis?.overall_crime_risk || 0) / 100) * 50,
    )

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        onClick={handleOverlayClick}
      >
        <SmoothTransition delay={0}>
          <div
            ref={modalRef}
            className="bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto"
            style={{
              boxShadow: "0 0 40px rgba(239, 68, 68, 0.3)",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-red-500/20 border border-red-500/30">
                  <Shield className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">🇮🇩 Laporan ke Satgas PASTI</h2>
                  <p className="text-gray-400 text-sm">Pelaporan Aktivitas Mencurigakan Smart Contract</p>
                </div>
              </div>
              <button
                onClick={resetModal}
                className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 text-gray-400 hover:text-white transition-all duration-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Progress Steps */}
            <div className="p-6 border-b border-gray-700/50">
              <div className="flex items-center justify-between mb-2 relative">
                {[1, 2, 3].map((stepNum, index) => (
                  <div key={stepNum} className="flex-1 flex flex-col items-center relative">
                    {/* Garis sebelah kiri */}
                    {index !== 0 && (
                      <div className="absolute top-5 left-0 w-1/2 h-0.5 bg-gray-700 z-0">
                        <div
                          className={`h-full transition-all duration-300 ${step > stepNum - 1 ? "bg-red-500 w-full" : "bg-gray-700"
                            }`}
                        ></div>
                      </div>
                    )}
                    {/* Garis sebelah kanan */}
                    {index !== 2 && (
                      <div className="absolute top-5 right-0 w-1/2 h-0.5 bg-gray-700 z-0">
                        <div
                          className={`h-full transition-all duration-300 ${step > stepNum ? "bg-red-500 w-full" : "bg-gray-700"
                            }`}
                        ></div>
                      </div>
                    )}

                    {/* Bulatan */}
                    <div
                      className={`z-10 w-10 h-10 flex items-center justify-center rounded-full text-sm font-medium transition-all duration-300 ${step >= stepNum ? "bg-red-500 text-white" : "bg-gray-700 text-gray-400"
                        }`}
                    >
                      {success && stepNum === 3 ? <CheckCircle className="w-5 h-5" /> : stepNum}
                    </div>

                    {/* Label */}
                    <div className="mt-2 text-xs text-gray-400 text-center">
                      {stepNum === 1 && "Data Pelapor"}
                      {stepNum === 2 && "Review Laporan"}
                      {stepNum === 3 && "Konfirmasi"}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {!success ? (
                <>
                  {/* Step 1: Reporter Information */}
                  {step === 1 && (
                    <SmoothTransition delay={0}>
                      <div className="space-y-6">
                        <InteractiveCard className="bg-gray-800/30 rounded-lg p-6 border border-gray-700/30">
                          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                            <User className="w-5 h-5 mr-2 text-blue-400" />
                            Informasi Pelapor
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">Nama Lengkap *</label>
                              <input
                                type="text"
                                value={formData.reporterName}
                                onChange={(e) => handleInputChange("reporterName", e.target.value)}
                                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:border-blue-500/50 focus:outline-none transition-all duration-300"
                                placeholder="Masukkan nama lengkap"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">Jabatan *</label>
                              <input
                                type="text"
                                value={formData.reporterPosition}
                                onChange={(e) => handleInputChange("reporterPosition", e.target.value)}
                                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:border-blue-500/50 focus:outline-none transition-all duration-300"
                                placeholder="Contoh: Analis Keamanan Siber"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                Organisasi/Instansi *
                              </label>
                              <input
                                type="text"
                                value={formData.organization}
                                onChange={(e) => handleInputChange("organization", e.target.value)}
                                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:border-blue-500/50 focus:outline-none transition-all duration-300"
                                placeholder="Nama instansi/perusahaan"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">Nomor Telepon *</label>
                              <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => handleInputChange("phone", e.target.value)}
                                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:border-blue-500/50 focus:outline-none transition-all duration-300"
                                placeholder="+62 xxx-xxxx-xxxx"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-300 mb-2">Email *</label>
                              <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleInputChange("email", e.target.value)}
                                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:border-blue-500/50 focus:outline-none transition-all duration-300"
                                placeholder="email@domain.com"
                              />
                            </div>
                          </div>
                        </InteractiveCard>

                        <InteractiveCard className="bg-gray-800/30 rounded-lg p-6 border border-gray-700/30">
                          <h4 className="text-white font-medium mb-4">Tingkat Urgensi</h4>
                          <div className="grid grid-cols-3 gap-3">
                            {["LOW", "MEDIUM", "HIGH"].map((level) => (
                              <button
                                key={level}
                                onClick={() => handleInputChange("urgencyLevel", level)}
                                className={`p-3 rounded-lg border text-sm font-medium transition-all duration-300 ${formData.urgencyLevel === level
                                    ? getUrgencyColor(level)
                                    : "bg-gray-800/30 border-gray-600/30 text-gray-400 hover:border-gray-500/50"
                                  }`}
                              >
                                {level === "LOW" ? "Rendah" : level === "MEDIUM" ? "Sedang" : "Tinggi"}
                              </button>
                            ))}
                          </div>
                        </InteractiveCard>

                        <div className="flex justify-end">
                          <SmoothButton
                            onClick={() => setStep(2)}
                            disabled={!formData.reporterName || !formData.email || !formData.organization}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
                          >
                            Lanjutkan
                          </SmoothButton>
                        </div>
                      </div>
                    </SmoothTransition>
                  )}

                  {/* Step 2: Report Review */}
                  {step === 2 && (
                    <SmoothTransition delay={0}>
                      <div className="space-y-6">
                        <InteractiveCard className="bg-gray-800/30 rounded-lg p-6 border border-gray-700/30">
                          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                            <FileText className="w-5 h-5 mr-2 text-orange-400" />
                            Review Data Laporan
                          </h3>

                          {/* Contract Information */}
                          <div className="bg-gray-900/50 rounded-lg p-4 mb-6 border border-gray-700/30">
                            <h4 className="text-white font-medium mb-3">Informasi Smart Contract</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-400">Contract Address:</span>
                                <p className="text-white font-mono break-all">{contractAddress}</p>
                              </div>
                              <div>
                                <span className="text-gray-400">Scan Timestamp:</span>
                                <p className="text-white">
                                  {new Date(complianceReport.scan_timestamp).toLocaleString("id-ID")}
                                </p>
                              </div>
                              <div>
                                <span className="text-gray-400">Combined Risk Score:</span>
                                <p className="text-red-400 font-semibold">{totalRiskScore}/100</p>
                              </div>
                              <div>
                                <span className="text-gray-400">Indonesia Targeting:</span>
                                <p
                                  className={`font-semibold ${indonesianCrimeAnalysis?.is_targeting_indonesia ? "text-red-400" : "text-green-400"
                                    }`}
                                >
                                  {indonesianCrimeAnalysis?.is_targeting_indonesia ? "DETECTED" : "NOT DETECTED"}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Combined Violations */}
                          <div className="bg-red-900/20 rounded-lg p-4 mb-6 border border-red-700/30">
                            <h4 className="text-red-200 font-medium mb-3 flex items-center">
                              <AlertTriangle className="w-4 h-4 mr-2" />
                              Pelanggaran & Pola Kriminal Terdeteksi ({combinedViolations.length})
                            </h4>
                            <div className="space-y-3 max-h-60 overflow-y-auto">
                              {combinedViolations.slice(0, 5).map((violation, index) => (
                                <div key={index} className="bg-gray-800/50 rounded-lg p-3">
                                  <div className="flex justify-between items-start mb-2">
                                    <div>
                                      <span className="text-xs text-gray-400 bg-gray-700/50 px-2 py-1 rounded">
                                        {violation.type}
                                      </span>
                                      <h5 className="text-white font-medium mt-1">{violation.description}</h5>
                                    </div>
                                    <span
                                      className={`px-2 py-1 rounded text-xs font-medium ${violation.severity === "BERAT" || violation.severity === "CRITICAL"
                                          ? "bg-red-500/20 text-red-300"
                                          : violation.severity === "SEDANG" || violation.severity === "HIGH"
                                            ? "bg-yellow-500/20 text-yellow-300"
                                            : "bg-blue-500/20 text-blue-300"
                                        }`}
                                    >
                                      {violation.severity}
                                    </span>
                                  </div>
                                  <p className="text-gray-400 text-sm">{violation.details}</p>
                                </div>
                              ))}
                              {combinedViolations.length > 5 && (
                                <p className="text-gray-400 text-sm text-center">
                                  +{combinedViolations.length - 5} pelanggaran lainnya...
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Indonesian Evidence */}
                          <div className="bg-blue-900/20 rounded-lg p-4 mb-6 border border-blue-700/30">
                            <h4 className="text-blue-200 font-medium mb-3 flex items-center">
                              <MapPin className="w-4 h-4 mr-2" />
                              Bukti Penargetan Indonesia
                            </h4>
                            <div className="space-y-2">
                              {(indonesianCrimeAnalysis?.indonesian_evidence || []).slice(0, 3).map((evidence, index) => (
                                <div key={index} className="flex items-start space-x-2">
                                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                                  <p className="text-blue-200 text-sm">{evidence}</p>
                                </div>
                              ))}
                              {(!indonesianCrimeAnalysis?.indonesian_evidence || indonesianCrimeAnalysis.indonesian_evidence.length === 0) && (
                                <p className="text-gray-400 text-sm italic">Tidak ada bukti penargetan Indonesia yang terdeteksi</p>
                              )}
                            </div>
                          </div>

                          {/* Additional Notes */}
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">Catatan Tambahan</label>
                              <textarea
                                value={formData.additionalNotes}
                                onChange={(e) => handleInputChange("additionalNotes", e.target.value)}
                                rows={4}
                                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:border-blue-500/50 focus:outline-none transition-all duration-300"
                                placeholder="Tambahkan informasi atau konteks tambahan yang relevan..."
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">Deskripsi Bukti</label>
                              <textarea
                                value={formData.evidenceDescription}
                                onChange={(e) => handleInputChange("evidenceDescription", e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:border-blue-500/50 focus:outline-none transition-all duration-300"
                                placeholder="Jelaskan bukti atau indikasi yang mendukung laporan ini..."
                              />
                            </div>
                          </div>
                        </InteractiveCard>

                        <div className="flex justify-between">
                          <SmoothButton
                            onClick={() => setStep(1)}
                            variant="outline"
                            className="text-gray-400 border-gray-600 hover:text-white hover:border-gray-500"
                          >
                            Kembali
                          </SmoothButton>
                          <SmoothButton
                            onClick={() => setStep(3)}
                            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2"
                          >
                            Review & Kirim
                          </SmoothButton>
                        </div>
                      </div>
                    </SmoothTransition>
                  )}

                  {/* Step 3: Confirmation */}
                  {step === 3 && (
                    <SmoothTransition delay={0}>
                      <div className="space-y-6">
                        <InteractiveCard className="bg-gray-800/30 rounded-lg p-6 border border-gray-700/30">
                          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                            <Send className="w-5 h-5 mr-2 text-green-400" />
                            Konfirmasi Pengiriman Laporan
                          </h3>

                          <div className="bg-yellow-900/20 rounded-lg p-4 mb-6 border border-yellow-700/30">
                            <div className="flex items-start space-x-3">
                              <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                              <div>
                                <h4 className="text-yellow-200 font-medium mb-2">Perhatian</h4>
                                <p className="text-yellow-300 text-sm">
                                  Dengan mengirim laporan ini, Anda menyatakan bahwa informasi yang diberikan adalah benar
                                  dan dapat dipertanggungjawabkan. Laporan palsu dapat dikenakan sanksi sesuai peraturan
                                  yang berlaku.
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="bg-gray-900/50 rounded-lg p-4 mb-6 border border-gray-700/30">
                            <h4 className="text-white font-medium mb-3">Ringkasan Laporan</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-400">Pelapor:</span>
                                <span className="text-white">{formData.reporterName}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Organisasi:</span>
                                <span className="text-white">{formData.organization}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Tingkat Urgensi:</span>
                                <span
                                  className={`font-medium ${formData.urgencyLevel === "HIGH"
                                      ? "text-red-400"
                                      : formData.urgencyLevel === "MEDIUM"
                                        ? "text-yellow-400"
                                        : "text-green-400"
                                    }`}
                                >
                                  {formData.urgencyLevel === "HIGH"
                                    ? "Tinggi"
                                    : formData.urgencyLevel === "MEDIUM"
                                      ? "Sedang"
                                      : "Rendah"}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Total Pelanggaran:</span>
                                <span className="text-red-400 font-semibold">{combinedViolations.length}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Combined Risk Score:</span>
                                <span className="text-red-400 font-semibold">{totalRiskScore}/100</span>
                              </div>
                            </div>
                          </div>
                        </InteractiveCard>

                        <div className="flex justify-between">
                          <SmoothButton
                            onClick={() => setStep(2)}
                            variant="outline"
                            className="text-gray-400 border-gray-600 hover:text-white hover:border-gray-500"
                          >
                            Kembali
                          </SmoothButton>
                          <SmoothButton
                            onClick={handleSubmit}
                            disabled={loading}
                            className="bg-red-600 hover:bg-red-700 text-white px-8 py-2 flex items-center space-x-2"
                          >
                            {loading ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Mengirim...</span>
                              </>
                            ) : (
                              <>
                                <Send className="w-4 h-4" />
                                <span>Kirim Laporan</span>
                              </>
                            )}
                          </SmoothButton>
                        </div>
                      </div>
                    </SmoothTransition>
                  )}
                </>
              ) : (
                <SmoothTransition delay={0}>
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-8 h-8 text-green-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Laporan Berhasil Dikirim!</h3>
                    <p className="text-gray-400 text-center mb-6">
                      Laporan Anda telah berhasil dikirim ke Satgas PASTI dan akan ditindaklanjuti sesuai prosedur yang
                      berlaku.
                    </p>

                    <InteractiveCard className="bg-green-900/20 rounded-lg p-6 mb-6 border border-green-700/30 max-w-md mx-auto">
                      <div className="text-center">
                        <h4 className="text-green-200 font-medium mb-2">ID Laporan</h4>
                        <p className="text-green-400 font-mono text-lg">{reportId}</p>
                        <p className="text-green-300 text-sm mt-2">Simpan ID ini untuk referensi dan follow-up</p>
                      </div>
                    </InteractiveCard>

                    <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-700/30 max-w-md mx-auto mb-6">
                      <h4 className="text-blue-200 font-medium mb-2">Langkah Selanjutnya</h4>
                      <ul className="text-blue-300 text-sm space-y-1 text-left">
                        <li>• Tim Satgas PASTI akan melakukan verifikasi dalam 1-2 hari kerja</li>
                        <li>• Anda akan dihubungi jika diperlukan informasi tambahan</li>
                        <li>• Status penanganan dapat dipantau melalui ID laporan</li>
                        <li>• Hasil investigasi akan dikomunikasikan sesuai prosedur</li>
                      </ul>
                    </div>

                    <SmoothButton onClick={resetModal} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2">
                      Tutup
                    </SmoothButton>
                  </div>
                </SmoothTransition>
              )}
            </div>

            {/* Footer */}
            {!success && (
              <div className="p-6 border-t border-gray-700/50 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-blue-400" />
                  <span className="text-gray-400 text-sm">Satgas PASTI - {new Date().toLocaleDateString("id-ID")}</span>
                </div>
                <div className="text-gray-400 text-sm">Confidential</div>
              </div>
            )}
          </div>
        </SmoothTransition>
      </div>
    )
  }
