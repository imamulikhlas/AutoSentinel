import os
import subprocess
import json
import shutil
import platform
from datetime import datetime
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

app = FastAPI(title="Smart Contract Security Audit API", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_methods=["*"],
    allow_headers=["*"],
)

class ContractRequest(BaseModel):
    address: str
    chain: str

class VulnerabilityDetail(BaseModel):
    type: str
    severity: str
    description: str
    impact: str
    recommendation: str
    line_number: Optional[int] = None
    function_name: Optional[str] = None

class SecurityMetrics(BaseModel):
    total_issues: int
    critical_issues: int
    high_issues: int
    medium_issues: int
    low_issues: int
    informational_issues: int
    code_quality_score: int
    security_score: int

class AuditResult(BaseModel):
    contract_address: str
    chain: str
    audit_timestamp: str
    risk_level: str
    risk_score: int
    security_metrics: SecurityMetrics
    vulnerabilities: List[VulnerabilityDetail]
    ai_summary: str
    recommendations: List[str]
    gas_optimization_hints: List[str]
    audit_file_path: str

# Mapping severity levels
SEVERITY_MAPPING = {
    "High": {"score": 10, "priority": 1},
    "Medium": {"score": 5, "priority": 2},
    "Low": {"score": 2, "priority": 3},
    "Informational": {"score": 1, "priority": 4},
}

def parse_slither_results(slither_data: Dict) -> List[VulnerabilityDetail]:
    """Parse Slither results into detailed vulnerability objects"""
    vulnerabilities = []
    
    for detector in slither_data.get("results", {}).get("detectors", []):
        # Map Slither impact to our severity system
        impact_mapping = {
            "High": "High",
            "Medium": "Medium", 
            "Low": "Low",
            "Informational": "Informational"
        }
        
        severity = impact_mapping.get(detector.get("impact", "Low"), "Low")
        
        # Extract location information
        line_number = None
        function_name = None
        if detector.get("elements"):
            first_element = detector["elements"][0]
            if "source_mapping" in first_element:
                line_number = first_element["source_mapping"].get("lines", [None])[0]
            if first_element.get("type") == "function":
                function_name = first_element.get("name")
        
        vulnerability = VulnerabilityDetail(
            type=detector.get("check", "Unknown"),
            severity=severity,
            description=detector.get("description", "No description available"),
            impact=detector.get("impact", "Unknown"),
            recommendation=get_recommendation(detector.get("check", "")),
            line_number=line_number,
            function_name=function_name
        )
        vulnerabilities.append(vulnerability)
    
    return vulnerabilities

def get_recommendation(vulnerability_type: str) -> str:
    """Get specific recommendations based on vulnerability type"""
    recommendations = {
        "reentrancy-eth": "Implementasikan checks-effects-interactions pattern dan gunakan ReentrancyGuard",
        "tx-origin": "Gunakan msg.sender instead of tx.origin untuk otentikasi",
        "unchecked-transfer": "Selalu periksa return value dari transfer() atau gunakan SafeERC20",
        "uninitialized-state": "Inisialisasi semua state variables dengan nilai yang sesuai",
        "locked-ether": "Tambahkan fungsi withdrawal atau pastikan ada cara untuk mengeluarkan Ether",
        "arbitrary-send": "Validasi address tujuan sebelum mengirim Ether",
        "controlled-array-length": "Implementasikan batasan maksimal untuk array yang dapat dimodifikasi user",
        "timestamp": "Hindari penggunaan block.timestamp untuk logika kritis, gunakan alternatif yang lebih aman",
        "weak-prng": "Gunakan oracle atau commit-reveal scheme untuk randomness yang aman",
    }
    return recommendations.get(vulnerability_type, "Tinjau kembali kode dan ikuti best practices keamanan smart contract")

def calculate_security_metrics(vulnerabilities: List[VulnerabilityDetail]) -> SecurityMetrics:
    """Calculate comprehensive security metrics"""
    critical_issues = sum(1 for v in vulnerabilities if v.severity == "Critical")
    high_issues = sum(1 for v in vulnerabilities if v.severity == "High")
    medium_issues = sum(1 for v in vulnerabilities if v.severity == "Medium")
    low_issues = sum(1 for v in vulnerabilities if v.severity == "Low")
    informational_issues = sum(1 for v in vulnerabilities if v.severity == "Informational")
    
    total_issues = len(vulnerabilities)
    
    # Calculate weighted security score (0-100)
    if total_issues == 0:
        security_score = 100
    else:
        weighted_score = (
            critical_issues * 25 +
            high_issues * 15 +
            medium_issues * 8 +
            low_issues * 3 +
            informational_issues * 1
        )
        security_score = max(0, 100 - min(100, weighted_score))
    
    # Code quality score based on informational issues
    code_quality_score = max(0, 100 - (informational_issues * 5))
    
    return SecurityMetrics(
        total_issues=total_issues,
        critical_issues=critical_issues,
        high_issues=high_issues,
        medium_issues=medium_issues,
        low_issues=low_issues,
        informational_issues=informational_issues,
        code_quality_score=code_quality_score,
        security_score=security_score
    )

