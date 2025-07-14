"use client";
import React, { useState } from 'react';
import { Shield, AlertTriangle, CheckCircle, XCircle, Clock, TrendingUp, Zap, FileText, History, Search, RefreshCw, ExternalLink, Info, Lock, Eye, Users, Award, Star, Copy, Activity, Layers, Sparkles, Terminal, Code, Brain, ArrowRight, Play } from 'lucide-react';

const ContractSafetyChecker = () => {
  const [auditData, setAuditData] = useState<AuditData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState('');
  const [chain, setChain] = useState('ethereum');
  const [activeTab, setActiveTab] = useState('check');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [histLoad, setHistLoad] = useState(false);
  const [histError, setHistError] = useState<string | null>(null);

  interface VulnerabilityDetail {
    type: string;
    severity: 'Low' | 'Medium' | 'High' | 'Critical' | 'Informational';
    description: string;
    impact: string;
    recommendation: string;
    line_number?: number;
    function_name?: string;
  }

  interface SecurityMetrics {
    total_issues: number;
    critical_issues: number;
    high_issues: number;
    medium_issues: number;
    low_issues: number;
    informational_issues: number;
    code_quality_score: number;
    security_score: number;
  }

  interface AuditData {
    contract_address: string;
    chain: string;
    audit_timestamp: string;
    risk_level: 'Low' | 'Medium' | 'High' | 'Critical';
    risk_score: number;
    security_metrics: SecurityMetrics;
    vulnerabilities: VulnerabilityDetail[];
    ai_summary: string;
    recommendations: string[];
    gas_optimization_hints: string[];
    audit_file_path: string;
  }

  interface HistoryItem {
    timestamp: string;
    total_issues: number;
    file_path: string;
  }

  const checkContract = async () => {
    if (!address.trim()) {
      setError("Please enter a contract address");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:8000/audit-contract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, chain }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || "Unknown error");
      }

      const data: AuditData = await response.json();
      setAuditData(data);
      setActiveTab("results");
    } catch (err: any) {
      setError(err.message || "Failed to check contract safety.");
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async (addr: string) => {
    if (!addr) return;
    setHistLoad(true);
    setHistError(null);

    try {
      const res = await fetch(`http://localhost:8000/audit-history/${addr}`);
      if (!res.ok) throw new Error("Failed to fetch history");
      const data = await res.json();
      setHistory(data.history || []);
    } catch (e: any) {
      setHistError(e.message);
    } finally {
      setHistLoad(false);
    }
  };

  const openHistoryTab = () => {
    setActiveTab('history');
    fetchHistory(address);
  };

  const getUserRiskLevel = (risk?: string): string => {
    switch (risk?.toLowerCase()) {
      case 'low': return 'Safe to Use';
      case 'medium': return 'Use with Caution';
      case 'high': return 'High Risk';
      case 'critical': return 'Do Not Use';
      default: return 'Unknown';
    }
  };

  const getRiskColor = (risk?: string): string => {
    switch (risk?.toLowerCase()) {
      case 'low': return 'from-emerald-400 to-green-500';
      case 'medium': return 'from-amber-400 to-yellow-500';
      case 'high': return 'from-red-400 to-red-500';
      case 'critical': return 'from-red-500 to-red-700';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getRiskTextColor = (risk?: string): string => {
    switch (risk?.toLowerCase()) {
      case 'low': return 'text-emerald-400';
      case 'medium': return 'text-amber-400';
      case 'high': return 'text-red-400';
      case 'critical': return 'text-red-500';
      default: return 'text-gray-400';
    }
  };

  const getSeverityColor = (severity?: string): string => {
    switch (severity?.toLowerCase()) {
      case 'low': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'medium': return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'high': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'critical': return 'bg-red-600/20 text-red-200 border-red-600/30';
      case 'informational': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getRiskIcon = (risk?: string) => {
    switch (risk?.toLowerCase()) {
      case 'low': return <CheckCircle className="w-20 h-20 text-emerald-400" />;
      case 'medium': return <AlertTriangle className="w-20 h-20 text-amber-400" />;
      case 'high': return <XCircle className="w-20 h-20 text-red-400" />;
      case 'critical': return <XCircle className="w-20 h-20 text-red-500" />;
      default: return <Info className="w-20 h-20 text-gray-400" />;
    }
  };

  const getUserRecommendation = (risk?: string): string => {
    switch (risk?.toLowerCase()) {
      case 'low': return "This contract appears safe to interact with. No major security risks detected.";
      case 'medium': return "Exercise caution when using this contract. Some security concerns were found.";
      case 'high': return "High risk detected! Only interact with this contract if you understand the risks.";
      case 'critical': return "DO NOT USE this contract! Critical security flaws could result in loss of funds.";
      default: return "Unable to determine safety level. Exercise extreme caution.";
    }
  };

  const getUserFriendlyVuln = (vuln: VulnerabilityDetail) => {
    const userFriendlyTypes: Record<string, string> = {
      'reentrancy-eth': 'Reentrancy Attack Risk',
      'tx-origin': 'Unsafe Authentication',
      'unchecked-transfer': 'Unchecked Token Transfers',
      'uninitialized-state': 'Uninitialized Variables',
      'locked-ether': 'Trapped Funds Risk',
      'arbitrary-send': 'Arbitrary Fund Transfer',
      'controlled-array-length': 'Gas Limit Issues',
      'timestamp': 'Time Manipulation Risk',
      'weak-prng': 'Predictable Randomness',
      'suicidal': 'Contract Self-Destruct Risk'
    };

    const userImpacts: Record<string, string> = {
      'reentrancy-eth': 'Attackers could drain funds by repeatedly calling withdrawal functions',
      'tx-origin': 'Your transactions could be authorized by malicious contracts',
      'unchecked-transfer': 'Failed token transfers might not be detected, causing loss',
      'uninitialized-state': 'Contract behavior might be unpredictable',
      'locked-ether': 'Any ETH sent to this contract could be permanently stuck',
      'arbitrary-send': 'Contract owners can redirect your funds anywhere',
      'controlled-array-length': 'Transactions might fail due to gas limits',
      'timestamp': 'Time-based features can be manipulated by miners',
      'weak-prng': 'Random outcomes can be predicted and exploited',
      'suicidal': 'The contract can be destroyed, making your tokens worthless'
    };

    return {
      friendlyName: userFriendlyTypes[vuln.type] || vuln.type,
      userImpact: userImpacts[vuln.type] || vuln.description
    };
  };

  const RiskGauge: React.FC<{ score: number; label: string }> = ({ score, label }) => {
    const circumference = 2 * Math.PI * 45;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (score / 100) * circumference;
    const strokeColor = score >= 80 ? "#10b981" : score >= 60 ? "#f59e0b" : "#ef4444";

    return (
      <div className="flex flex-col items-center group">
        <div className="relative w-32 h-32 mb-6">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500"></div>
          <svg className="relative w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="rgba(71, 85, 105, 0.3)"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke={strokeColor}
              strokeWidth="8"
              fill="none"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
              style={{
                filter: `drop-shadow(0 0 8px ${strokeColor}40)`
              }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-3xl font-bold text-white">{score}</span>
            <span className="text-xs text-gray-400">/100</span>
          </div>
        </div>
        <p className="text-sm font-medium text-gray-300 text-center">{label}</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 relative overflow-hidden">
      {/* Hypernative-style Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-2xl"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(71,85,105,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(71,85,105,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

      {/* Hackathon Badge */}
      <div className="fixed top-6 right-6 z-50">
        <div className="bg-gray-900/90 backdrop-blur-xl rounded-xl p-3 border-gray-700/50 shadow-2xl hover:scale-105 transition-all duration-300">
          <div className="flex items-center space-x-2">
            <img
              src="https://hackathon.fekdi.co.id/img/hero/bi-hackathon-2025.webp"
              alt="BI - OJK Hackathon 2025"
              className="h-8 w-auto"
            />
            <div>
              <p className="text-xs font-semibold text-white">Built for BI - OJK</p>
              <p className="text-xs text-gray-400">Hackathon 2025</p>
            </div>
          </div>
        </div>
      </div>


      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Hypernative-style Hero Section */}
        <div className="text-center mb-20">
          {/* Hackathon Badge */}
          <div className="inline-flex items-center bg-gray-800/50 backdrop-blur-xl border-gray-700/50 rounded-full px-6 py-3 mb-8 shadow-xl">
            <img
              src="https://hackathon.fekdi.co.id/img/hero/bi-hackathon-2025.webp"
              alt="BI - OJK Hackathon 2025"
              className="h-5 sm:h-6 w-auto mr-3"
            />
            <span className="text-gray-300 font-medium text-sm">
              Proudly built for BI - OJK Hackathon 2025
            </span>
          </div>


          {/* Main Logo */}
          <div className="flex items-center justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl blur-2xl opacity-50 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-3xl shadow-2xl border-blue-400/30">
                <Shield className="w-16 h-16 text-white" />
              </div>
            </div>
          </div>

          {/* Hero Text */}
          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
              Auto Sentinel
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed font-light">
            Auto Sentinel stops web3 threats before they do any damage with the most accurate real-time
            advanced warning system powered by AI.
          </p>
        </div>

        {/* Hypernative-style Navigation */}
        <div className="flex justify-center mb-16">
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-2 border-gray-700/50 shadow-2xl">
            <div className="flex space-x-2">
              {[
                { id: 'check', label: 'Security Analysis', icon: Search },
                { id: 'results', label: 'Threat Report', icon: Shield, disabled: !auditData },
                { id: 'history', label: 'Analysis History', icon: History }
              ].map(({ id, label, icon: Icon, disabled }) => (
                <button
                  key={id}
                  onClick={() => id === 'history' ? openHistoryTab() : setActiveTab(id)}
                  disabled={disabled}
                  className={`px-8 py-4 rounded-xl font-medium transition-all duration-300 flex items-center space-x-3 ${activeTab === id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105 border-blue-400/30'
                    : disabled
                      ? 'text-gray-600 cursor-not-allowed'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Security Analysis Interface */}
        {activeTab === 'check' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-3xl p-10 border-gray-700/50 shadow-2xl">
              <div className="text-center mb-10">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-6 border-blue-500/30">
                  <Brain className="w-12 h-12 text-blue-400" />
                </div>
                <h2 className="text-4xl font-bold text-white mb-4">AI-Powered Threat Detection</h2>
                <p className="text-gray-300 text-lg">Real-time smart contract vulnerability assessment with advanced AI analysis</p>
              </div>

              {/* Feature Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {[
                  {
                    icon: Zap,
                    title: 'Real-time Analysis',
                    desc: 'Instant threat detection and assessment',
                    gradient: 'from-yellow-400 to-orange-500'
                  },
                  {
                    icon: Brain,
                    title: 'AI-Powered Detection',
                    desc: 'Advanced machine learning algorithms',
                    gradient: 'from-purple-400 to-pink-500'
                  },
                  {
                    icon: Shield,
                    title: 'Comprehensive Coverage',
                    desc: '50+ vulnerability patterns detected',
                    gradient: 'from-blue-400 to-cyan-500'
                  }
                ].map(({ icon: Icon, title, desc, gradient }, i) => (
                  <div key={i} className="bg-gray-900/50 rounded-xl p-6 border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 group">
                    <div className={`w-12 h-12 bg-gradient-to-r ${gradient} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-white font-semibold mb-2">{title}</h3>
                    <p className="text-gray-400 text-sm">{desc}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-4">
                    Smart Contract Address
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Enter contract address (0x...)"
                      className="w-full px-6 py-5 bg-gray-900/50 border-gray-700/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-white placeholder-gray-500 text-lg backdrop-blur-xl"
                    />
                    <Search className="absolute right-5 top-5 w-6 h-6 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-4">
                    Blockchain Network
                  </label>
                  <select
                    value={chain}
                    onChange={(e) => setChain(e.target.value)}
                    className="w-full px-6 py-5 bg-gray-900/50 border-gray-700/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-white text-lg backdrop-blur-xl"
                  >
                    <option value="ethereum" className="bg-gray-900">Ethereum Mainnet</option>
                    <option value="polygon" className="bg-gray-900">Polygon</option>
                    <option value="bsc" className="bg-gray-900">Binance Smart Chain</option>
                    <option value="arbitrum" className="bg-gray-900">Arbitrum</option>
                  </select>
                </div>

                <button
                  onClick={checkContract}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-6 px-8 rounded-xl font-semibold text-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-2xl flex items-center justify-center group border-blue-400/30"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-7 h-7 animate-spin mr-4" />
                      Analyzing Threats...
                    </>
                  ) : (
                    <>
                      <Shield className="w-7 h-7 mr-4 group-hover:rotate-12 transition-transform" />
                      Start Threat Detection
                      <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                {error && (
                  <div className="bg-red-500/20 border-red-500/30 rounded-xl p-6 flex items-center backdrop-blur-xl">
                    <XCircle className="w-6 h-6 text-red-400 mr-4" />
                    <span className="text-red-300 font-medium text-lg">{error}</span>
                  </div>
                )}

                {/* Sample Contracts */}
                <div className="bg-gray-900/50 rounded-xl p-8 border-gray-700/50 backdrop-blur-xl">
                  <h3 className="font-semibold text-white mb-6 flex items-center text-lg">
                    <Star className="w-6 h-6 mr-3 text-yellow-400" />
                    Test with Sample Contracts
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { address: "0xef9f4c0c3403d269c867c908e7f66748cc17f28a", name: "Low Risk Contract", risk: "SAFE", color: "emerald", icon: CheckCircle },
                      { address: "0xbbe4301e96961e3f0cb0d75eb1a1dbf982e8e59d", name: "Medium Risk Contract", risk: "CAUTION", color: "amber", icon: AlertTriangle },
                      { address: "0x0482a1e0d4e4f2628d27ec60112bd86b773de80a", name: "High Risk Contract", risk: "DANGER", color: "red", icon: XCircle }
                    ].map(({ address: addr, name, risk, color, icon: Icon }, i) => (
                      <button
                        key={i}
                        onClick={() => setAddress(addr)}
                        className="p-6 bg-gray-800/50 hover:bg-gray-700/50 rounded-xl border-gray-700/50 hover:border-gray-600/50 transition-all group text-left"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <Icon className={`w-6 h-6 text-${color}-400`} />
                          <span className={`text-${color}-400 text-sm font-bold px-3 py-1 bg-${color}-500/20 rounded-full border-${color}-500/30`}>
                            {risk}
                          </span>
                        </div>
                        <h4 className="text-white font-medium group-hover:text-gray-200 transition-colors">{name}</h4>
                        <p className="text-gray-400 text-sm mt-2">Click to test analysis</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Threat Report Results */}
        {activeTab === 'results' && auditData && (
          <div className="space-y-10">
            {/* Threat Status */}
            <div className="text-center">
              <div className="inline-flex flex-col items-center bg-gray-800/50 backdrop-blur-xl rounded-3xl p-12 border-gray-700/50 shadow-2xl">
                <div className="mb-8">
                  {getRiskIcon(auditData.risk_level)}
                </div>

                <h2 className="text-5xl font-bold text-white mb-6">
                  {getUserRiskLevel(auditData.risk_level)}
                </h2>

                <div className={`inline-flex px-8 py-4 rounded-full font-bold text-xl border-2 bg-gradient-to-r ${getRiskColor(auditData.risk_level)} text-white shadow-2xl border-white/20`}>
                  {auditData.risk_level.toUpperCase()} THREAT LEVEL
                </div>

                <div className="mt-8 bg-gray-900/50 rounded-2xl p-8 border-gray-700/50 max-w-3xl">
                  <h3 className="font-bold text-white mb-4 text-2xl">Threat Assessment</h3>
                  <p className="text-gray-300 text-lg leading-relaxed">{getUserRecommendation(auditData.risk_level)}</p>
                </div>
              </div>
            </div>

            {/* Threat Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "Threat Level",
                  value: auditData.risk_level.toUpperCase(),
                  icon: Shield,
                  color: getRiskTextColor(auditData.risk_level),
                  gradient: getRiskColor(auditData.risk_level)
                },
                {
                  title: "Total Threats",
                  value: auditData.security_metrics.total_issues,
                  icon: AlertTriangle,
                  color: "text-amber-400",
                  gradient: "from-amber-400 to-orange-500"
                },
                {
                  title: "Critical Threats",
                  value: auditData.security_metrics.critical_issues + auditData.security_metrics.high_issues,
                  icon: XCircle,
                  color: "text-red-400",
                  gradient: "from-red-400 to-red-600"
                },
                {
                  title: "Security Score",
                  value: `${auditData.security_metrics.security_score}/100`,
                  icon: Award,
                  color: "text-emerald-400",
                  gradient: "from-emerald-400 to-green-500"
                }
              ].map(({ title, value, icon: Icon, color, gradient }, i) => (
                <div key={i} className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 border-gray-700/50 shadow-xl hover:scale-105 transition-all duration-300 group">
                  <div className="flex items-center justify-between mb-6">
                    <div className={`p-4 rounded-xl bg-gradient-to-r ${gradient} bg-opacity-20 border-white/10`}>
                      <Icon className={`w-8 h-8 ${color}`} />
                    </div>
                    <div className={`text-3xl font-bold ${color}`}>{value}</div>
                  </div>
                  <p className="text-gray-300 font-medium text-lg">{title}</p>
                </div>
              ))}
            </div>

            {/* Security Analysis Metrics */}
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-10 border-gray-700/50 shadow-xl">
              <h3 className="text-3xl font-bold text-white mb-12 text-center flex items-center justify-center">
                <Activity className="w-8 h-8 mr-4 text-blue-400" />
                Threat Analysis Metrics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <RiskGauge score={auditData.security_metrics.security_score} label="Security Score" />
                <RiskGauge score={auditData.security_metrics.code_quality_score} label="Code Quality" />
                <RiskGauge score={auditData.risk_score} label="Overall Safety" />
              </div>
            </div>

            {/* AI Threat Analysis */}
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-10 border-gray-700/50 shadow-xl">
              <h3 className="text-3xl font-bold text-white mb-8 flex items-center">
                <Brain className="w-8 h-8 mr-4 text-purple-400" />
                AI Threat Analysis Report
              </h3>
              <div className="bg-gradient-to-r from-blue-500/10 to-purple-600/10 rounded-xl p-8 border-blue-500/20 backdrop-blur-sm">
                <p className="text-gray-200 leading-relaxed text-lg whitespace-pre-line">{auditData.ai_summary}</p>
              </div>
            </div>

            {/* Threat Vulnerabilities */}
            {auditData.vulnerabilities && auditData.vulnerabilities.length > 0 && (
              <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-10 border-red-500/30 shadow-xl">
                <h3 className="text-3xl font-bold text-red-400 mb-8 flex items-center">
                  <AlertTriangle className="w-8 h-8 mr-4" />
                  Critical Threats Detected
                </h3>
                <div className="space-y-8">
                  {auditData.vulnerabilities.map((vuln, index) => {
                    const friendlyVuln = getUserFriendlyVuln(vuln);
                    return (
                      <div key={index} className="bg-red-500/10 border-red-500/30 rounded-xl p-8 backdrop-blur-sm">
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex items-center">
                            <span className={`px-6 py-3 rounded-xl text-sm font-bold border ${getSeverityColor(vuln.severity)}`}>
                              {vuln.severity.toUpperCase()} THREAT
                            </span>
                            <h4 className="font-bold text-white ml-6 text-2xl">{friendlyVuln.friendlyName}</h4>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-gray-900/50 rounded-xl p-6 border-red-500/20">
                            <h5 className="font-bold text-red-300 mb-4 flex items-center text-lg">
                              <AlertTriangle className="w-5 h-5 mr-2" />
                              Threat Impact
                            </h5>
                            <p className="text-gray-200 leading-relaxed">{friendlyVuln.userImpact}</p>
                          </div>

                          <div className="bg-gray-900/50 rounded-xl p-6 border-blue-500/20">
                            <h5 className="font-bold text-blue-300 mb-4 flex items-center text-lg">
                              <Shield className="w-5 h-5 mr-2" />
                              Mitigation Strategy
                            </h5>
                            <p className="text-gray-200 leading-relaxed">{vuln.recommendation}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Contract Intelligence */}
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-10 border-gray-700/50 shadow-xl">
              <h3 className="text-3xl font-bold text-white mb-8 flex items-center">
                <FileText className="w-8 h-8 mr-4 text-cyan-400" />
                Contract Intelligence
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-3">Contract Address</label>
                    <div className="flex items-center bg-gray-900/50 rounded-xl p-4 border-gray-700/50">
                      <code className="font-mono text-sm text-gray-200 flex-1 break-all">
                        {auditData.contract_address}
                      </code>
                      <button
                        onClick={() => navigator.clipboard.writeText(auditData.contract_address)}
                        className="ml-4 text-blue-400 hover:text-blue-300 transition-colors p-2 hover:bg-blue-500/20 rounded-lg"
                      >
                        <Copy className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-3">Blockchain Network</label>
                    <div className="bg-gray-900/50 rounded-xl p-4 border-gray-700/50">
                      <p className="capitalize font-medium text-gray-200 text-lg">{auditData.chain}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-3">Analysis Timestamp</label>
                    <div className="bg-gray-900/50 rounded-xl p-4 border-gray-700/50">
                      <p className="font-medium text-gray-200 text-lg">
                        {new Date(auditData.audit_timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-3">Blockchain Explorer</label>
                    <a
                      href={`https://etherscan.io/address/${auditData.contract_address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-6 py-4 rounded-xl font-medium transition-all border-blue-500/30 group"
                    >
                      View on Etherscan
                      <ExternalLink className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Technology Badge */}
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-600/10 rounded-2xl p-10 border-blue-500/30 text-center backdrop-blur-xl">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-gradient-to-r from-blue-500/20 to-purple-600/20 p-6 rounded-full border-blue-500/30">
                  <Brain className="w-12 h-12 text-blue-400" />
                </div>
              </div>
              <h4 className="text-2xl font-bold text-white mb-4">Advanced AI Security Technology</h4>
              <p className="text-gray-300 max-w-3xl mx-auto text-lg leading-relaxed">
                Powered by next-generation artificial intelligence and machine learning algorithms.
                Our threat detection system analyzes patterns across millions of smart contracts to identify
                sophisticated attack vectors before they can cause damage.
              </p>
            </div>
          </div>
        )}

        {/* Analysis History */}
        {activeTab === 'history' && (
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-10 border-gray-700/50 shadow-xl">
            <h3 className="text-3xl font-bold text-white mb-8 flex items-center">
              <History className="w-8 h-8 mr-4 text-indigo-400" />
              Analysis History
            </h3>

            {histLoad && (
              <div className="text-center py-20">
                <div className="relative w-24 h-24 mx-auto mb-8">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-2xl opacity-50 animate-pulse"></div>
                  <div className="relative bg-gray-900/50 rounded-full p-6 border-gray-700/50">
                    <RefreshCw className="w-12 h-12 animate-spin text-blue-400" />
                  </div>
                </div>
                <p className="text-gray-300 text-xl">Loading analysis history...</p>
              </div>
            )}

            {histError && (
              <div className="bg-red-500/20 border-red-500/30 rounded-xl p-8 flex items-center backdrop-blur-xl">
                <XCircle className="w-8 h-8 text-red-400 mr-4" />
                <span className="text-red-300 font-medium text-lg">{histError}</span>
              </div>
            )}

            {!histLoad && history.length === 0 && !histError && (
              <div className="text-center py-24">
                <div className="relative w-32 h-32 mx-auto mb-10">
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full blur-2xl opacity-30"></div>
                  <div className="relative bg-gray-900/50 rounded-full p-8 border-gray-700/50">
                    <History className="w-16 h-16 text-gray-400" />
                  </div>
                </div>
                <h4 className="text-3xl font-bold text-white mb-6">No Analysis History</h4>
                <p className="text-gray-400 mb-10 text-lg">Start analyzing smart contracts to build your security history</p>
                <button
                  onClick={() => setActiveTab('check')}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-10 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 border-blue-400/30"
                >
                  Start First Analysis
                </button>
              </div>
            )}

            {!histLoad && history.length > 0 && (
              <div className="space-y-6">
                {history.map((h, i) => {
                  const formattedDate = new Date(
                    h.timestamp.replace(
                      /(\d{4})(\d{2})(\d{2})_(\d{2})(\d{2})(\d{2})/,
                      "$1-$2-$3T$4:$5:$6"
                    )
                  ).toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <div key={i} className="bg-gray-900/50 border-gray-700/50 rounded-xl hover:bg-gray-800/50 transition-all duration-300 group">
                      <button
                        onClick={async () => {
                          setLoading(true);
                          try {
                            const res = await fetch(`http://localhost:8000/load-audit-file?path=${encodeURIComponent(h.file_path)}&address=${address}&chain=${chain}`);
                            const result: AuditData = await res.json();
                            setAuditData(result);
                            setActiveTab("results");
                          } catch (err) {
                            alert("Failed to load analysis result");
                          } finally {
                            setLoading(false);
                          }
                        }}
                        className="w-full text-left p-8"
                        disabled={loading}
                      >
                        <div className={`flex flex-col md:flex-row md:items-center md:justify-between gap-6 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                          <div className="flex items-center">
                            <div className="bg-gradient-to-r from-blue-500/20 to-purple-600/20 p-5 rounded-xl border-blue-500/30 mr-6">
                              <FileText className="w-8 h-8 text-blue-400" />
                            </div>
                            <div>
                              <p className="font-bold text-white text-xl mb-2">{formattedDate}</p>
                              <p className="text-gray-400 text-lg">
                                Threats Found: <span className="font-medium text-amber-400">{h.total_issues}</span>
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center">
                            {loading ? (
                              <div className="text-blue-400 flex items-center">
                                <RefreshCw className="w-5 h-5 mr-3 animate-spin" />
                                <span className="font-medium text-lg">Loading...</span>
                              </div>
                            ) : (
                              <div className="bg-gradient-to-r from-blue-500/20 to-purple-600/20 text-blue-300 px-8 py-4 rounded-xl font-medium hover:from-blue-500/30 hover:to-purple-600/30 transition-all border-blue-500/30 group-hover:border-blue-400/50 flex items-center">
                                View Report
                                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Hypernative-style Footer */}
        <div className="text-center mt-24 py-16 border-t border-gray-700/50">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-12 text-left">
            {/* Logo BI-OJK */}
            <div className="flex items-center">
              <img
                src="https://hackathon.fekdi.co.id/img/hero/bi-hackathon-2025.webp"
                alt="BI Hackathon 2025"
                className="h-10 sm:h-12 md:h-16 w-auto"
              />
              <div className="ml-4">
                <p className="text-gray-400 text-sm">Proudly built for</p>
                <p className="font-bold text-white text-lg">BI - OJK Hackathon 2025</p>
              </div>
            </div>

            {/* Divider (hanya muncul di md ke atas) */}
            <div className="hidden md:block w-px h-16 bg-gray-600"></div>

            {/* Auto Sentinel Info */}
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-2xl border-blue-400/30">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div className="ml-4">
                <span className="text-white font-bold text-2xl">Auto Sentinel</span>
                <p className="text-gray-400 text-sm">By Anjay Mabar Team</p>
              </div>
            </div>
          </div>

          {/* Hackathon Description */}
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed mb-10">
            This cutting-edge security platform was developed during the hackathon to demonstrate
            the future of AI-powered blockchain security and threat detection.
          </p>

          {/* Feature Icons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center justify-center text-gray-400">
              <Lock className="w-6 h-6 mr-3 text-blue-400" />
              <span className="text-lg">Check Your Smart Contract</span>
            </div>
            <div className="flex items-center justify-center text-gray-400">
              <Brain className="w-6 h-6 mr-3 text-purple-400" />
              <span className="text-lg">AI-Powered Detection</span>
            </div>
            <div className="flex items-center justify-center text-gray-400">
              <Zap className="w-6 h-6 mr-3 text-cyan-400" />
              <span className="text-lg">Ai Analytics</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractSafetyChecker;