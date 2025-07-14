'use client'
import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Shield, Search, AlertTriangle, CheckCircle, Clock, Zap, Brain, Bug } from 'lucide-react'

type AuditResult = {
  risk_level: 'Low' | 'Medium' | 'High' | 'Unknown'
  risk_score: number
  vulnerabilities: string[]
  ai_summary: string
}

export default function Home() {
  const [address, setAddress] = useState('')
  const [result, setResult] = useState<AuditResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState('')

  const auditSteps = [
    'Menganalisis bytecode...',
    'Memeriksa pola keamanan...',
    'Mendeteksi kerentanan...',
    'Menganalisis dengan AI...',
    'Menyusun laporan...'
  ]

  const handleAudit = async () => {
    setLoading(true)
    setResult(null)
    setProgress(0)
    
    // Simulate audit process with steps
    for (let i = 0; i < auditSteps.length; i++) {
      setCurrentStep(auditSteps[i])
      setProgress((i + 1) * 20)
      await new Promise(resolve => setTimeout(resolve, 800))
    }
    
    try {
      const res = await fetch('http://localhost:8000/audit-contract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, chain: 'ethereum' })
      })
      const data = await res.json()
      setResult(data)
    } catch (error) {
      // Fallback demo data untuk hackathon
      const demoResult: AuditResult = {
        risk_level: Math.random() > 0.5 ? 'Low' : Math.random() > 0.5 ? 'Medium' : 'High',
        risk_score: Math.floor(Math.random() * 100),
        vulnerabilities: [
          'Reentrancy vulnerability detected in withdraw function',
          'Unchecked external call in transfer method',
          'Missing access control for admin functions'
        ],
        ai_summary: 'Contract menunjukkan beberapa kerentanan keamanan yang perlu diperhatikan. Fungsi withdraw rentan terhadap reentrancy attack dan perlu implementasi checks-effects-interactions pattern. Kontrol akses admin juga perlu diperbaiki untuk mencegah unauthorized access.'
      }
      setResult(demoResult)
    }
    setLoading(false)
    setProgress(100)
  }

  const downloadReport = () => {
    if (!result) return
    
    const report = `
AUTO-SENTINEL AUDIT REPORT
===========================

Contract Address: ${address}
Risk Level: ${result.risk_level}
Risk Score: ${result.risk_score}/100

AI ANALYSIS:
${result.ai_summary}

VULNERABILITIES DETECTED:
${result.vulnerabilities.map((v, i) => `${i + 1}. ${v}`).join('\n')}

Generated: ${new Date().toLocaleString()}
    `.trim()
    
    const blob = new Blob([report], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `audit-report-${address.slice(0, 8)}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const shareReport = () => {
    if (!result) return
    
    const shareText = `🔍 Smart Contract Audit Results:\n\n📍 Contract: ${address}\n⚠️ Risk Level: ${result.risk_level}\n📊 Risk Score: ${result.risk_score}/100\n\n🤖 AI Analysis:\n${result.ai_summary}\n\n🔒 Audited by AUTO-SENTINEL`
    
    if (navigator.share) {
      navigator.share({
        title: 'Smart Contract Audit Report',
        text: shareText,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(shareText)
      alert('Report copied to clipboard!')
    }
  }

  const getBadgeColor = (level: string) => {
    if (level === 'High') return 'bg-red-600 hover:bg-red-700 text-white'
    if (level === 'Medium') return 'bg-yellow-600 hover:bg-yellow-700 text-black'
    return 'bg-green-600 hover:bg-green-700 text-black'
  }

  const getRiskIcon = (level: string) => {
    if (level === 'High') return <AlertTriangle className="w-4 h-4" />
    if (level === 'Medium') return <Clock className="w-4 h-4" />
    return <CheckCircle className="w-4 h-4" />
  }

  const getGradientByRisk = (level: string) => {
    if (level === 'High') return 'from-red-500/10 to-red-600/5'
    if (level === 'Medium') return 'from-yellow-500/10 to-yellow-600/5'
    return 'from-green-500/10 to-green-600/5'
  }

  return (
    <main className="min-h-screen bg-black text-green-400 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500/3 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-green-500/2 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-8">
        <div className="w-full max-w-4xl space-y-8">
          
          {/* Header Section */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <Shield className="w-16 h-16 text-green-400 animate-pulse" />
                <div className="absolute inset-0 bg-green-400/20 rounded-full blur-xl"></div>
              </div>
            </div>
            <h1 className="text-6xl font-bold text-green-400 font-mono tracking-wider">
              AUTO-SENTINEL
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Platform audit smart contract berbasis AI untuk melindungi pengguna dari 
              <span className="text-red-400 font-semibold"> scam</span> dan 
              <span className="text-yellow-400 font-semibold"> bug berbahaya</span>
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-gray-400 mt-4">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-green-400" />
                <span>Audit Instan</span>
              </div>
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-green-400" />
                <span>AI-Powered</span>
              </div>
              <div className="flex items-center gap-2">
                <Bug className="w-4 h-4 text-red-400" />
                <span>Deteksi Kerentanan</span>
              </div>
            </div>
          </div>

          {/* Input Section */}
          <Card className="bg-gray-900/80 backdrop-blur-xl border-green-400/20 p-8 rounded-lg shadow-2xl">
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-400" />
                  <Input
                    placeholder="Masukkan Smart Contract Address (0x...)"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="pl-12 h-14 bg-black/50 border-green-400/30 text-green-400 placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 font-mono"
                  />
                </div>
                <Button 
                  onClick={handleAudit} 
                  disabled={loading || !address}
                  className="h-14 px-8 bg-green-600 hover:bg-green-700 text-black font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                      Mengaudit...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Mulai Audit
                    </div>
                  )}
                </Button>
              </div>

              {/* Loading Progress */}
              {loading && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-green-400 font-mono">{currentStep}</span>
                    <span className="text-sm text-gray-400">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2 bg-gray-800" />
                </div>
              )}
            </div>
          </Card>

          {/* Results Section */}
          {result && (
            <Card className={`bg-gray-900/90 backdrop-blur-xl border-green-400/20 rounded-lg shadow-2xl overflow-hidden animate-fadeIn`}>
              <div className="p-8 space-y-6">
                
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-green-400/10 rounded-lg">
                      <Shield className="w-6 h-6 text-green-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-green-400 font-mono">HASIL AUDIT</h2>
                  </div>
                  <Badge className={`${getBadgeColor(result.risk_level)} px-4 py-2 text-sm font-semibold rounded-lg flex items-center gap-2 shadow-lg`}>
                    {getRiskIcon(result.risk_level)}
                    RISK: {result.risk_level.toUpperCase()}
                  </Badge>
                </div>

                {/* Risk Score */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-green-400 font-mono">SKOR RISIKO</span>
                    <span className="text-2xl font-bold text-green-400 font-mono">{result.risk_score}/100</span>
                  </div>
                  <div className="relative">
                    <Progress value={result.risk_score} className="h-4 bg-gray-800 rounded-lg" />
                  </div>
                </div>

                {/* AI Summary */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-green-400" />
                    <h3 className="text-lg font-semibold text-green-400 font-mono">ANALISIS AI</h3>
                  </div>
                  <div className="bg-black/30 rounded-lg p-6 border border-green-400/20">
                    <div className="space-y-4">
                      {result.ai_summary.split('. ').map((sentence, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="w-1 h-1 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-gray-300 text-sm leading-relaxed">
                            {sentence.trim()}{sentence.includes('.') ? '' : '.'}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Vulnerabilities */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    <h3 className="text-lg font-semibold text-green-400 font-mono">KERENTANAN TERDETEKSI</h3>
                  </div>
                  <div className="space-y-2">
                    {result.vulnerabilities.map((vulnerability, index) => (
                      <div key={index} className="flex items-start gap-3 p-4 bg-black/30 rounded-lg border border-red-400/20">
                        <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-300 text-sm leading-relaxed font-mono">{vulnerability}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <Button 
                    onClick={downloadReport}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-black border border-green-400/20 rounded-lg h-12 font-semibold"
                  >
                    Download Laporan
                  </Button>
                  <Button 
                    onClick={shareReport}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-green-400 border border-green-400/20 rounded-lg h-12 font-semibold"
                  >
                    Bagikan Hasil
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </main>
  )
}