def run_slither(source_path: str, wallet_address: str) -> tuple[List[VulnerabilityDetail], str]:
    """Run Slither analysis and return detailed results"""
    slither_exe = shutil.which("slither") or shutil.which("slither.cmd")
    if not slither_exe:
        raise RuntimeError("❌ Slither tidak ditemukan di PATH.")

    # Create audit results directory
    audit_results_dir = "audit_results"
    os.makedirs(audit_results_dir, exist_ok=True)
    
    # Generate unique filename
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    wallet_short = wallet_address[:10]
    json_filename = f"slither_{wallet_short}_{timestamp}.json"
    json_filepath = os.path.join(audit_results_dir, json_filename)

    # Run Slither
    result = subprocess.run(
        [slither_exe, source_path, "--json", json_filepath],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )

    if not os.path.exists(json_filepath):
        raise RuntimeError(f"Gagal menjalankan Slither. Exit code: {result.returncode}")

    with open(json_filepath) as f:
        data = json.load(f)

    vulnerabilities = parse_slither_results(data)
    return vulnerabilities, json_filepath

def generate_detailed_summary(vulnerabilities: List[VulnerabilityDetail], metrics: SecurityMetrics) -> str:
    """Generate detailed AI summary using Gemini"""
    if not vulnerabilities:
        return "✅ Kontrak Anda tampak aman! Tidak ditemukan kerentanan kritis yang perlu segera ditangani."
    
    vuln_summary = []
    for vuln in vulnerabilities[:5]:  # Limit to top 5 vulnerabilities
        vuln_summary.append(f"- {vuln.type} ({vuln.severity}): {vuln.description}")
    
    prompt = f"""
    Analisis keamanan smart contract menunjukkan:
    
    📊 Metrics:
    - Total issues: {metrics.total_issues}
    - Critical: {metrics.critical_issues}, High: {metrics.high_issues}, Medium: {metrics.medium_issues}
    - Security Score: {metrics.security_score}/100
    
    🔍 Top Vulnerabilities:
    {chr(10).join(vuln_summary)}
    
    Buatlah ringkasan yang mudah dipahami untuk pengguna awam dengan:
    1. Ringkasan singkat kondisi keamanan kontrak
    2. Dampak utama dari kerentanan yang ditemukan
    3. Tingkat prioritas perbaikan
    4. Rekomendasi langkah selanjutnya
    
    Gunakan bahasa yang sederhana dan hindari istilah teknis yang rumit.
    """
    
    try:
        model = genai.GenerativeModel("gemini-2.0-flash")
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        return f"Ditemukan {metrics.total_issues} kerentanan dengan {metrics.critical_issues + metrics.high_issues} yang perlu segera ditangani. Security score: {metrics.security_score}/100"

def generate_recommendations(vulnerabilities: List[VulnerabilityDetail]) -> List[str]:
    """Generate prioritized recommendations"""
    recommendations = []
    
    # Group by severity
    high_severity = [v for v in vulnerabilities if v.severity in ["Critical", "High"]]
    medium_severity = [v for v in vulnerabilities if v.severity == "Medium"]
    
    if high_severity:
        recommendations.append("🚨 PRIORITAS TINGGI: Segera perbaiki kerentanan Critical dan High severity")
        for vuln in high_severity[:3]:  # Top 3 high severity
            recommendations.append(f"• {vuln.type}: {vuln.recommendation}")
    
    if medium_severity:
        recommendations.append("⚠️ PRIORITAS MENENGAH: Tangani kerentanan Medium severity")
        for vuln in medium_severity[:2]:  # Top 2 medium severity
            recommendations.append(f"• {vuln.type}: {vuln.recommendation}")
    
    # General recommendations
    recommendations.extend([
        "📋 Lakukan code review menyeluruh dengan tim development",
        "🔍 Pertimbangkan audit profesional untuk kontrak yang akan di-deploy",
        "📚 Implementasikan automated testing untuk mencegah regresi"
    ])
    
    return recommendations

def generate_gas_optimization_hints(vulnerabilities: List[VulnerabilityDetail]) -> List[str]:
    """Generate gas optimization suggestions"""
    hints = [
        "💡 Gunakan `uint256` instead of `uint8` untuk gas efficiency",
        "🔄 Implementasikan batch operations untuk mengurangi gas cost",
        "📦 Pertimbangkan storage packing untuk struct variables",
        "⚡ Gunakan `external` visibility untuk functions yang hanya dipanggil dari luar",
        "🗜️ Implementasikan lazy loading untuk data yang jarang diakses"
    ]
    
    # Add specific hints based on vulnerabilities found
    vuln_types = [v.type for v in vulnerabilities]
    if "controlled-array-length" in vuln_types:
        hints.insert(0, "📊 Batasi ukuran array untuk menghindari gas limit issues")
    
    return hints[:5]  # Return top 5 hints

@app.post("/audit-contract", response_model=AuditResult)
def audit_contract(data: ContractRequest):
    """Comprehensive smart contract security audit"""
    file_mapping = {
        "0xef9f4c0c3403d269c867c908e7f66748cc17f28a": "low-risk",
        "0xbbe4301e96961e3f0cb0d75eb1a1dbf982e8e59d": "medium-risk",
        "0x0482a1e0d4e4f2628d27ec60112bd86b773de80a": "high-risk"
    }
    
    if data.address not in file_mapping:
        raise HTTPException(
            status_code=404,
            detail=f"Contract address {data.address} not found in our database"
        )
    
    file = file_mapping[data.address]
    solidity_file = f"contracts/{file}.sol"
    
    # Verify contract file exists
    if not os.path.exists(solidity_file):
        raise HTTPException(
            status_code=500,
            detail=f"Contract file {solidity_file} not found"
        )
    
    try:
        # Run Slither analysis
        vulnerabilities, audit_file_path = run_slither(solidity_file, data.address)
        
        # Calculate security metrics
        metrics = calculate_security_metrics(vulnerabilities)
        
        # Determine overall risk level
        if metrics.critical_issues > 0 or metrics.high_issues >= 3:
            risk_level = "Critical"
            risk_score = metrics.security_score
        elif metrics.high_issues > 0 or metrics.medium_issues >= 5:
            risk_level = "High"
            risk_score = metrics.security_score
        elif metrics.medium_issues > 0 or metrics.low_issues >= 3:
            risk_level = "Medium"
            risk_score = metrics.security_score
        else:
            risk_level = "Low"
            risk_score = metrics.security_score
        
        # Generate AI summary and recommendations
        ai_summary = generate_detailed_summary(vulnerabilities, metrics)
        recommendations = generate_recommendations(vulnerabilities)
        gas_hints = generate_gas_optimization_hints(vulnerabilities)
        
        return AuditResult(
            contract_address=data.address,
            chain=data.chain,
            audit_timestamp=datetime.now().isoformat(),
            risk_level=risk_level,
            risk_score=risk_score,
            security_metrics=metrics,
            vulnerabilities=vulnerabilities,
            ai_summary=ai_summary,
            recommendations=recommendations,
            gas_optimization_hints=gas_hints,
            audit_file_path=audit_file_path
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Audit failed: {str(e)}"
        )

@app.get("/audit-history/{address}")
def get_audit_history(address: str):
    """Get audit history for a specific contract address"""
    audit_results_dir = "audit_results"
    if not os.path.exists(audit_results_dir):
        return {"history": []}
    
    wallet_short = address[:10]
    history_files = [
        f for f in os.listdir(audit_results_dir) 
        if f.startswith(f"slither_{wallet_short}_") and f.endswith(".json")
    ]
    
    history = []
    for file in sorted(history_files, reverse=True)[:10]:  # Last 10 audits
        file_path = os.path.join(audit_results_dir, file)
        try:
            with open(file_path, 'r') as f:
                data = json.load(f)
                history.append({
                    "timestamp": file.split('_')[-1].replace('.json', ''),
                    "total_issues": len(data.get("results", {}).get("detectors", [])),
                    "file_path": file_path
                })
        except:
            continue
    
    return {"address": address, "history": history}

@app.get("/load-audit-file", response_model=AuditResult)
def load_audit_file(path: str, address: Optional[str] = None, chain: Optional[str] = "ethereum"):
    """Load a previously saved audit result from a .json file"""
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="Audit file not found")

    with open(path, 'r') as f:
        slither_data = json.load(f)

    vulnerabilities = parse_slither_results(slither_data)
    metrics = calculate_security_metrics(vulnerabilities)

    # Risk level logic sama seperti /audit-contract
    if metrics.critical_issues > 0 or metrics.high_issues >= 3:
        risk_level = "Critical"
    elif metrics.high_issues > 0 or metrics.medium_issues >= 5:
        risk_level = "High"
    elif metrics.medium_issues > 0 or metrics.low_issues >= 3:
        risk_level = "Medium"
    else:
        risk_level = "Low"

    risk_score = metrics.security_score
    ai_summary = generate_detailed_summary(vulnerabilities, metrics)
    recommendations = generate_recommendations(vulnerabilities)
    gas_hints = generate_gas_optimization_hints(vulnerabilities)

    return AuditResult(
        contract_address=address or "0xUnknown",
        chain=chain,
        audit_timestamp=datetime.now().isoformat(),
        risk_level=risk_level,
        risk_score=risk_score,
        security_metrics=metrics,
        vulnerabilities=vulnerabilities,
        ai_summary=ai_summary,
        recommendations=recommendations,
        gas_optimization_hints=gas_hints,
        audit_file_path=path
    )
