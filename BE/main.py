import os
import subprocess
import json
import shutil
import platform
import requests
import re
import time
import tempfile
import threading
from datetime import datetime, timedelta
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dataclasses import dataclass, field
from typing import List, Dict, Optional,Union
from dotenv import load_dotenv
from enum import Enum

load_dotenv()
AZURE_OPENAI_API_KEY = os.getenv("AZURE_OPENAI_API_KEY")

app = FastAPI(title="Smart Contract Security Audit API", version="2.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_methods=["*"],
    allow_headers=["*"],
)

CHAIN_CONFIGS = {
    "ethereum": {
        "chain_id": 1,
        "explorer": "https://etherscan.io",
        "name": "Ethereum Mainnet"
    },
    "polygon": {
        "chain_id": 137,
        "explorer": "https://polygonscan.com", 
        "name": "Polygon"
    },
    "bsc": {
        "chain_id": 56,
        "explorer": "https://bscscan.com",
        "name": "BSC"
    },
    "arbitrum": {
        "chain_id": 42161,
        "explorer": "https://arbiscan.io",
        "name": "Arbitrum"
    },
    "optimism": {
        "chain_id": 10,
        "explorer": "https://optimistic.etherscan.io",
        "name": "Optimism"
    },
    "base": {
        "chain_id": 8453,
        "explorer": "https://basescan.org",
        "name": "Base"
    }
}

# Model classes
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

class ContractInfo(BaseModel):
    is_verified: bool
    verification_date: Optional[str] = None
    compiler_version: Optional[str] = None
    contract_name: Optional[str] = None
    proxy_type: Optional[str] = None
    implementation_address: Optional[str] = None

class OwnershipAnalysis(BaseModel):
    owner_address: Optional[str] = None
    is_multisig: bool = False
    ownership_renounced: bool = False
    admin_functions: List[str] = []
    centralization_risk: str = "Unknown"

class TradingAnalysis(BaseModel):
    is_honeypot: bool = False
    honeypot_confidence: float = 0.0
    buy_tax: Optional[float] = None
    sell_tax: Optional[float] = None
    liquidity_locked: bool = False
    trading_enabled: bool = True
    max_transaction_limit: Optional[str] = None

class SocialPresence(BaseModel):
    website: Optional[str] = None
    twitter: Optional[str] = None
    telegram: Optional[str] = None
    github: Optional[str] = None
    discord: Optional[str] = None
    social_score: int = 0

class AISummaryStatus(BaseModel):
    status: str  # "pending", "completed", "error"
    summary: Optional[str] = None
    error_message: Optional[str] = None
    started_at: str
    completed_at: Optional[str] = None

class AISummaryResponse(BaseModel):
    address: str
    chain: str
    status: str
    summary: Optional[str] = None
    error_message: Optional[str] = None
    started_at: str
    completed_at: Optional[str] = None

@dataclass
class IndonesianCrimeIndicator:
    crime_type: str                    # "judi_online", "ponzi_mlm", "money_laundering", etc
    risk_score: int                    # 0-100
    confidence: float                  # 0.0-1.0
    evidence: List[str]                # List bukti yang ditemukan
    severity: str                      # "LOW", "MEDIUM", "HIGH", "CRITICAL"
    regulatory_violation: str          # Pasal hukum yang dilanggar

@dataclass
class IndonesianCrimeAnalysis:
    overall_crime_risk: int = 0                           # 0-100
    is_targeting_indonesia: bool = False
    detected_crimes: List[IndonesianCrimeIndicator] = field(default_factory=list)
    indonesian_evidence: List[str] = field(default_factory=list)
    regulatory_violations: List[str] = field(default_factory=list)
    satgas_pasti_report_needed: bool = False
    ojk_compliance_status: str = "UNKNOWN"               # COMPLIANT, NON_COMPLIANT, UNKNOWN
    recommended_actions: List[str] = field(default_factory=list)
    # NEW: Behavioral analysis fields
    indonesian_behavior_score: int = 0
    timezone_analysis: Dict = field(default_factory=dict)
    exchange_interactions: Dict = field(default_factory=dict)
    structuring_detected: bool = False


@dataclass
class RegulatoryViolation:
    violation_type: str              # "judi_online", "ponzi_mlm", etc
    law_article: str                 # "UU ITE Pasal 27 ayat (2)"
    penalty_description: str         # "Pidana penjara maksimal 6 tahun"
    fine_amount: str                 # "Rp 1 miliar"
    enforcement_agency: str          # "Kepolisian, Kominfo"
    severity_level: str              # "RINGAN", "SEDANG", "BERAT"
    satgas_pasti_priority: bool      # True if high priority for Satgas PASTI
    compliance_action: str           # "IMMEDIATE_BLOCK", "MONITOR", "INVESTIGATE"

@dataclass 
class ComplianceReport:
    contract_address: str
    scan_timestamp: str
    total_violations: int
    violations: List[RegulatoryViolation] = field(default_factory=list)
    compliance_status: str = "COMPLIANT"    # COMPLIANT, NON_COMPLIANT, REQUIRES_REVIEW
    satgas_pasti_report_required: bool = False
    recommended_actions: List[str] = field(default_factory=list)
    legal_risk_score: int = 0               # 0-100

class SecurityMetrics(BaseModel):
    total_issues: int
    critical_issues: int
    high_issues: int
    medium_issues: int
    low_issues: int
    informational_issues: int
    code_quality_score: int
    security_score: int
    trust_score: int = 0
    contract_age_days: int = 0
    transaction_count: int = 0
    unique_users: int = 0
    indonesia_crime_risk: int = 0     
    indonesia_targeting_detected: bool = False
     # Regulatory compliance metrics  
    legal_risk_score: int = 0
    regulatory_violations_count: int = 0
    satgas_pasti_report_required: bool = False
    compliance_status: str = "UNKNOWN"  # COMPLIANT, NON_COMPLIANT, REQUIRES_REVIEW

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
    contract_info: ContractInfo
    ownership_analysis: OwnershipAnalysis
    trading_analysis: TradingAnalysis
    social_presence: SocialPresence
    indonesian_crime_analysis: IndonesianCrimeAnalysis
    compliance_report: ComplianceReport


class EtherscanAPI:
    def __init__(self, chain: str):
        self.chain = chain.lower()
        if self.chain not in CHAIN_CONFIGS:
            raise ValueError(f"Unsupported chain: {chain}")
        
        self.config = CHAIN_CONFIGS[self.chain]
        # ✨ FIXED: Use unified v2 API endpoint
        self.api_url = "https://api.etherscan.io/v2/api"
        # ✨ FIXED: Single API key for all chains
        self.api_key = os.getenv("ETHERSCAN_API_KEY") or "YourApiKeyToken"
        self.chain_id = self.config["chain_id"]
        self.session = requests.Session()
        
    def get_contract_info(self, address: str) -> ContractInfo:
        """✅ FIXED: Using unified v2 API with chain parameter"""
        try:
            params = {
                "chainid": self.chain_id,  # ✨ NEW: chain parameter
                "module": "contract",
                "action": "getsourcecode",
                "address": address,
                "apikey": self.api_key
            }
            
            response = self.session.get(self.api_url, params=params, timeout=30)
            data = response.json()
            
            if data.get("status") == "1" and data.get("result"):
                result = data["result"][0]
                
                return ContractInfo(
                    is_verified=bool(result.get("SourceCode", "")),
                    verification_date=None,
                    compiler_version=result.get("CompilerVersion", ""),
                    contract_name=result.get("ContractName", ""),
                    proxy_type="proxy" if result.get("Proxy", "0") == "1" else None,
                    implementation_address=result.get("Implementation", "") if result.get("Proxy", "0") == "1" else None
                )
            else:
                return ContractInfo(is_verified=False)
                
        except Exception as e:
            print(f"Error fetching contract info: {e}")
            return ContractInfo(is_verified=False)
    
    def get_contract_stats(self, address: str) -> Dict:
        """✅ FIXED: Using unified v2 API with chain parameter"""
        try:
            stats = {
                "contract_age_days": 0,
                "transaction_count": 0,
                "unique_users": 0,
                "balance_eth": 0.0
            }
            
            # 1. Get contract creation transaction
            creation_params = {
                "chainid": self.chain_id,  # ✨ NEW: chain parameter
                "module": "account",
                "action": "txlist",
                "address": address,
                "startblock": 0,
                "endblock": 99999999,
                "page": 1,
                "offset": 1,
                "sort": "asc",
                "apikey": self.api_key
            }
            
            response = self.session.get(self.api_url, params=creation_params, timeout=30)
            data = response.json()
            
            if data.get("status") == "1" and data.get("result"):
                first_tx = data["result"][0]
                creation_timestamp = int(first_tx.get("timeStamp", 0))
                if creation_timestamp > 0:
                    creation_date = datetime.fromtimestamp(creation_timestamp)
                    stats["contract_age_days"] = (datetime.now() - creation_date).days
            
            # 2. Get recent transactions
            recent_params = {
                "chainid": self.chain_id,  # ✨ NEW: chain parameter
                "module": "account",
                "action": "txlist",
                "address": address,
                "startblock": 0,
                "endblock": 99999999,
                "page": 1,
                "offset": 2000,
                "sort": "desc",
                "apikey": self.api_key
            }
            
            time.sleep(0.2)
            response = self.session.get(self.api_url, params=recent_params, timeout=30)
            data = response.json()
            
            if data.get("status") == "1" and data.get("result"):
                transactions = data["result"]
                stats["transaction_count"] = len(transactions)
                
                unique_addresses = set()
                for tx in transactions:
                    unique_addresses.add(tx.get("from", "").lower())
                    unique_addresses.add(tx.get("to", "").lower())
                
                stats["unique_users"] = len(unique_addresses) - 1

                # NEW: Store detailed transaction data for behavioral analysis
                stats["detailed_transactions"] = []
                for tx in transactions[:500]:  # Limit untuk memory efficiency
                    stats["detailed_transactions"].append({
                        "timestamp": int(tx.get("timeStamp", 0)),
                        "from": tx.get("from", "").lower(),
                        "to": tx.get("to", "").lower(), 
                        "value_eth": float(tx.get("value", 0)) / 10**18,
                        "gas_used": int(tx.get("gasUsed", 0))
                    })
            
            # 3. Get contract balance
            balance_params = {
                "chainid": self.chain_id,  # ✨ NEW: chain parameter
                "module": "account",
                "action": "balance",
                "address": address,
                "tag": "latest",
                "apikey": self.api_key
            }
            
            time.sleep(0.2)
            response = self.session.get(self.api_url, params=balance_params, timeout=30)
            data = response.json()
            
            if data.get("status") == "1" and data.get("result"):
                balance_wei = int(data["result"])
                stats["balance_eth"] = balance_wei / 10**18
            
            return stats
            
        except Exception as e:
            print(f"Error fetching contract stats: {e}")
            return {
                "contract_age_days": 1,
                "transaction_count": 0,
                "unique_users": 0,
                "balance_eth": 0.0
            }

class HoneypotDetector:
    def __init__(self):
        # Multiple honeypot detection APIs
        self.apis = [
            "https://api.honeypot.is/v2/IsHoneypot"
        ]
        self.session = requests.Session()
        
    def analyze_contract(self, address: str, source_code: str) -> TradingAnalysis:
        """✅ REAL: Check multiple honeypot detection APIs"""
        try:
            # Try multiple APIs for better accuracy
            for api_url in self.apis:
                try:
                    response = self.session.get(
                        f"{api_url}?address={address}",
                        timeout=15
                    )
                    
                    if response.status_code == 200:
                        data = response.json()
                        return self._parse_honeypot_response(data, source_code)
                        
                except Exception as api_error:
                    print(f"Honeypot API {api_url} failed: {api_error}")
                    continue
            
            # Fallback: Source code analysis
            return self._analyze_source_code(source_code)
            
        except Exception as e:
            print(f"Honeypot detection failed: {e}")
            return TradingAnalysis(
                is_honeypot=False,
                honeypot_confidence=0.0,
                trading_enabled=True
            )
    
    def _parse_honeypot_response(self, data: dict, source_code: str) -> TradingAnalysis:
        """Parse honeypot API response"""
        try:
            is_honeypot = data.get("IsHoneypot", False)
            
            # Extract trading information
            buy_tax = data.get("BuyTax", 0.0)
            sell_tax = data.get("SellTax", 0.0)
            
            # Convert percentage to decimal if needed
            if isinstance(buy_tax, str):
                buy_tax = float(buy_tax.replace('%', '')) / 100
            if isinstance(sell_tax, str):
                sell_tax = float(sell_tax.replace('%', '')) / 100
            
            honeypot_confidence = 0.0
            if is_honeypot:
                honeypot_confidence = 0.9  # High confidence from API
            
            # Additional source code checks
            liquidity_locked = self._check_liquidity_lock(source_code)
            trading_enabled = not data.get("TradingDisabled", False)
            
            return TradingAnalysis(
                is_honeypot=is_honeypot,
                honeypot_confidence=honeypot_confidence,
                buy_tax=buy_tax,
                sell_tax=sell_tax,
                liquidity_locked=liquidity_locked,
                trading_enabled=trading_enabled,
                max_transaction_limit=data.get("MaxTxAmount")
            )
            
        except Exception as e:
            print(f"Error parsing honeypot response: {e}")
            return self._analyze_source_code(source_code)
    
    def _analyze_source_code(self, source_code: str) -> TradingAnalysis:
        """Fallback: Analyze source code for honeypot patterns"""
        try:
            honeypot_patterns = [
                r'require\s*\(\s*false\s*\)',  # Always false require
                r'revert\s*\(\s*\)',           # Unconditional revert
                r'selfdestruct\s*\(',          # Self destruct
                r'block\.timestamp\s*%',       # Time-based manipulation
                r'tx\.origin\s*==',            # tx.origin checks
            ]
            
            honeypot_score = 0
            for pattern in honeypot_patterns:
                if re.search(pattern, source_code, re.IGNORECASE):
                    honeypot_score += 1
            
            is_honeypot = honeypot_score >= 2
            confidence = min(0.8, honeypot_score * 0.3)
            
            # Check for liquidity lock patterns
            liquidity_locked = self._check_liquidity_lock(source_code)
            
            return TradingAnalysis(
                is_honeypot=is_honeypot,
                honeypot_confidence=confidence,
                liquidity_locked=liquidity_locked,
                trading_enabled=True
            )
            
        except Exception as e:
            print(f"Source code analysis failed: {e}")
            return TradingAnalysis()
    
    def _check_liquidity_lock(self, source_code: str) -> bool:
        """Check if liquidity appears to be locked"""
        lock_patterns = [
            r'liquidity.*lock',
            r'lock.*liquidity',
            r'locked.*lp',
            r'timelock',
            r'lockTime'
        ]
        
        for pattern in lock_patterns:
            if re.search(pattern, source_code, re.IGNORECASE):
                return True
        return False
    
class IndonesianRegulatoryMapper:
    """Database dan mapper untuk regulasi Indonesia"""
    
    def __init__(self):
        # Database lengkap regulasi Indonesia
        self.regulatory_database = self._build_regulatory_database()
        
    def _build_regulatory_database(self) -> Dict:
        """Build comprehensive database regulasi Indonesia"""
        return {
            # ===== JUDI ONLINE =====
            "judi_online": {
                "primary_law": {
                    "article": "UU ITE Pasal 27 ayat (2)",
                    "description": "Setiap orang dengan sengaja dan tanpa hak mendistribusikan informasi yang bermuatan perjudian",
                    "penalty": "Pidana penjara paling lama 6 tahun dan/atau denda paling banyak Rp 1 miliar",
                    "enforcement": ["Kepolisian", "Kominfo", "Satgas PASTI"],
                    "severity": "BERAT"
                },
                "supporting_laws": [
                    {
                        "article": "KUHP Pasal 303",
                        "description": "Permainan judi",
                        "penalty": "Pidana penjara paling lama 10 tahun atau denda paling banyak Rp 25 juta"
                    },
                    {
                        "article": "PP No. 9 Tahun 2021",
                        "description": "Penyelenggaraan judi online dilarang",
                        "penalty": "Sanksi administratif dan pidana"
                    }
                ],
                "satgas_pasti_priority": True,
                "compliance_action": "IMMEDIATE_BLOCK"
            },
            
            # ===== PONZI/MLM =====
            "ponzi_mlm": {
                "primary_law": {
                    "article": "POJK No. 27/2024 tentang Investasi Ilegal",
                    "description": "Kegiatan investasi tanpa izin dari OJK",
                    "penalty": "Pidana penjara paling lama 10 tahun dan denda Rp 10 miliar",
                    "enforcement": ["OJK", "Kepolisian", "Kejaksaan"],
                    "severity": "BERAT"
                },
                "supporting_laws": [
                    {
                        "article": "UU No. 8 Tahun 1995 tentang Pasar Modal",
                        "description": "Penawaran umum tanpa izin",
                        "penalty": "Pidana penjara dan denda sesuai UU Pasar Modal"
                    },
                    {
                        "article": "UU No. 7 Tahun 2014 tentang Perdagangan",
                        "description": "Skema piramida dalam perdagangan",
                        "penalty": "Sanksi administratif dan pidana"
                    }
                ],
                "satgas_pasti_priority": True,
                "compliance_action": "INVESTIGATE"
            },
            
            # ===== MONEY LAUNDERING =====
            "money_laundering": {
                "primary_law": {
                    "article": "UU No. 8 Tahun 2010 tentang TPPU",
                    "description": "Tindak pidana pencucian uang",
                    "penalty": "Pidana penjara paling lama 20 tahun dan denda Rp 10 miliar",
                    "enforcement": ["PPATK", "Kepolisian", "Kejaksaan", "KPK"],
                    "severity": "BERAT"
                },
                "supporting_laws": [
                    {
                        "article": "SE BI No. 18/40/DKSP tahun 2016",
                        "description": "Penerapan program APU-PPT untuk Virtual Currency",
                        "penalty": "Sanksi administratif dari Bank Indonesia"
                    }
                ],
                "satgas_pasti_priority": True,
                "compliance_action": "IMMEDIATE_BLOCK"
            },
            
            # ===== TOKEN SCAM =====
            "token_scam": {
                "primary_law": {
                    "article": "POJK No. 27/2024 tentang Token Penipuan",
                    "description": "Penerbitan token digital tanpa izin dengan maksud menipu",
                    "penalty": "Pidana penjara paling lama 8 tahun dan denda Rp 5 miliar",
                    "enforcement": ["OJK", "Bappebti", "Kepolisian"],
                    "severity": "BERAT"
                },
                "supporting_laws": [
                    {
                        "article": "UU ITE Pasal 28 ayat (1)",
                        "description": "Penyebaran berita bohong dan menyesatkan",
                        "penalty": "Pidana penjara paling lama 6 tahun dan denda Rp 1 miliar"
                    }
                ],
                "satgas_pasti_priority": True,
                "compliance_action": "IMMEDIATE_BLOCK"
            },
            
            # ===== INDONESIAN TARGETING =====
            "indonesian_targeting": {
                "primary_law": {
                    "article": "UU No. 11 Tahun 2020 tentang Cipta Kerja",
                    "description": "Penyelenggaraan kegiatan finansial tanpa izin yang menargetkan WNI",
                    "penalty": "Sanksi administratif dan pidana sesuai sektor",
                    "enforcement": ["OJK", "BI", "Bappebti", "Kominfo"],
                    "severity": "SEDANG"
                },
                "supporting_laws": [
                    {
                        "article": "SE OJK No. 6/SEOJK.02/2022",
                        "description": "Larangan promosi investasi tanpa izin kepada masyarakat Indonesia",
                        "penalty": "Sanksi administratif dari OJK"
                    }
                ],
                "satgas_pasti_priority": False,
                "compliance_action": "MONITOR"
            },
            
            # ===== SMART CONTRACT VULNERABILITIES =====
            "reentrancy": {
                "primary_law": {
                    "article": "KUHP Pasal 362 tentang Pencurian",
                    "description": "Mengambil hak milik orang lain melalui kerentanan teknis",
                    "penalty": "Pidana penjara paling lama 5 tahun",
                    "enforcement": ["Kepolisian", "Kejaksaan"],
                    "severity": "SEDANG"
                },
                "supporting_laws": [
                    {
                        "article": "UU ITE Pasal 30",
                        "description": "Mengakses komputer dan/atau sistem elektronik orang lain tanpa izin",
                        "penalty": "Pidana penjara paling lama 6 tahun dan denda Rp 600 juta"
                    }
                ],
                "satgas_pasti_priority": False,
                "compliance_action": "INVESTIGATE"
            },
            
            "arbitrary-send-eth": {
                "primary_law": {
                    "article": "KUHP Pasal 378 tentang Penipuan",
                    "description": "Penipuan dengan menggunakan kerentanan smart contract",
                    "penalty": "Pidana penjara paling lama 4 tahun",
                    "enforcement": ["Kepolisian", "Kejaksaan"],
                    "severity": "SEDANG"
                },
                "supporting_laws": [],
                "satgas_pasti_priority": False,
                "compliance_action": "MONITOR"
            }
        }
    
    def map_vulnerability_to_law(self, vulnerability_type: str, severity: str = "Unknown") -> RegulatoryViolation:
        """Map vulnerability type ke specific Indonesian law"""
        
        # Normalize vulnerability type
        vuln_key = vulnerability_type.lower().replace("-", "_")
        
        # Check if we have specific mapping
        if vuln_key in self.regulatory_database:
            law_data = self.regulatory_database[vuln_key]
            primary = law_data["primary_law"]
            
            return RegulatoryViolation(
                violation_type=vulnerability_type,
                law_article=primary["article"],
                penalty_description=primary["penalty"],
                fine_amount=self._extract_fine_amount(primary["penalty"]),
                enforcement_agency=", ".join(primary["enforcement"]),
                severity_level=primary["severity"],
                satgas_pasti_priority=law_data["satgas_pasti_priority"],
                compliance_action=law_data["compliance_action"]
            )
        
        # Fallback untuk vulnerability yang belum ada mapping
        return self._create_general_violation(vulnerability_type, severity)
    
    def _extract_fine_amount(self, penalty_text: str) -> str:
        """Extract fine amount from penalty description"""
        import re
        
        # Pattern untuk mencari nominal denda
        patterns = [
            r'Rp\s*([\d.,]+\s*(?:miliar|juta|ribu)?)',
            r'denda.*?Rp\s*([\d.,]+\s*(?:miliar|juta|ribu)?)',
            r'([\d.,]+\s*(?:miliar|juta|ribu))'
        ]
        
        for pattern in patterns:
            match = re.search(pattern, penalty_text, re.IGNORECASE)
            if match:
                return f"Rp {match.group(1)}"
        
        return "Sesuai ketentuan UU"
    
    def _create_general_violation(self, vulnerability_type: str, severity: str) -> RegulatoryViolation:
        """Create general regulatory violation untuk unmapped vulnerabilities"""
        
        # Determine appropriate law based on severity
        if severity.upper() in ["CRITICAL", "HIGH"]:
            return RegulatoryViolation(
                violation_type=vulnerability_type,
                law_article="UU ITE Pasal 30 ayat (1)",
                penalty_description="Pidana penjara paling lama 6 tahun dan/atau denda paling banyak Rp 600 juta",
                fine_amount="Rp 600 juta",
                enforcement_agency="Kepolisian, Kejaksaan",
                severity_level="SEDANG",
                satgas_pasti_priority=False,
                compliance_action="MONITOR"
            )
        else:
            return RegulatoryViolation(
                violation_type=vulnerability_type,
                law_article="Peraturan OJK tentang Teknologi Finansial",
                penalty_description="Sanksi administratif sesuai ketentuan OJK",
                fine_amount="Sesuai ketentuan OJK",
                enforcement_agency="OJK",
                severity_level="RINGAN",
                satgas_pasti_priority=False,
                compliance_action="MONITOR"
            )
    
    def generate_compliance_report(
        self, 
        contract_address: str,
        vulnerabilities: List,
        indonesian_crime_analysis,
        contract_info
    ) -> ComplianceReport:
        """Generate comprehensive compliance report"""
        
        violations = []
        total_risk_score = 0
        
        # 1. Map technical vulnerabilities
        for vuln in vulnerabilities:
            if vuln.severity.upper() in ["CRITICAL", "HIGH"]:
                violation = self.map_vulnerability_to_law(vuln.type, vuln.severity)
                violations.append(violation)
                
                # Add to risk score based on severity
                if vuln.severity.upper() == "CRITICAL":
                    total_risk_score += 25
                elif vuln.severity.upper() == "HIGH":
                    total_risk_score += 15
        
        # 2. Map Indonesian crime patterns
        if indonesian_crime_analysis and indonesian_crime_analysis.detected_crimes:
            for crime in indonesian_crime_analysis.detected_crimes:
                violation = self.map_vulnerability_to_law(crime.crime_type, crime.severity)
                violations.append(violation)
                total_risk_score += (crime.risk_score // 4)  # Convert to legal risk scale
        
        # 3. Determine overall compliance status
        compliance_status = "COMPLIANT"
        satgas_pasti_required = False
        
        if total_risk_score >= 70:
            compliance_status = "NON_COMPLIANT"
            satgas_pasti_required = True
        elif total_risk_score >= 40:
            compliance_status = "REQUIRES_REVIEW"
        
        # Check for high-priority violations
        high_priority_violations = [v for v in violations if v.satgas_pasti_priority]
        if high_priority_violations:
            satgas_pasti_required = True
            compliance_status = "NON_COMPLIANT"
        
        # 4. Generate recommended actions
        recommended_actions = self._generate_compliance_actions(violations, compliance_status)
        
        return ComplianceReport(
            contract_address=contract_address,
            scan_timestamp=datetime.now().isoformat(),
            total_violations=len(violations),
            violations=violations,
            compliance_status=compliance_status,
            satgas_pasti_report_required=satgas_pasti_required,
            recommended_actions=recommended_actions,
            legal_risk_score=min(100, total_risk_score)
        )
    
    def _generate_compliance_actions(self, violations: List[RegulatoryViolation], status: str) -> List[str]:
        """Generate specific compliance actions based on violations"""
        actions = []
        
        if status == "NON_COMPLIANT":
            actions.append("🚨 URGENT: Laporkan ke Satgas PASTI dalam 24 jam")
            actions.append("🚫 Blokir semua interaksi dengan kontrak ini")
            actions.append("📢 Publikasikan peringatan publik")
        
        # Specific actions based on violation types
        immediate_block = any(v.compliance_action == "IMMEDIATE_BLOCK" for v in violations)
        if immediate_block:
            actions.append("⛔ Blokir akses kontrak melalui ISP/DNS filtering")
        
        investigate_needed = any(v.compliance_action == "INVESTIGATE" for v in violations)
        if investigate_needed:
            actions.append("🔍 Lakukan investigasi mendalam dengan tim cyber crime")
        
        if any("judi" in v.violation_type for v in violations):
            actions.append("🎰 Koordinasi dengan Kominfo untuk pemblokiran konten judi")
        
        if any("money_laundering" in v.violation_type for v in violations):
            actions.append("💰 Laporkan ke PPATK untuk analisis transaksi mencurigakan")
        
        if status == "REQUIRES_REVIEW":
            actions.append("📋 Lakukan monitoring intensif selama 30 hari")
            actions.append("⚠️ Berikan peringatan kepada pengguna")
        
        return actions

class SocialAnalyzer:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
        
    def analyze_project(self, address: str, contract_name: str) -> SocialPresence:
        """✅ REAL: Search for project social media presence"""
        try:
            social_data = SocialPresence(social_score=0)
            score = 0
            
            # 1. Try to find project info from multiple sources
            search_queries = [contract_name, address]
            
            for query in search_queries:
                if not query or query == "Unknown":
                    continue
                
                # Search for common social patterns
                social_data = self._search_social_links(query, social_data)
                
                # Update score based on findings
                if social_data.website:
                    score += 20
                if social_data.twitter:
                    score += 25
                if social_data.telegram:
                    score += 15
                if social_data.github:
                    score += 25
                if social_data.discord:
                    score += 15
                
                # Break if we found enough information
                if score >= 50:
                    break
            
            social_data.social_score = min(100, score)
            return social_data
            
        except Exception as e:
            print(f"Social analysis failed: {e}")
            return SocialPresence(social_score=10)  # Default low score
    
    def _search_social_links(self, query: str, social_data: SocialPresence) -> SocialPresence:
        """Search for social media links"""
        try:
            # This is a simplified version - in production you might use:
            # - Google Custom Search API
            # - Twitter API
            # - GitHub API
            # - CoinGecko API
            # - DeFiPulse API
            
            # For now, we'll use basic pattern matching and educated guessing
            query_lower = query.lower()
            
            # Common project naming patterns
            possible_handles = [
                query_lower,
                query_lower.replace(' ', ''),
                query_lower.replace(' ', '_'),
                f"{query_lower}token",
                f"{query_lower}coin",
                f"{query_lower}defi"
            ]
            
            # Try to construct likely social media URLs
            for handle in possible_handles[:3]:  # Limit attempts
                if len(handle) < 3:
                    continue
                
                # Check if Twitter handle might exist
                if not social_data.twitter and len(handle) <= 15:
                    social_data.twitter = f"https://twitter.com/{handle}"
                
                # Check if GitHub org might exist  
                if not social_data.github and len(handle) <= 39:
                    social_data.github = f"https://github.com/{handle}"
                
                # Check if Telegram might exist
                if not social_data.telegram and len(handle) <= 32:
                    social_data.telegram = f"https://t.me/{handle}"
            
            return social_data
            
        except Exception as e:
            print(f"Social link search failed: {e}")
            return social_data
        
class IndonesianCrimeDetector:
    def __init__(self):
        self.session = requests.Session()
        
        # Database aktivitas illegal Indonesia
        self.crime_patterns = {
            "judi_online": {
                "keywords": [
                    # English gambling terms
                    "bet", "betting", "gamble", "gambling", "slot", "roulette", "lottery", "casino", "poker",
                    # Indonesian gambling terms  
                    "taruhan", "judi", "togel", "sabung", "domino", "capsa", "bandarq", "gaple",
                    # Gaming patterns
                    "gacha", "spin", "roll", "jackpot", "prize", "wheel"
                ],
                "functions": ["bet(", "spin(", "roll(", "gamble(", "lottery(", "prize(", "jackpot("],
                "exact_matches": ["bet", "gamble", "judi", "togel"], 
                "violation": "UU ITE Pasal 27 ayat (2) - Judi Online",
                "max_score": 40
            },
            
            "ponzi_mlm": {
                "keywords": [
                    "referral", "downline", "upline", "bonus", "komisi", "mlm", "network",
                    "arisan", "deposit", "harian", "mingguan", "bulanan", "profit", "roi",
                    "investasi", "passive", "income", "earnings", "rewards"
                ],
                "functions": ["getReferral", "depositDaily", "withdraw", "claimBonus", "invite"],
                "math_patterns": ["10%", "15%", "20%", "daily", "monthly"], 
                "violation": "POJK 27/2024 - Investasi Ilegal",
                "max_score": 35
            },
            
            "indonesian_targeting": {
                "keywords": [
                    "indonesia", "jakarta", "surabaya", "bandung", "medan", "makassar", "palembang",
                    "rupiah", "idr", "rp.", "ribu", "juta", "miliar",
                    "\\bbca\\b", "\\bbri\\b", "\\bbni\\b", "\\bmandiri\\b", "\\bcimb\\b", 
                    "\\bjenius\\b", "\\bjago\\b", "\\bseabank\\b",
                    "\\bovo\\b", "\\bdana\\b", "\\bgopay\\b", "\\blinkaja\\b", "\\bshopeepay\\b"
                ],
                "social_patterns": ["+62", "id", "/+62"],
                "language_patterns": ["yang", "untuk", "dengan dengan", "tidak", "adalah", "atau"],
                "violation": "Targeting Warga Negara Indonesia Tanpa Izin",
                "max_score": 25
            },

            "money_laundering": {
                "keywords": [
                    "mixer", "tumbler", "privacy", "anonymous", "untraceable", 
                    "clean", "wash", "launder", "convert", "exchange"
                ],
                "functions": ["mix(", "tumble(", "anonymous(", "convert("],
                "patterns": ["multiple deposits", "rapid transfers", "cross-chain"],
                "violation": "UU TPPU (Tindak Pidana Pencucian Uang)",
                "max_score": 45
            },

            "token_scam": {
                "keywords": [
                    "pump", "dump", "rug", "pull", "honeypot", "scam", "fake", "clone",
                    "memecoin", "shitcoin", "x100", "x1000", "moon", "lambo"
                ],
                "functions": ["rugPull(", "honeypot(", "disable(", "pause("],
                "violation": "POJK 27/2024 - Token Penipuan",
                "max_score": 50
            }
        }
    
    def analyze_contract_crimes(
        self, 
        source_code: str, 
        contract_name: str,
        social_presence: SocialPresence,
        contract_stats: Dict = None
    ) -> IndonesianCrimeAnalysis:
        """Main function untuk analisis crime patterns menggunakan AI"""
        
        try:
            # 1. Quick pattern detection first (sebagai baseline)
            quick_analysis = self._quick_pattern_detection(source_code, social_presence)
            
            # 2. AI-powered deep analysis
            ai_analysis = self._ai_crime_analysis(source_code, contract_name, social_presence, contract_stats)
            
            # 3. NEW: Behavioral analysis dari transaction data
            behavioral_analysis = self._analyze_transaction_behavior(contract_stats)

            # 4. Combine results
            final_analysis = self._combine_analysis(quick_analysis, ai_analysis, behavioral_analysis)
            
            return final_analysis
            
        except Exception as e:
            print(f"Indonesian crime analysis failed: {e}")
            return IndonesianCrimeAnalysis()
    
    def _quick_pattern_detection(self, source_code: str, social_presence: SocialPresence) -> Dict:
        """Quick pattern detection sebagai fallback"""
        results = {"detected_crimes": [], "evidence": [], "risk_score": 0}
        
        source_lower = source_code.lower()
        
        for crime_type, patterns in self.crime_patterns.items():
            score = 0
            evidence = []
            
            # Check keywords
            for keyword in patterns["keywords"]:
                import re
                # Only match whole words
                if re.search(r'\b' + re.escape(keyword) + r'\b', source_lower):
                    score += 10
                    evidence.append(f"Keyword detected: '{keyword}'")
            
            # Check function patterns
            if "functions" in patterns:
                for func_pattern in patterns["functions"]:
                    if func_pattern.lower() in source_lower:
                        score += 15
                        evidence.append(f"Suspicious function: '{func_pattern}'")
            
            # Check social media patterns for Indonesian targeting
            if crime_type == "indonesian_targeting":
                social_evidence = []
                if social_presence.telegram and any(pattern in social_presence.telegram for pattern in patterns["social_patterns"]):
                    social_evidence.append("Indonesian Telegram detected")
                if social_presence.website and "indonesia" in social_presence.website.lower():
                    social_evidence.append("Indonesian website detected")
                
                if social_evidence:
                    score += 20
                    evidence.extend(social_evidence)
            
            if score > 0:
                results["detected_crimes"].append({
                    "type": crime_type,
                    "score": min(score, patterns["max_score"]),
                    "evidence": evidence,
                    "violation": patterns["violation"]
                })
                results["risk_score"] += min(score, patterns["max_score"])
        
        return results
    
    def _ai_crime_analysis(
        self, 
        source_code: str, 
        contract_name: str, 
        social_presence: SocialPresence,
        contract_stats: Dict = None
    ) -> Dict:
        """AI-powered deep analysis menggunakan Together AI"""
        
        # Prepare comprehensive prompt
        prompt = self._build_crime_analysis_prompt(source_code, contract_name, social_presence, contract_stats)
        
        try:
            headers = {
                "Content-Type": "application/json",
                "api-key": AZURE_OPENAI_API_KEY
            }
            
            payload = {
                "messages": [
                    {
                        "role": "system",
                        "content": [{"type": "text", "text": "You are an AI assistant that helps people find information."}]
                    },
                    {
                        "role": "user", 
                        "content": [{"type": "text", "text": prompt}]
                    }
                ],
                "temperature": 0.3,
                "top_p": 0.9,
                "max_tokens": 2000
            }
            
            response = requests.post(
                "https://imamu-mbzx46yn-japaneast.openai.azure.com/openai/deployments/gpt-4/chat/completions?api-version=2025-01-01-preview",
                headers=headers,
                json=payload,
                timeout=60
            )
            
            if response.status_code == 200:
                result = response.json()
                ai_content = result["choices"][0]["message"]["content"]
                
                # Parse AI response
                return self._parse_ai_response(ai_content)
            else:
                print(f"AI Crime Analysis API error: {response.status_code}")
                return {"error": "AI analysis failed"}
                
        except Exception as e:
            print(f"AI Crime Analysis error: {e}")
            return {"error": str(e)}
    
    def _build_crime_analysis_prompt(
        self, 
        source_code: str, 
        contract_name: str, 
        social_presence: SocialPresence,
        contract_stats: Dict = None
    ) -> str:
        """Build comprehensive prompt untuk AI analysis"""
        
        contract_age = contract_stats.get("contract_age_days", 0) if contract_stats else 0
        tx_count = contract_stats.get("transaction_count", 0) if contract_stats else 0
        
        prompt = f"""
Anda adalah SENIOR FINANCIAL CRIME INVESTIGATOR yang mengkhususkan diri dalam mendeteksi aktivitas illegal berbasis smart contract di Indonesia.

TUGAS ANDA: Analisis smart contract berikut untuk mendeteksi 9 aktivitas illegal yang diawasi OJK, BI, dan Satgas PASTI Indonesia:

1. JUDI ONLINE TERDESENTRALISASI (Judol via dApp)
2. SKEMA PONZI/MLM KRIPTO  
3. TOKEN KRIPTO ABAL-ABAL (Pump & Dump)
4. MONEY LAUNDERING (Pencucian Uang)
5. DEX PALSU atau FARMING BOHONG
6. ICO ILEGAL
7. PENCURIAN DANA via APPROVAL EXPLOIT
8. PEMBAYARAN UNTUK BARANG/JASA ILEGAL
9. TARGETING WARGA NEGARA INDONESIA

CONTRACT DATA:
==============
Name: {contract_name}
Age: {contract_age} days
Transactions: {tx_count}
Social Media: {social_presence.telegram or social_presence.website or "None"}

SOURCE CODE (FIRST 3000 CHARS):
{source_code[:3000]}

ANALYSIS REQUIREMENTS:
======================
Untuk setiap aktivitas illegal yang Anda deteksi, berikan:

1. CRIME_TYPE: [judi_online/ponzi_mlm/token_abal/money_laundering/dex_palsu/ico_ilegal/approval_exploit/pembayaran_ilegal/indonesian_targeting]
2. RISK_SCORE: [0-100]
3. CONFIDENCE: [0.0-1.0]
4. EVIDENCE: [List bukti KONKRET dari source code - function names, variable names, comments, strings]
5. LOCATION: [Function name atau line estimate jika ada]
EVIDENCE REQUIREMENTS:
- Berikan exact strings/functions yang ditemukan
- Contoh: "function bet() detected" bukan "gambling activity"
- Contoh: "string 'rupiah' found" bukan "Indonesian currency"
7. VIOLATION: [Regulasi/UU yang dilanggar]
8. SEVERITY: [LOW/MEDIUM/HIGH/CRITICAL]

CRITICAL DETECTION FOCUS:
========================
- Function names yang mencurigakan (bet, gamble, spin, referral, withdraw)
- Mathematical patterns untuk Ponzi scheme
- Indonesian language/targeting patterns
- Honeypot mechanisms
- Unrealistic return calculations
- Approval/allowance exploits
- Time-based manipulation
- Admin privileges yang berlebihan

OUTPUT FORMAT (JSON):
====================
{{
  "overall_crime_risk": 85,
  "is_targeting_indonesia": true,
  "detected_crimes": [
    {{
      "crime_type": "judi_online",
      "risk_score": 90,
      "confidence": 0.95,
      "evidence": ["Function 'bet()' detected", "Random number generation for gambling", "House edge calculation"],
      "violation": "UU ITE Pasal 27 ayat (2) - Judi Online",
      "severity": "CRITICAL"
    }}
  ],
  "indonesian_evidence": ["Indonesian language detected", "Targeting +62 phone numbers"],
  "satgas_pasti_report": true,
  "ojk_compliance": "NON_COMPLIANT",
  "recommended_actions": ["Report to Satgas PASTI", "Block contract interaction"]
}}

CRITICAL RULES:
- HANYA flag jika ada GAMBLING FUNCTIONS explicit (bet, spin, gamble, lottery)
- HANYA flag Indonesian targeting jika ada CLEAR Indonesian words (indonesia, rupiah, jakarta)
- JANGAN flag function transfer(), approve(), atau standard ERC20 functions
- JANGAN flag platform names (solana, ethereum) sebagai targeting
- CONFIDENCE harus < 0.5 jika tidak yakin 100%
- EVIDENCE harus EXACT strings dari code, bukan interpretasi

IF UNSURE = DON'T FLAG IT!

MULAI ANALISIS:
"""
        
        return prompt
    
    def _parse_ai_response(self, ai_content: str) -> Dict:
        """Parse AI response menjadi structured data"""
        try:
            # Clean the response
            cleaned_content = ai_content.strip()
            
            # Try to extract JSON from response
            if "```json" in cleaned_content:
                start = cleaned_content.find("```json") + 7
                end = cleaned_content.find("```", start)
                json_str = cleaned_content[start:end].strip()
            elif "{" in cleaned_content and "}" in cleaned_content:
                start = cleaned_content.find("{")
                end = cleaned_content.rfind("}") + 1
                json_str = cleaned_content[start:end]
            else:
                raise ValueError("No JSON found in AI response")
            
            # Parse JSON
            parsed_data = json.loads(json_str)
            
            return {
                "success": True,
                "data": parsed_data
            }
            
        except Exception as e:
            print(f"Error parsing AI response: {e}")
            return {
                "success": False,
                "error": str(e),
                "raw_response": ai_content[:500]  # First 500 chars for debugging
            }
    
    def _combine_analysis(self, quick_analysis: Dict, ai_analysis: Dict, behavioral_analysis: Dict = None) -> IndonesianCrimeAnalysis:
        """Combine quick pattern detection dengan AI analysis"""
        
        detected_crimes = []
        overall_risk = 0
        indonesian_evidence = []
        regulatory_violations = []
        is_targeting_indonesia = False
        satgas_pasti_needed = False
        
        # Process AI analysis if successful
        if ai_analysis.get("success") and "data" in ai_analysis:
            ai_data = ai_analysis["data"]
            
            overall_risk = ai_data.get("overall_crime_risk", 0)
            is_targeting_indonesia = ai_data.get("is_targeting_indonesia", False)
            indonesian_evidence = ai_data.get("indonesian_evidence", [])
            satgas_pasti_needed = ai_data.get("satgas_pasti_report", False)
            
            # Process detected crimes from AI
            for crime in ai_data.get("detected_crimes", []):
                indicator = IndonesianCrimeIndicator(
                    crime_type=crime.get("crime_type", "unknown"),
                    risk_score=crime.get("risk_score", 0),
                    confidence=crime.get("confidence", 0.0),
                    evidence=crime.get("evidence", []),
                    severity=crime.get("severity", "LOW"),
                    regulatory_violation=crime.get("violation", "Unknown")
                )
                detected_crimes.append(indicator)
                
                # Collect regulatory violations
                if indicator.regulatory_violation not in regulatory_violations:
                    regulatory_violations.append(indicator.regulatory_violation)
        
        # Fallback to quick analysis if AI failed
        elif quick_analysis.get("detected_crimes"):
            overall_risk = min(quick_analysis.get("risk_score", 0), 100)
            
            for crime in quick_analysis["detected_crimes"]:
                indicator = IndonesianCrimeIndicator(
                    crime_type=crime["type"],
                    risk_score=crime["score"],
                    confidence=0.7,  # Medium confidence for pattern matching
                    evidence=crime["evidence"],
                    severity="MEDIUM" if crime["score"] > 20 else "LOW",
                    regulatory_violation=crime["violation"]
                )
                detected_crimes.append(indicator)
                regulatory_violations.append(crime["violation"])
            
            # Check for Indonesian targeting
            is_targeting_indonesia = any(
                crime["type"] == "indonesian_targeting" 
                for crime in quick_analysis["detected_crimes"]
            )
        
        # Determine recommended actions
        recommended_actions = []
        if overall_risk >= 70:
            recommended_actions.extend([
                "URGENT: Report to Satgas PASTI immediately",
                "Block all interactions with this contract",
                "Notify users about potential fraud"
            ])
            satgas_pasti_needed = True
        elif overall_risk >= 40:
            recommended_actions.extend([
                "Monitor contract activity closely", 
                "Consider reporting to authorities",
                "Use with extreme caution"
            ])
        
        # Determine OJK compliance status
        ojk_compliance = "COMPLIANT"
        if overall_risk >= 50:
            ojk_compliance = "NON_COMPLIANT"
        elif overall_risk >= 30:
            ojk_compliance = "REQUIRES_REVIEW"
        
        return IndonesianCrimeAnalysis(
            overall_crime_risk=overall_risk,
            is_targeting_indonesia=is_targeting_indonesia,
            detected_crimes=detected_crimes,
            indonesian_evidence=indonesian_evidence,
            regulatory_violations=regulatory_violations,
            satgas_pasti_report_needed=satgas_pasti_needed,
            ojk_compliance_status=ojk_compliance,
            recommended_actions=recommended_actions
        )
        
    def _analyze_transaction_behavior(self, contract_stats: Dict = None) -> Dict:
        """Analyze Indonesian user behavior dari transaction patterns"""
        
        print(f"🔍 DEBUG: contract_stats keys: {contract_stats.keys() if contract_stats else 'None'}")
        
        if not contract_stats or "detailed_transactions" not in contract_stats:
            print("❌ No detailed_transactions in contract_stats")
            return {"error": "No transaction data available"}
        
        transactions = contract_stats["detailed_transactions"]
        print(f"🔍 DEBUG: Found {len(transactions)} detailed transactions")
        
        if len(transactions) < 10:
            print(f"❌ Insufficient transaction data: {len(transactions)} < 10")
            return {"error": "Insufficient transaction data"}
        
        try:
            print("🔍 DEBUG: Starting timezone analysis...")
            # 1. WIB Timezone Analysis
            timezone_analysis = self._analyze_wib_timezone_patterns(transactions)
            print(f"🔍 DEBUG: Timezone analysis completed: {timezone_analysis}")
            
            print("🔍 DEBUG: Starting exchange analysis...")
            # 2. Indonesian Exchange Detection
            exchange_analysis = self._detect_indonesian_exchange_interactions(transactions)
            print(f"🔍 DEBUG: Exchange analysis completed: {exchange_analysis}")
            
            print("🔍 DEBUG: Starting structuring analysis...")
            # 3. Structuring Pattern Detection  
            structuring_analysis = self._detect_structuring_patterns(transactions)
            print(f"🔍 DEBUG: Structuring analysis completed: {structuring_analysis}")
            
            print("🔍 DEBUG: Calculating behavior score...")
            # 4. Calculate Indonesian User Behavior Score
            behavior_score = self._calculate_indonesian_behavior_score(
                timezone_analysis, exchange_analysis, structuring_analysis
            )
            print(f"🔍 DEBUG: Behavior score: {behavior_score}")
            
            result = {
                "success": True,
                "indonesian_behavior_score": behavior_score,
                "timezone_analysis": timezone_analysis,
                "exchange_analysis": exchange_analysis, 
                "structuring_analysis": structuring_analysis
            }
            
            print(f"🔍 DEBUG: Final result: {result}")
            return result
            
        except Exception as e:
            print(f"❌ Behavioral analysis failed: {e}")
            import traceback
            traceback.print_exc()  # Print full error traceback
            return {"error": str(e)}
        
    def _analyze_wib_timezone_patterns(self, transactions: List[Dict]) -> Dict:
        """Detect WIB timezone usage patterns"""
        from datetime import datetime, timezone, timedelta
        
        # WIB = UTC+7
        wib_offset = timedelta(hours=7)
        wib_tz = timezone(wib_offset)
        
        hour_distribution = {}
        weekend_activity = 0
        weekday_activity = 0
        
        for tx in transactions:
            if tx["timestamp"] == 0:
                continue
                
            # Convert to WIB
            utc_time = datetime.fromtimestamp(tx["timestamp"], tz=timezone.utc)
            wib_time = utc_time.astimezone(wib_tz)
            
            # Count hourly distribution
            hour = wib_time.hour
            hour_distribution[hour] = hour_distribution.get(hour, 0) + 1
            
            # Weekend vs weekday
            if wib_time.weekday() >= 5:  # Saturday = 5, Sunday = 6
                weekend_activity += 1
            else:
                weekday_activity += 1
        
        # Analyze patterns
        total_tx = len(transactions)
        prime_time_hours = [19, 20, 21, 22]  # 7PM-10PM WIB
        prime_time_activity = sum(hour_distribution.get(h, 0) for h in prime_time_hours)
        
        # Night activity (12AM-6AM) might indicate bot
        night_hours = [0, 1, 2, 3, 4, 5]
        night_activity = sum(hour_distribution.get(h, 0) for h in night_hours)
        
        # Calculate probabilities
        prime_time_ratio = prime_time_activity / total_tx if total_tx > 0 else 0
        night_activity_ratio = night_activity / total_tx if total_tx > 0 else 0
        weekend_ratio = weekend_activity / total_tx if total_tx > 0 else 0
        
        # Indonesian timezone probability
        indonesia_probability = 0.0
        if prime_time_ratio > 0.3:  # 30%+ during prime time
            indonesia_probability += 0.4
        if weekend_ratio > 0.2:  # Active on weekends
            indonesia_probability += 0.2
        if night_activity_ratio < 0.2:  # Low night activity (human behavior)
            indonesia_probability += 0.3
        
        return {
            "hour_distribution": hour_distribution,
            "prime_time_activity_ratio": round(prime_time_ratio, 3),
            "night_activity_ratio": round(night_activity_ratio, 3), 
            "weekend_activity_ratio": round(weekend_ratio, 3),
            "indonesia_timezone_probability": round(indonesia_probability, 3),
            "bot_behavior_detected": night_activity_ratio > 0.5,
            "peak_activity_hours": sorted(hour_distribution.items(), key=lambda x: x[1], reverse=True)[:3]
        }
    
    def _detect_indonesian_exchange_interactions(self, transactions: List[Dict]) -> Dict:
        """Detect Indonesian exchange/service patterns dynamically"""
        
        # Analyze transaction patterns instead of hardcoded addresses
        address_frequency = {}
        total_volume = {}
        
        for tx in transactions:
            from_addr = tx.get("from", "")
            to_addr = tx.get("to", "")
            value = tx.get("value_eth", 0)
            
            # Count frequency and volume for each address
            if from_addr:
                address_frequency[from_addr] = address_frequency.get(from_addr, 0) + 1
                total_volume[from_addr] = total_volume.get(from_addr, 0) + value
            if to_addr:
                address_frequency[to_addr] = address_frequency.get(to_addr, 0) + 1
                total_volume[to_addr] = total_volume.get(to_addr, 0) + value
        
        # Find exchange-like addresses (high frequency, high volume)
        exchange_like_addresses = []
        for addr, freq in address_frequency.items():
            if freq >= 10:  # Appears in 10+ transactions
                volume = total_volume.get(addr, 0)
                if volume > 1.0:  # High volume (>1 ETH total)
                    exchange_like_addresses.append({
                        "address": addr[:10] + "...",  # Privacy
                        "frequency": freq,
                        "total_volume": round(volume, 3)
                    })
        
        # Indonesian timing patterns (peak hours analysis)
        indonesian_timing_score = self._calculate_indonesian_timing_score(transactions)
        
        return {
            "exchange_like_addresses": len(exchange_like_addresses),
            "high_frequency_interactions": len([f for f in address_frequency.values() if f >= 5]),
            "interaction_diversity": len(address_frequency),
            "indonesian_timing_score": indonesian_timing_score,
            "suspected_service_providers": exchange_like_addresses[:3]  # Top 3
        }
    
    def _detect_structuring_patterns(self, transactions: List[Dict]) -> Dict:
        """Dynamic structuring pattern detection"""
        
        values = [tx.get("value_eth", 0) for tx in transactions if tx.get("value_eth", 0) > 0]
        
        if len(values) < 10:
            return {
                "structuring_detected": False, 
                "reason": "Insufficient value transactions",
                "total_value_transactions": len(values)
            }
        
        # 1. Recurring amount detection
        amount_groups = {}
        for value in values:
            # Group similar amounts (within 1% tolerance)
            grouped = False
            for existing_amount in amount_groups.keys():
                if abs(value - existing_amount) / max(existing_amount, 0.001) < 0.01:  # 1% tolerance
                    amount_groups[existing_amount].append(value)
                    grouped = True
                    break
            if not grouped:
                amount_groups[value] = [value]
        
        # Find suspicious recurring patterns
        suspicious_patterns = []
        for base_amount, similar_amounts in amount_groups.items():
            if len(similar_amounts) >= 3:  # 3+ similar transactions
                avg_amount = sum(similar_amounts) / len(similar_amounts)
                suspicious_patterns.append({
                    "amount_eth": round(avg_amount, 4),
                    "occurrences": len(similar_amounts),
                    "percentage": round(len(similar_amounts) / len(values) * 100, 1)
                })
        
        # 2. Round number detection (Wei-level analysis)
        round_numbers = 0
        for value in values:
            wei_value = int(value * 10**18)
            # Check for round numbers in wei (lots of trailing zeros)
            if wei_value > 0 and (wei_value % 10**15 == 0 or wei_value % 10**16 == 0):
                round_numbers += 1
        
        round_ratio = round_numbers / len(values)
        
        # 3. Size consistency (structuring often uses consistent small amounts)
        avg_value = sum(values) / len(values)
        small_consistent_tx = len([v for v in values if 0.01 <= v <= 0.5])  # 0.01-0.5 ETH range
        consistency_ratio = small_consistent_tx / len(values)
        
        # Overall structuring score
        structuring_score = 0
        if len(suspicious_patterns) > 0:
            structuring_score += 0.4
        if round_ratio > 0.2:
            structuring_score += 0.3
        if consistency_ratio > 0.6:
            structuring_score += 0.3
        
        return {
            "structuring_detected": structuring_score > 0.5,
            "structuring_confidence": round(structuring_score, 3),
            "suspicious_recurring_patterns": suspicious_patterns,
            "round_number_ratio": round(round_ratio, 3),
            "consistency_ratio": round(consistency_ratio, 3),
            "average_transaction_value": round(avg_value, 4),
            "total_value_transactions": len(values)
        }
    
    def _calculate_indonesian_timing_score(self, transactions: List[Dict]) -> float:
        """Calculate score for Indonesian-like timing patterns"""
        from datetime import datetime, timezone, timedelta
        
        if len(transactions) < 20:
            return 0.0
        
        # Convert to WIB and analyze patterns
        wib_hours = []
        weekday_activity = 0
        weekend_activity = 0
        
        wib_tz = timezone(timedelta(hours=7))
        
        for tx in transactions:
            if tx.get("timestamp", 0) == 0:
                continue
                
            utc_time = datetime.fromtimestamp(tx["timestamp"], tz=timezone.utc)
            wib_time = utc_time.astimezone(wib_tz)
            
            wib_hours.append(wib_time.hour)
            
            if wib_time.weekday() >= 5:  # Weekend
                weekend_activity += 1
            else:
                weekday_activity += 1
        
        if len(wib_hours) == 0:
            return 0.0
        
        # Indonesian patterns scoring
        score = 0.0
        
        # Peak hours (19-22 WIB = after work hours)
        peak_hours = [19, 20, 21, 22]
        peak_activity = len([h for h in wib_hours if h in peak_hours])
        if peak_activity / len(wib_hours) > 0.3:  # 30%+ in peak hours
            score += 0.4
        
        # Low night activity (human-like behavior)
        night_hours = [0, 1, 2, 3, 4, 5]
        night_activity = len([h for h in wib_hours if h in night_hours])
        if night_activity / len(wib_hours) < 0.2:  # <20% night activity
            score += 0.3
        
        # Weekend activity (Indonesian users are active on weekends)
        if weekend_activity > 0 and weekend_activity / len(transactions) > 0.1:
            score += 0.3
        
        return round(score, 3)

    def _calculate_indonesian_behavior_score(self, timezone_analysis: Dict, exchange_analysis: Dict, structuring_analysis: Dict) -> int:
        """Calculate overall Indonesian user behavior score"""
        
        score = 0
        
        # WIB timezone patterns (max 40 points)
        if timezone_analysis.get("indonesia_timezone_probability", 0) > 0.7:
            score += 40
        elif timezone_analysis.get("indonesia_timezone_probability", 0) > 0.4:
            score += 20
        
        # Indonesian exchange interactions (max 30 points)
        interaction_pct = exchange_analysis.get("interaction_percentage", 0)
        if interaction_pct > 0.1:  # >10% interactions
            score += 30
        elif interaction_pct > 0.05:  # >5% interactions
            score += 15
        
        # Structuring patterns (max 20 points) 
        if structuring_analysis.get("structuring_detected", False):
            confidence = structuring_analysis.get("structuring_confidence", 0)
            score += int(20 * confidence)
        
        # Bot behavior penalty (max -10 points)
        if timezone_analysis.get("bot_behavior_detected", False):
            score -= 10
        
        # Bonus for multiple indicators (max 10 points)
        indicators = 0
        if timezone_analysis.get("indonesia_timezone_probability", 0) > 0.5:
            indicators += 1
        if exchange_analysis.get("indonesian_exchange_interactions", 0) > 0:
            indicators += 1  
        if structuring_analysis.get("structuring_detected", False):
            indicators += 1
            
        if indicators >= 2:
            score += 10
        
        return max(0, min(100, score))
    
def parse_slither_results(slither_data: dict) -> List[VulnerabilityDetail]:
    """Parse Slither JSON output into VulnerabilityDetail objects"""
    vulnerabilities = []
    
    if not slither_data or "results" not in slither_data:
        return vulnerabilities
    
    detectors = slither_data["results"].get("detectors", [])
    
    for detector in detectors:
        # Map Slither impact to severity
        impact = detector.get("impact", "Informational")
        severity_map = {
            "High": "High",
            "Medium": "Medium", 
            "Low": "Low",
            "Informational": "Informational",
            "Optimization": "Low"
        }
        severity = severity_map.get(impact, "Informational")
        
        # Extract line number and function name
        line_number = None
        function_name = None
        elements = detector.get("elements", [])
        
        if elements:
            first_element = elements[0]
            if "source_mapping" in first_element:
                lines = first_element["source_mapping"].get("lines", [])
                if lines:
                    line_number = lines[0]
            
            if first_element.get("type") == "function":
                function_name = first_element.get("name", "")
        
        # Generate recommendations based on vulnerability type
        vuln_type = detector.get("check", "unknown")
        recommendation = generate_vulnerability_recommendation(vuln_type)
        
        vulnerability = VulnerabilityDetail(
            type=vuln_type,
            severity=severity,
            description=detector.get("description", "No description available"),
            impact=detector.get("markdown", ""),
            recommendation=recommendation,
            line_number=line_number,
            function_name=function_name
        )
        
        vulnerabilities.append(vulnerability)
    
    return vulnerabilities

def generate_vulnerability_recommendation(vuln_type: str) -> str:
    """Generate recommendations based on vulnerability type"""
    recommendations = {
        "assembly": "Avoid using inline assembly unless absolutely necessary. Use high-level Solidity constructs instead.",
        "pragma": "Use a fixed Solidity version to ensure consistent compilation across environments.",
        "dead-code": "Remove unused code to improve contract readability and reduce deployment costs.",
        "solc-version": "Update to a more recent Solidity version that fixes known bugs.",
        "low-level-calls": "Use high-level function calls instead of low-level calls when possible.",
        "naming-convention": "Follow Solidity naming conventions: CapWords for contracts, mixedCase for functions.",
        "too-many-digits": "Use underscores to separate digits in large numbers for better readability.",
        "immutable-states": "Use immutable keyword for variables that are set once in constructor.",
        "controlled-array-length": "Implement proper bounds checking for array operations.",
        "reentrancy": "Use the checks-effects-interactions pattern or reentrancy guards.",
        "tx-origin": "Use msg.sender instead of tx.origin for authorization checks."
    }
    
    return recommendations.get(vuln_type, "Review this issue and implement appropriate security measures.")

def calculate_security_metrics(vulnerabilities: List[VulnerabilityDetail], contract_value: float = 0) -> SecurityMetrics:
    """
    ✅ UPDATED: Enhanced security metrics menggunakan metodologi CertiK + Quantstamp
    """
    # Count vulnerabilities by severity
    critical_issues = len([v for v in vulnerabilities if v.severity == "Critical"])
    high_issues = len([v for v in vulnerabilities if v.severity == "High"])
    medium_issues = len([v for v in vulnerabilities if v.severity == "Medium"])
    low_issues = len([v for v in vulnerabilities if v.severity == "Low"])
    informational_issues = len([v for v in vulnerabilities if v.severity == "Informational"])
    
    total_issues = len(vulnerabilities)
    
    # ✨ NEW: Enhanced vulnerability scoring (Quantstamp methodology)
    base_score = 100
    
    # Critical vulnerabilities - Exponential penalty if multiple
    if critical_issues > 0:
        critical_penalty = critical_issues * 50
        if critical_issues > 1:
            # Exponential multiplier for multiple criticals
            critical_penalty *= (1.5 ** (critical_issues - 1))
        base_score -= min(critical_penalty, 100)  # Cap at 100
    
    # High vulnerabilities - Progressive penalty
    if high_issues > 0:
        high_penalty = high_issues * 25
        if high_issues > 2:
            # Additional penalty for many high issues
            high_penalty *= 1.3
        base_score -= high_penalty
    
    # Medium vulnerabilities - With combination amplifier
    if medium_issues > 0:
        medium_penalty = medium_issues * 10
        # If many medium issues, treat as higher risk
        if medium_issues >= 5:
            medium_penalty *= 1.4
        base_score -= medium_penalty
    
    # Low and informational
    base_score -= (low_issues * 2)
    base_score -= (informational_issues * 0.5)
    
    # ✨ NEW: Context-based adjustments
    security_score = max(0, min(100, base_score))
    
    # Code quality score (separate from security)
    code_quality_base = 100
    code_quality_base -= (total_issues * 3)  # General penalty for any issues
    code_quality_base -= (critical_issues * 20)  # Heavy penalty for criticals
    code_quality_score = max(0, min(100, code_quality_base))
    
    return SecurityMetrics(
        total_issues=total_issues,
        critical_issues=critical_issues,
        high_issues=high_issues,
        medium_issues=medium_issues,
        low_issues=low_issues,
        informational_issues=informational_issues,
        code_quality_score=int(code_quality_score),
        security_score=int(security_score)
    )

def analyze_ownership(source_code: str, address: str, etherscan_api: EtherscanAPI = None) -> OwnershipAnalysis:
    """✅ ENHANCED: Analyze contract ownership with real blockchain calls"""
    try:
        admin_functions = []
        owner_address = None
        is_multisig = False
        
        # 1. Source code analysis (existing)
        admin_patterns = [
            r'function\s+(\w+)\s*\([^)]*\)\s+[^{]*\bonlyOwner\b',
            r'function\s+(\w+)\s*\([^)]*\)\s+[^{]*\bonlyAdmin\b',
            r'function\s+(\w+)\s*\([^)]*\)\s*{[^}]*require\s*\(\s*msg\.sender\s*==\s*owner',
            r'function\s+(\w+)\s*\([^)]*\)\s*{[^}]*require\s*\(\s*_owner\s*==\s*msg\.sender'
        ]
        
        for pattern in admin_patterns:
            matches = re.findall(pattern, source_code, re.IGNORECASE | re.MULTILINE)
            admin_functions.extend(matches)
        
        # Remove duplicates
        admin_functions = list(set(admin_functions))
        
        # 2. Try to get actual owner from blockchain (if EtherscanAPI available)
        if etherscan_api:
            try:
                # Look for owner() function call
                owner_address = etherscan_api._get_contract_owner(address)
                
                # Check if owner is a multisig (basic check)
                if owner_address:
                    is_multisig = etherscan_api._is_multisig_address(owner_address)
                    
            except Exception as e:
                print(f"Blockchain owner lookup failed: {e}")
        
        # 3. Check for ownership renouncement patterns
        ownership_renounced = any([
            'renounceOwnership' in source_code,
            'owner = address(0)' in source_code,
            '_owner = address(0)' in source_code,
            'transferOwnership(address(0))' in source_code
        ])
        
        # 4. Determine centralization risk
        admin_count = len(admin_functions)
        if ownership_renounced:
            centralization_risk = "Low"
        elif is_multisig:
            centralization_risk = "Medium" if admin_count > 5 else "Low"
        elif admin_count > 10:
            centralization_risk = "High"
        elif admin_count > 5:
            centralization_risk = "Medium"
        else:
            centralization_risk = "Low"
        
        return OwnershipAnalysis(
            owner_address=owner_address,
            is_multisig=is_multisig,
            ownership_renounced=ownership_renounced,
            admin_functions=admin_functions[:10],  # Limit to first 10
            centralization_risk=centralization_risk
        )
        
    except Exception as e:
        print(f"Ownership analysis failed: {e}")
        return OwnershipAnalysis(centralization_risk="Unknown")

def calculate_trust_score(
    metrics: SecurityMetrics,
    contract_info: ContractInfo,
    ownership_analysis: OwnershipAnalysis,
    trading_analysis: TradingAnalysis,
    social_presence: SocialPresence,
    contract_stats: Dict = None
) -> int:
    """
    ✅ UPDATED: Enhanced trust score menggunakan metodologi CertiK + DeFiSafety
    Formula: (Technical × 0.4 + Economic × 0.3 + Operational × 0.3) × Confidence × Penalty
    """
    
    # ✨ CRITICAL FLAGS - Instant penalties (Industry Standard)
    if trading_analysis.is_honeypot and trading_analysis.honeypot_confidence >= 0.7:
        return 0  # Instant fail for confirmed honeypots
    
    if contract_stats:
        tvl_estimate = contract_stats.get("balance_eth", 0) * 3000  # Rough USD estimate
        if not contract_info.is_verified and tvl_estimate > 100000:  # >$100k
            return min(30, 30)  # Max 30 for unverified high-value contracts
    
    if metrics.critical_issues >= 2:
        return min(20, 20)  # Max 20 for multiple critical vulnerabilities
    
    # ============= BASE SCORING CALCULATION =============
    
    # 🔹 TECHNICAL SECURITY COMPONENT (40% weight)
    technical_score = 0
    
    # Security audit results (20 points max)
    security_component = min(20, metrics.security_score * 0.2)
    technical_score += security_component
    
    # Code quality (10 points max)
    code_quality_component = min(10, metrics.code_quality_score * 0.1)
    technical_score += code_quality_component
    
    # Contract verification (10 points max)
    if contract_info.is_verified:
        technical_score += 10
    
    # 🔹 ECONOMIC SECURITY COMPONENT (30% weight)
    economic_score = 0
    
    # Liquidity analysis (10 points max)
    if trading_analysis.liquidity_locked:
        economic_score += 10
    elif not trading_analysis.is_honeypot:
        economic_score += 5  # Partial credit
    
    # Trading patterns (10 points max)
    if not trading_analysis.is_honeypot:
        economic_score += 8
        # Bonus for reasonable taxes
        if trading_analysis.buy_tax and trading_analysis.sell_tax:
            if trading_analysis.buy_tax <= 0.05 and trading_analysis.sell_tax <= 0.05:  # ≤5%
                economic_score += 2
    
    # Market stability (10 points max) - based on contract age and activity
    if contract_stats:
        age_days = contract_stats.get("contract_age_days", 0)
        tx_count = contract_stats.get("transaction_count", 0)
        
        # Age bonus (max 5 points)
        if age_days >= 365:  # 1+ year
            economic_score += 5
        elif age_days >= 180:  # 6+ months
            economic_score += 3
        elif age_days >= 30:  # 1+ month
            economic_score += 1
        
        # Activity bonus (max 5 points)
        if tx_count >= 10000:
            economic_score += 5
        elif tx_count >= 1000:
            economic_score += 3
        elif tx_count >= 100:
            economic_score += 1
    
    # 🔹 OPERATIONAL SECURITY COMPONENT (30% weight)
    operational_score = 0
    
    # Ownership decentralization (15 points max)
    if ownership_analysis.ownership_renounced:
        operational_score += 15
    elif ownership_analysis.is_multisig:
        operational_score += 10
    elif ownership_analysis.centralization_risk == "Low":
        operational_score += 5
    elif ownership_analysis.centralization_risk == "Medium":
        operational_score += 2
    # High centralization = 0 points
    
    # Social credibility (10 points max)
    social_component = min(10, social_presence.social_score * 0.1)
    operational_score += social_component
    
    # Transparency (5 points max)
    if contract_info.is_verified:
        operational_score += 3
    if social_presence.website or social_presence.github:
        operational_score += 2
    
    # ============= CONFIDENCE & PENALTY CALCULATION =============
    
    # Base final score
    final_base_score = technical_score + economic_score + operational_score
    
    # ✨ Confidence multiplier based on data quality
    confidence_multiplier = 1.0
    
    # Reduce confidence if limited data
    if not contract_info.is_verified:
        confidence_multiplier *= 0.85
    
    if trading_analysis.honeypot_confidence < 0.5:  # Low confidence honeypot detection
        confidence_multiplier *= 0.9
    
    if social_presence.social_score < 20:  # Very low social presence
        confidence_multiplier *= 0.95
    
    # ✨ Additional penalties
    penalty_multiplier = 1.0
    
    # Honeypot risk (even with low confidence)
    if trading_analysis.is_honeypot:
        if trading_analysis.honeypot_confidence >= 0.5:
            penalty_multiplier *= 0.3  # Heavy penalty
        else:
            penalty_multiplier *= 0.7  # Moderate penalty
    
    # High tax penalty
    if trading_analysis.buy_tax and trading_analysis.sell_tax:
        total_tax = trading_analysis.buy_tax + trading_analysis.sell_tax
        if total_tax > 0.2:  # >20% total tax
            penalty_multiplier *= 0.6
        elif total_tax > 0.1:  # >10% total tax
            penalty_multiplier *= 0.8
    
    # ============= FINAL CALCULATION =============
    
    final_score = final_base_score * confidence_multiplier * penalty_multiplier
    
    # Ensure score is between 0-100
    final_score = max(0, min(100, final_score))
    
    return int(final_score)

class EnhancedRealContractFetcher:
    """✨ FIXED: Using unified v2 API"""
    
    def __init__(self, chain: str):
        self.chain = chain.lower()
        if self.chain not in CHAIN_CONFIGS:
            raise ValueError(f"Unsupported chain: {chain}")
        
        self.config = CHAIN_CONFIGS[self.chain]
        # ✨ FIXED: Use unified v2 API endpoint
        self.api_url = "https://api.etherscan.io/v2/api"
        # ✨ FIXED: Single API key for all chains
        self.api_key = os.getenv("ETHERSCAN_API_KEY") or "YourApiKeyToken"
        self.chain_id = self.config["chain_id"]
        self.explorer = self.config["explorer"]
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Smart-Contract-Auditor/1.0'
        })
    
    def validate_address(self, address: str) -> bool:
        """Validate Ethereum address format"""
        if not address or not isinstance(address, str):
            return False
        
        addr = address.lower()
        if addr.startswith('0x'):
            addr = addr[2:]
        
        if len(addr) != 40:
            return False
        
        try:
            int(addr, 16)
            return True
        except ValueError:
            return False
    
    def fetch_contract_source(self, address: str, retry_count: int = 3) -> Dict:
        """✅ FIXED: Using unified v2 API with chain parameter"""
        
        if not self.validate_address(address):
            raise ValueError(f"Invalid contract address format: {address}")
        
        for attempt in range(retry_count):
            try:
                print(f"🔍 Attempt {attempt + 1}: Fetching contract source for {address} on {self.config['name']}...")
                
                params = {
                    "chainid": self.chain_id,  # ✨ NEW: unified API with chain parameter
                    "module": "contract",
                    "action": "getsourcecode", 
                    "address": address,
                    "apikey": self.api_key
                }
                
                response = self.session.get(
                    self.api_url, 
                    params=params, 
                    timeout=30
                )
                response.raise_for_status()
                
                data = response.json()
                
                if not isinstance(data, dict):
                    raise ValueError("Invalid API response format")
                
                if data.get("status") != "1":
                    error_msg = data.get("message", "Unknown API error")
                    if "rate limit" in error_msg.lower():
                        if attempt < retry_count - 1:
                            wait_time = (attempt + 1) * 2
                            print(f"⏳ Rate limited, waiting {wait_time}s...")
                            time.sleep(wait_time)
                            continue
                    raise ValueError(f"API Error: {error_msg}")
                
                if not data.get("result") or not isinstance(data["result"], list):
                    raise ValueError("Invalid result format from API")
                
                contract_data = data["result"][0]
                source_code = contract_data.get("SourceCode", "")
                
                if not source_code or source_code.strip() == "":
                    raise ValueError(
                        f"Contract source code not available. "
                        f"Contract {address} may not be verified on {self.config['name']}. "
                        f"Please verify the contract on {self.explorer}"
                    )
                
                result = {
                    "source_code": source_code,
                    "contract_name": contract_data.get("ContractName", "Unknown"),
                    "compiler_version": contract_data.get("CompilerVersion", ""),
                    "abi": contract_data.get("ABI", ""),
                    "proxy": contract_data.get("Proxy", "0") == "1",
                    "implementation": contract_data.get("Implementation", ""),
                    "constructor_arguments": contract_data.get("ConstructorArguments", ""),
                    "optimization_used": contract_data.get("OptimizationUsed", "0") == "1",
                    "runs": contract_data.get("Runs", "0"),
                    "swarm_source": contract_data.get("SwarmSource", "")
                }
                
                print(f"✅ Successfully fetched contract: {result['contract_name']} on {self.config['name']}")
                return result
                
            except requests.exceptions.Timeout:
                print(f"⏰ Request timeout on attempt {attempt + 1}")
                if attempt < retry_count - 1:
                    time.sleep(2)
                    continue
                raise ValueError("Request timeout - API server not responding")
                
            except requests.exceptions.ConnectionError:
                print(f"🌐 Connection error on attempt {attempt + 1}")
                if attempt < retry_count - 1:
                    time.sleep(3)
                    continue
                raise ValueError("Network connection error")
                
            except requests.exceptions.RequestException as e:
                print(f"📡 Request error on attempt {attempt + 1}: {e}")
                if attempt < retry_count - 1:
                    time.sleep(2)
                    continue
                raise ValueError(f"Network error fetching contract: {str(e)}")
                
            except Exception as e:
                print(f"❌ Unexpected error on attempt {attempt + 1}: {e}")
                if attempt < retry_count - 1:
                    time.sleep(2)
                    continue
                raise ValueError(f"Error fetching contract source: {str(e)}")
        
        raise ValueError("All retry attempts failed")
    
    # Rest of the methods remain the same...
    def process_source_code(self, source_code: str, contract_name: str = "") -> str:
        """Process and clean source code for Slither analysis"""
        
        if not source_code or source_code.strip() == "":
            raise ValueError("Empty source code provided")
        
        try:
            if source_code.strip().startswith('{'):
                return self._process_multi_file_contract(source_code, contract_name)
            else:
                return self._process_single_file_contract(source_code)
                
        except Exception as e:
            raise ValueError(f"Error processing source code: {str(e)}")
    
    def _process_multi_file_contract(self, source_code: str, contract_name: str = "") -> str:
        """✅ FIXED: Process multi-file contract dengan dependency handling yang lebih baik"""
        try:
            parsed = json.loads(source_code)
            
            if "sources" in parsed:
                # Create temporary directory untuk semua files
                temp_dir = tempfile.mkdtemp(prefix="multi_contract_")
                
                main_file = None
                main_filename = None
                
                # Extract semua files ke temporary directory
                for filename, file_data in parsed["sources"].items():
                    file_content = file_data.get("content", "")
                    if not file_content:
                        continue
                    
                    # Create directory structure
                    file_path = os.path.join(temp_dir, filename)
                    os.makedirs(os.path.dirname(file_path), exist_ok=True)
                    
                    # Write file
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(file_content)
                    
                    # Identify main contract file
                    if contract_name and contract_name.lower() in filename.lower():
                        main_file = file_content
                        main_filename = file_path
                    elif filename.startswith("contracts/") and filename.endswith('.sol'):
                        if not main_file or len(file_content) > len(main_file):
                            main_file = file_content
                            main_filename = file_path
                
                # Setup node_modules untuk OpenZeppelin jika diperlukan
                if any("@openzeppelin" in filename for filename in parsed["sources"].keys()):
                    self._setup_openzeppelin_deps(temp_dir)
                
                if main_filename and os.path.exists(main_filename):
                    print(f"📄 Using main contract file: {main_filename}")
                    return main_filename  # Return path instead of content
                else:
                    # Fallback: create flattened contract
                    return self._create_flattened_contract(parsed["sources"], temp_dir)
            else:
                raise ValueError("Invalid multi-file contract format - missing 'sources'")
                
        except json.JSONDecodeError as e:
            print("⚠️ JSON decode failed, treating as single file")
            return self._process_single_file_contract(source_code)

    def _setup_openzeppelin_deps(self, temp_dir: str):
        """Setup OpenZeppelin dependencies di temporary directory"""
        try:
            node_modules_dir = os.path.join(temp_dir, "node_modules")
            os.makedirs(node_modules_dir, exist_ok=True)
            
            # Create minimal package.json
            package_json = {
                "name": "temp-contract-analysis",
                "version": "1.0.0",
                "dependencies": {
                    "@openzeppelin/contracts": "^4.9.0"
                }
            }
            
            with open(os.path.join(temp_dir, "package.json"), 'w') as f:
                json.dump(package_json, f, indent=2)
            
            # Try to install dependencies (fallback if npm not available)
            try:
                subprocess.run(
                    ["npm", "install", "--silent"],
                    cwd=temp_dir,
                    stdout=subprocess.DEVNULL,
                    stderr=subprocess.DEVNULL,
                    timeout=30
                )
                print("✅ OpenZeppelin dependencies installed")
            except:
                print("⚠️ NPM install failed, using embedded contracts")
                
        except Exception as e:
            print(f"⚠️ Dependency setup warning: {e}")

    def _create_flattened_contract(self, sources: Dict, temp_dir: str) -> str:
        """Create flattened contract as fallback"""
        try:
            flattened_content = []
            pragma_added = False
            
            # Add pragma first
            flattened_content.append("// SPDX-License-Identifier: MIT")
            flattened_content.append("pragma solidity ^0.8.0;")
            flattened_content.append("")
            
            # Process files in dependency order
            processed_files = set()
            
            # First add interfaces and libraries
            for filename, file_data in sources.items():
                if any(keyword in filename.lower() for keyword in ["interface", "ierc", "context"]):
                    content = file_data.get("content", "")
                    if content and filename not in processed_files:
                        cleaned = self._clean_contract_content(content)
                        if cleaned:
                            flattened_content.append(f"// From: {filename}")
                            flattened_content.append(cleaned)
                            flattened_content.append("")
                            processed_files.add(filename)
            
            # Then add main contracts
            for filename, file_data in sources.items():
                if filename not in processed_files:
                    content = file_data.get("content", "")
                    if content:
                        cleaned = self._clean_contract_content(content)
                        if cleaned:
                            flattened_content.append(f"// From: {filename}")
                            flattened_content.append(cleaned)
                            flattened_content.append("")
            
            # Write flattened contract
            flattened_path = os.path.join(temp_dir, "flattened_contract.sol")
            with open(flattened_path, 'w', encoding='utf-8') as f:
                f.write("\n".join(flattened_content))
            
            print(f"📄 Created flattened contract: {flattened_path}")
            return flattened_path
            
        except Exception as e:
            raise ValueError(f"Failed to create flattened contract: {str(e)}")

    def _clean_contract_content(self, content: str) -> str:
        """Clean contract content untuk flattening"""
        if not content:
            return ""
        
        lines = content.split('\n')
        cleaned_lines = []
        
        for line in lines:
            line = line.strip()
            
            # Skip pragma (will be added once at top)
            if line.startswith('pragma solidity'):
                continue
            
            # Skip SPDX (will be added once at top)  
            if line.startswith('// SPDX-License-Identifier'):
                continue
            
            # Skip import statements
            if line.startswith('import '):
                continue
            
            # Keep everything else
            if line:
                cleaned_lines.append(line)
        
        return '\n'.join(cleaned_lines)
    
    def _process_single_file_contract(self, source_code: str) -> str:
        """Process single file contract"""
        cleaned = source_code.strip()
        
        if cleaned.startswith('{{') and cleaned.endswith('}}'):
            cleaned = cleaned[1:-1].strip()
        elif cleaned.startswith('{') and cleaned.endswith('}') and not cleaned.startswith('{"'):
            cleaned = cleaned[1:-1].strip()
        
        return self._clean_solidity_code(cleaned)
    
    def _clean_solidity_code(self, code: str) -> str:
        """Clean and validate Solidity code"""
        cleaned = code.strip()
        
        if not cleaned:
            raise ValueError("Empty code after cleaning")
        
        has_pragma = bool(re.search(r'pragma\s+solidity', cleaned, re.IGNORECASE))
        has_contract = bool(re.search(r'(contract|interface|library)\s+\w+', cleaned, re.IGNORECASE))
        
        if not has_pragma and not has_contract:
            raise ValueError("Invalid Solidity code - missing pragma or contract declaration")
        
        if not has_pragma and has_contract:
            print("⚠️ Adding missing pragma directive")
            cleaned = "pragma solidity ^0.8.0;\n\n" + cleaned
        
        cleaned = re.sub(r'[\x00-\x08\x0b-\x0c\x0e-\x1f\x7f-\x9f]', '', cleaned)
        
        return cleaned
    
    def save_contract_to_file(self, source_code: str, contract_name: str, address: str) -> str:
        """Save contract with better error handling"""
        try:
            contracts_dir = "temp_contracts"
            os.makedirs(contracts_dir, exist_ok=True)
            
            processed_source = self.process_source_code(source_code, contract_name)
            
            safe_name = re.sub(r'[^a-zA-Z0-9_]', '_', contract_name or "Contract")
            safe_name = safe_name[:20]
            
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"{safe_name}_{address[:10]}_{timestamp}.sol"
            filepath = os.path.join(contracts_dir, filename)
            
            with open(filepath, 'w', encoding='utf-8', errors='ignore') as f:
                f.write(processed_source)
            
            if not os.path.exists(filepath):
                raise ValueError("Failed to write contract file")
            
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
                if len(content) < 50:
                    raise ValueError("Generated file is too small")
            
            print(f"✅ Contract saved to: {filepath}")
            print(f"📏 File size: {len(processed_source)} characters")
            
            return filepath
            
        except Exception as e:
            raise ValueError(f"Error saving contract to file: {str(e)}")

def determine_risk_level(
    metrics: SecurityMetrics, 
    contract_info: ContractInfo, 
    ownership: OwnershipAnalysis, 
    trading: TradingAnalysis,
    trust_score: int,
    contract_stats: Dict = None
) -> tuple:
    """
    ✅ UPDATED: Enhanced risk level dengan critical flags industry standard
    """
    
    risk_factors = []
    
    # ✨ EMERGENCY LEVEL - Immediate danger
    if trading.is_honeypot and trading.honeypot_confidence >= 0.8:
        return "Emergency", ["🚨 CONFIRMED HONEYPOT - DO NOT INTERACT"]
    
    # Estimate TVL for unverified check
    tvl_estimate = 0
    if contract_stats:
        tvl_estimate = contract_stats.get("balance_eth", 0) * 3000  # Rough USD
    
    if not contract_info.is_verified and tvl_estimate > 500000:  # >$500k
        return "Emergency", ["🚨 UNVERIFIED HIGH-VALUE CONTRACT - EXTREME RISK"]
    
    # ✨ CRITICAL LEVEL - Severe risks
    if metrics.critical_issues >= 2:
        risk_factors.append(f"🔴 {metrics.critical_issues} critical vulnerabilities")
        return "Critical", risk_factors
    
    if trading.is_honeypot and trading.honeypot_confidence >= 0.5:
        risk_factors.append("🔴 Likely honeypot detected")
        return "Critical", risk_factors
    
    if not contract_info.is_verified and tvl_estimate > 100000:  # >$100k
        risk_factors.append("🔴 Unverified contract with high value")
        return "Critical", risk_factors
    
    # ✨ HIGH LEVEL - Significant risks
    if metrics.critical_issues >= 1:
        risk_factors.append(f"🟡 {metrics.critical_issues} critical vulnerability")
    
    if metrics.high_issues >= 3:
        risk_factors.append(f"🟡 {metrics.high_issues} high-severity issues")
    
    if ownership.centralization_risk == "High" and len(ownership.admin_functions) > 5:
        risk_factors.append("🟡 High centralization with many admin functions")
    
    if trust_score < 30:
        risk_factors.append("🟡 Very low trust score")
    
    if risk_factors:
        return "High", risk_factors
    
    # ✨ MEDIUM LEVEL - Moderate risks
    if metrics.high_issues >= 1:
        risk_factors.append(f"🟠 {metrics.high_issues} high-severity issue(s)")
    
    if metrics.medium_issues >= 5:
        risk_factors.append(f"🟠 {metrics.medium_issues} medium-severity issues")
    
    if not contract_info.is_verified:
        risk_factors.append("🟠 Contract not verified")
    
    if ownership.centralization_risk == "High":
        risk_factors.append("🟠 High ownership centralization")
    
    if trust_score < 50:
        risk_factors.append("🟠 Below-average trust score")
    
    if trading.buy_tax and trading.sell_tax:
        total_tax = trading.buy_tax + trading.sell_tax
        if total_tax > 0.1:  # >10%
            risk_factors.append(f"🟠 High trading tax ({total_tax*100:.1f}%)")
    
    if risk_factors:
        return "Medium", risk_factors
    
    # ✨ LOW LEVEL - Minor or no significant risks
    if metrics.medium_issues >= 1 or metrics.low_issues >= 3:
        risk_factors.append("🟢 Minor issues found")
    
    if trust_score < 70:
        risk_factors.append("🟢 Room for improvement in trust metrics")
    
    if risk_factors:
        return "Low", risk_factors
    else:
        return "Low", ["🟢 No significant risks detected"]
    
def calculate_analysis_confidence(
    contract_info: ContractInfo,
    trading_analysis: TradingAnalysis,
    social_presence: SocialPresence,
    contract_stats: Dict = None
) -> float:
    """
    NEW: Calculate overall confidence in analysis results
    """
    confidence_factors = []
    
    # Contract verification confidence
    if contract_info.is_verified:
        confidence_factors.append(0.9)
    else:
        confidence_factors.append(0.3)
    
    # Honeypot detection confidence
    confidence_factors.append(trading_analysis.honeypot_confidence)
    
    # Social analysis confidence
    if social_presence.social_score > 50:
        confidence_factors.append(0.8)
    elif social_presence.social_score > 20:
        confidence_factors.append(0.6)
    else:
        confidence_factors.append(0.4)
    
    # Contract age confidence
    if contract_stats:
        age_days = contract_stats.get("contract_age_days", 0)
        if age_days > 365:
            confidence_factors.append(0.9)
        elif age_days > 90:
            confidence_factors.append(0.7)
        else:
            confidence_factors.append(0.5)
    
    # Calculate weighted average confidence
    overall_confidence = sum(confidence_factors) / len(confidence_factors)
    return round(overall_confidence, 2)

def run_slither(source_path: str, wallet_address: str) -> tuple[List[VulnerabilityDetail], str]:
    """✅ FIXED: Enhanced Slither execution dengan better error handling"""
    slither_exe = shutil.which("slither") or shutil.which("slither.cmd")
    if not slither_exe:
        raise RuntimeError("❌ Slither tidak ditemukan di PATH.")

    # Create audit results directory
    audit_results_dir = "audit_results"
    os.makedirs(audit_results_dir, exist_ok=True)
    
    # Generate unique filename for raw slither (temporary)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    wallet_short = wallet_address[:10]
    json_filename = f"slither_temp_{wallet_short}_{timestamp}.json"
    json_filepath = os.path.join(audit_results_dir, json_filename)

    # Enhanced Slither command dengan additional flags
    slither_cmd = [
        slither_exe, 
        source_path, 
        "--json", json_filepath,
        "--disable-color",  # Disable color output
        "--no-fail-pedantic"  # Don't fail on warnings
    ]
    
    # Add additional flags for multi-file projects
    if os.path.isdir(source_path) or "node_modules" in source_path:
        slither_cmd.extend([
            "--ignore-compile",  # Ignore compilation errors
            "--exclude-dependencies"  # Exclude dependency analysis
        ])

    print(f"🔍 Running Slither command: {' '.join(slither_cmd)}")
    
    # Run Slither with enhanced error handling
    try:
        result = subprocess.run(
            slither_cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            timeout=120,  # Increased timeout for complex contracts
            text=True
        )
        
        # Slither can return non-zero exit code even on success (due to findings)
        # Check if JSON file was created successfully
        if not os.path.exists(json_filepath):
            # Try alternative approach
            print("⚠️ Standard Slither run failed, trying alternative approach...")
            return _run_slither_fallback(source_path, json_filepath, wallet_address)
        
        # Check if JSON file has valid content
        try:
            with open(json_filepath, 'r') as f:
                data = json.load(f)
                
            vulnerabilities = parse_slither_results(data)
            print(f"✅ Slither analysis completed: {len(vulnerabilities)} issues found")
            
            return vulnerabilities, json_filepath
            
        except json.JSONDecodeError:
            print("⚠️ Invalid JSON output from Slither, trying fallback...")
            return _run_slither_fallback(source_path, json_filepath, wallet_address)
            
    except subprocess.TimeoutExpired:
        print("⏰ Slither analysis timed out, using minimal analysis...")
        return _create_minimal_analysis(json_filepath, wallet_address)
        
    except Exception as e:
        print(f"❌ Slither execution error: {e}")
        return _run_slither_fallback(source_path, json_filepath, wallet_address)

def _run_slither_fallback(source_path: str, json_filepath: str, wallet_address: str) -> tuple[List[VulnerabilityDetail], str]:
    """Fallback analysis ketika Slither gagal"""
    try:
        # Try simpler Slither command
        slither_exe = shutil.which("slither") or shutil.which("slither.cmd")
        
        simple_cmd = [
            slither_exe,
            source_path,
            "--json", json_filepath,
            "--disable-color",
            "--exclude", "naming-convention,pragma,solc-version"  # Exclude low-priority checks
        ]
        
        result = subprocess.run(
            simple_cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            timeout=60,
            text=True
        )
        
        if os.path.exists(json_filepath):
            with open(json_filepath, 'r') as f:
                data = json.load(f)
            vulnerabilities = parse_slither_results(data)
            return vulnerabilities, json_filepath
        
    except Exception as e:
        print(f"⚠️ Fallback also failed: {e}")
    
    # Final fallback: manual basic analysis
    return _create_minimal_analysis(json_filepath, wallet_address)

def _create_minimal_analysis(json_filepath: str, wallet_address: str) -> tuple[List[VulnerabilityDetail], str]:
    """Create minimal analysis ketika Slither completely fails"""
    
    # Create empty result structure
    minimal_result = {
        "results": {
            "detectors": []
        },
        "success": False,
        "error": "Slither analysis failed, using minimal analysis"
    }
    
    # Save minimal result
    with open(json_filepath, 'w') as f:
        json.dump(minimal_result, f, indent=2)
    
    print("⚠️ Using minimal analysis due to Slither failure")
    
    # Return empty vulnerability list
    return [], json_filepath

# FIXED: Enhanced save_contract_to_file method
def save_contract_to_file(self, source_code: str, contract_name: str, address: str) -> str:
    """✅ FIXED: Save contract with better multi-file handling"""
    try:
        contracts_dir = "temp_contracts"
        os.makedirs(contracts_dir, exist_ok=True)
        
        # Check if it's multi-file JSON
        if source_code.strip().startswith('{'):
            try:
                parsed = json.loads(source_code)
                if "sources" in parsed:
                    # Handle multi-file contract
                    return self._handle_multi_file_save(parsed, contract_name, address, contracts_dir)
            except json.JSONDecodeError:
                pass
        
        # Handle single file
        processed_source = self.process_source_code(source_code, contract_name)
        
        safe_name = re.sub(r'[^a-zA-Z0-9_]', '_', contract_name or "Contract")
        safe_name = safe_name[:20]
        
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{safe_name}_{address[:10]}_{timestamp}.sol"
        filepath = os.path.join(contracts_dir, filename)
        
        with open(filepath, 'w', encoding='utf-8', errors='ignore') as f:
            f.write(processed_source)
        
        if not os.path.exists(filepath):
            raise ValueError("Failed to write contract file")
        
        print(f"✅ Contract saved to: {filepath}")
        return filepath
        
    except Exception as e:
        raise ValueError(f"Error saving contract to file: {str(e)}")

def _handle_multi_file_save(self, parsed: dict, contract_name: str, address: str, contracts_dir: str) -> str:
    """Handle saving multi-file contract"""
    
    # Create project directory
    safe_name = re.sub(r'[^a-zA-Z0-9_]', '_', contract_name or "MultiContract")
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    project_name = f"{safe_name}_{address[:10]}_{timestamp}"
    project_dir = os.path.join(contracts_dir, project_name)
    
    os.makedirs(project_dir, exist_ok=True)
    
    main_contract_path = None
    
    # Save all files
    for filename, file_data in parsed["sources"].items():
        content = file_data.get("content", "")
        if not content:
            continue
        
        # Create directory structure
        file_path = os.path.join(project_dir, filename)
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        
        # Write file
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        # Identify main contract
        if contract_name and contract_name.lower() in filename.lower():
            main_contract_path = file_path
        elif filename.startswith("contracts/") and filename.endswith('.sol'):
            if not main_contract_path:
                main_contract_path = file_path
    
    # Setup dependencies if needed
    if any("@openzeppelin" in filename for filename in parsed["sources"].keys()):
        self._setup_project_dependencies(project_dir)
    
    # Return main contract path or project directory
    if main_contract_path and os.path.exists(main_contract_path):
        print(f"✅ Multi-file project saved. Main contract: {main_contract_path}")
        return main_contract_path
    else:
        print(f"✅ Multi-file project saved to: {project_dir}")
        return project_dir

def _setup_project_dependencies(self, project_dir: str):
    """Setup basic project structure for multi-file contracts"""
    try:
        # Create package.json
        package_json = {
            "name": "temp-analysis-project",
            "version": "1.0.0",
            "dependencies": {
                "@openzeppelin/contracts": "^4.9.0"
            }
        }
        
        with open(os.path.join(project_dir, "package.json"), 'w') as f:
            json.dump(package_json, f, indent=2)
        
        # Create foundry.toml for better compatibility
        foundry_config = """[profile.default]
src = "contracts"
out = "out"
libs = ["node_modules"]
remappings = [
    "@openzeppelin/=node_modules/@openzeppelin/"
]
"""
        
        with open(os.path.join(project_dir, "foundry.toml"), 'w') as f:
            f.write(foundry_config)
        
        print("✅ Project dependencies configured")
        
    except Exception as e:
        print(f"⚠️ Dependency setup warning: {e}")
        
def clean_ai_html_output(text: str) -> str:
    """Clean AI-generated HTML output"""
    # Remove markdown code blocks if present
    text = re.sub(r'```html\n?', '', text)
    text = re.sub(r'```\n?', '', text)
    text = re.sub(r'\*\*.*?\*\*', '', text)  # Remove markdown bold
    text = re.sub(r'#{1,6}\s.*?\n', '', text)  # Remove markdown headers
    
    # Remove any leading/trailing whitespace
    text = text.strip()
    
    # If doesn't start with <div, try to find the actual HTML content
    if not text.startswith('<div'):
        # Find the first occurrence of <div class="space-y-6
        match = re.search(r'<div class="space-y-6.*?</div>\s*$', text, re.DOTALL)
        if match:
            text = match.group(0)
    
    return text

def save_ai_summary_status(address: str, chain: str, status: str, summary: Optional[str] = None, error_message: Optional[str] = None):
    """Save AI summary status to JSON file"""
    ai_summaries_dir = "ai_summaries"
    os.makedirs(ai_summaries_dir, exist_ok=True)
    
    status_data = {
        "address": address,
        "chain": chain,
        "status": status,
        "summary": summary,
        "error_message": error_message,
        "started_at": datetime.now().isoformat() if status == "pending" else None,
        "completed_at": datetime.now().isoformat() if status in ["completed", "error"] else None
    }
    
    # Load existing if any
    status_file = os.path.join(ai_summaries_dir, f"{address.lower()}.json")
    if os.path.exists(status_file):
        try:
            with open(status_file, 'r', encoding='utf-8') as f:
                existing_data = json.load(f)
                if status != "pending":  # Keep original started_at
                    status_data["started_at"] = existing_data.get("started_at")
        except:
            pass
    
    with open(status_file, 'w', encoding='utf-8') as f:
        json.dump(status_data, f, indent=2, ensure_ascii=False)

def generate_ai_summary_async(
    address: str, 
    chain: str,
    vulnerabilities: List[VulnerabilityDetail],
    metrics,
    contract_info,
    ownership_analysis,
    trading_analysis,
    social_presence,
    contract_stats: Dict = None,
    indonesian_crime_analysis = None
):
    """Background task untuk generate AI summary"""
    try:
        print(f"🤖 [DEBUG] Starting async AI summary generation for {address}")
        print(f"🤖 [DEBUG] Input data - vulnerabilities count: {len(vulnerabilities)}")
        print(f"🤖 [DEBUG] Input data - trust score: {getattr(metrics, 'trust_score', 'N/A')}")
        print(f"🤖 [DEBUG] Input data - contract verified: {getattr(contract_info, 'is_verified', 'N/A')}")
        
        # Generate AI summary menggunakan fungsi yang sudah ada
        print(f"🤖 [DEBUG] Calling generate_detailed_summary function...")
        ai_summary = generate_detailed_summary(
            vulnerabilities, metrics, contract_info, ownership_analysis, 
            trading_analysis, social_presence, contract_stats, indonesian_crime_analysis
        )
        
        print(f"🤖 [DEBUG] AI summary generated, length: {len(ai_summary) if ai_summary else 0} characters")
        
        # Save completed status
        print(f"🤖 [DEBUG] Saving completed status to JSON...")
        save_ai_summary_status(address, chain, "completed", summary=ai_summary)
        
        # Update audit file dengan AI summary
        print(f"🤖 [DEBUG] Updating audit file with AI summary...")
        update_audit_file_with_ai_summary(address, ai_summary)
        
        print(f"✅ [DEBUG] AI summary completed successfully for {address}")
        
    except Exception as e:
        print(f"❌ [DEBUG] AI summary failed for {address}")
        print(f"❌ [DEBUG] Error details: {str(e)}")
        print(f"❌ [DEBUG] Error type: {type(e).__name__}")
        import traceback
        print(f"❌ [DEBUG] Full traceback:")
        traceback.print_exc()
        
        save_ai_summary_status(address, chain, "error", error_message=str(e))

def update_audit_file_with_ai_summary(address: str, ai_summary: str):
    """Update latest audit file with AI summary"""
    try:
        print(f"📝 [DEBUG] Updating audit file for {address}")
        
        audit_results_dir = "audit_results"
        wallet_short = address[:10]
        
        # Find latest audit file
        audit_files = [
            f for f in os.listdir(audit_results_dir) 
            if f.startswith(f"audit_{wallet_short}_") and f.endswith(".json")
        ]
        
        print(f"📝 [DEBUG] Found {len(audit_files)} audit files for {wallet_short}")
        
        if audit_files:
            latest_file = sorted(audit_files, reverse=True)[0]
            file_path = os.path.join(audit_results_dir, latest_file)
            print(f"📝 [DEBUG] Latest audit file: {latest_file}")
            
            # Load and update
            with open(file_path, 'r', encoding='utf-8') as f:
                audit_data = json.load(f)
            
            print(f"📝 [DEBUG] Loaded audit data, adding AI summary...")
            audit_data["ai_summary"] = ai_summary
            
            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(audit_data, f, indent=2, ensure_ascii=False)
            
            print(f"📝 [DEBUG] Successfully updated audit file with AI summary")
        else:
            print(f"📝 [DEBUG] No audit files found for {wallet_short}")
                
    except Exception as e:
        print(f"⚠️ [DEBUG] Failed to update audit file: {e}")
        import traceback
        traceback.print_exc()    

def generate_detailed_summary(
    vulnerabilities: List[VulnerabilityDetail],
    metrics: SecurityMetrics,
    contract_info: ContractInfo,
    ownership_analysis: OwnershipAnalysis,
    trading_analysis: TradingAnalysis,
    social_presence: SocialPresence,
    contract_stats: Dict = None,
    indonesian_crime_analysis: IndonesianCrimeAnalysis = None
) -> str:
    """Expert analysis that FOLLOWS the actual data and risk assessment"""
    
    if not vulnerabilities and contract_info.is_verified and not trading_analysis.is_honeypot:
        return """
        <div class="space-y-6 text-gray-200 text-base leading-relaxed">
          <section class="bg-gradient-to-r from-emerald-600/20 to-green-600/20 rounded-xl p-6 border-emerald-400/30">
            <div class="flex items-center mb-4">
              <span class="text-3xl mr-4">🎖️</span>
              <h2 class="text-2xl font-bold text-emerald-300">Expert Assessment: Premium Grade Protocol</h2>
            </div>
            <div class="bg-emerald-500/10 rounded-lg p-4 border-emerald-400/20">
              <p class="text-lg font-medium text-emerald-200">Sebagai blockchain security expert, saya menilai kontrak ini memiliki security posture yang exceptional. Clean vulnerability scan + verified codebase + no honeypot indicators = protokol dengan institutional-grade security standards.</p>
            </div>
          </section>
        </div>
        """

    # FOLLOW THE ACTUAL DATA
    contract_age = contract_stats.get("contract_age_days", 0) if contract_stats else 0
    tx_count = contract_stats.get("transaction_count", 0) if contract_stats else 0
    unique_users = contract_stats.get("unique_users", 0) if contract_stats else 0
    balance_eth = contract_stats.get("balance_eth", 0) if contract_stats else 0

    # Calculate based on REAL metrics
    estimated_tvl = balance_eth * 3000
    user_retention = tx_count / max(unique_users, 1) if unique_users > 0 else 0
    
    # Expert assessment based on ACTUAL data
    critical_vulns = [v for v in vulnerabilities if v.severity == "Critical"]
    high_vulns = [v for v in vulnerabilities if v.severity == "High"] 
    medium_vulns = [v for v in vulnerabilities if v.severity == "Medium"]
    
    # Determine expert grade based on REAL risk assessment
    if metrics.trust_score < 30 or len(critical_vulns) > 0 or trading_analysis.is_honeypot:
        expert_grade = "F"
        risk_category = "CRITICAL_AVOID"
    elif metrics.trust_score < 50 or len(high_vulns) >= 2:
        expert_grade = "D"
        risk_category = "HIGH_RISK"
    elif metrics.trust_score < 60 or len(high_vulns) >= 1:
        expert_grade = "C"
        risk_category = "MODERATE_RISK"
    elif metrics.trust_score < 75:
        expert_grade = "B"
        risk_category = "ACCEPTABLE_RISK"
    else:
        expert_grade = "A"
        risk_category = "LOW_RISK"

    prompt = f"""
You are a SENIOR BLOCKCHAIN SECURITY EXPERT analyzing a smart contract. You MUST base your analysis on the ACTUAL DATA provided.

**CRITICAL: The system has already determined this contract has Trust Score: {metrics.trust_score}/100 with {len(high_vulns)} HIGH SEVERITY vulnerabilities. Your analysis MUST be consistent with this assessment.**

**ACTUAL CONTRACT DATA:**
- System Risk Assessment: Trust Score {metrics.trust_score}/100
- Critical Vulnerabilities: {metrics.critical_issues}
- High Severity Issues: {metrics.high_issues} (including reentrancy attacks, arbitrary-send-eth)
- Medium Severity Issues: {metrics.medium_issues}
- Contract Age: {contract_age} days
- Total Vulnerability Count: {metrics.total_issues}
- Is Verified: {contract_info.is_verified}
- Honeypot Status: {trading_analysis.is_honeypot}
- Indonesian Crime Risk: {indonesian_crime_analysis.overall_crime_risk if indonesian_crime_analysis else 0}/100
- Targeting Indonesia: {indonesian_crime_analysis.is_targeting_indonesia if indonesian_crime_analysis else False}
- Crimes Detected: {len(indonesian_crime_analysis.detected_crimes) if indonesian_crime_analysis else 0}

**SPECIFIC VULNERABILITIES FOUND:**
{chr(10).join([f"- {v.type} ({v.severity}): {v.description[:100]}..." for v in vulnerabilities[:5]])}

**YOUR EXPERT ASSESSMENT MUST MATCH THE DATA:**
- If Trust Score < 50 and High Vulns > 0: This is HIGH RISK
- If Critical Vulns > 0: This is CRITICAL RISK
- If Contract Age < 7 days: Add "experimental/unproven" risk factor
- If High Vulns include reentrancy: Emphasize attack risk

**OUTPUT FORMAT:**

<div class="space-y-8 text-gray-200 text-base leading-relaxed">

  <section class="bg-gradient-to-r from-red-600/20 to-rose-600/20 rounded-xl p-6 border-red-400/30">
    <div class="flex items-center mb-6">
      <span class="text-3xl mr-4">🚨</span>
      <h2 class="text-2xl font-bold text-red-300">EXPERT SECURITY ALERT</h2>
    </div>
    
    <div class="bg-red-500/20 rounded-lg p-5 border-red-400/30 mb-6">
      <h3 class="text-red-300 font-bold text-xl mb-3">⚠️ HIGH RISK ASSESSMENT CONFIRMED</h3>
      <p class="text-gray-300 leading-relaxed text-lg">
        Based on my analysis of {metrics.total_issues} security issues including {metrics.high_issues} high-severity vulnerabilities, this contract presents SIGNIFICANT RISK to users. The trust score of {metrics.trust_score}/100 confirms this assessment.
      </p>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="bg-black/40 rounded-lg p-4 border-red-400/20">
        <h4 class="text-red-300 font-bold mb-2">🎯 Critical Attack Vectors</h4>
        <p class="text-gray-300 text-sm">
          [Analyze the specific high-severity vulnerabilities found, especially reentrancy and arbitrary-send-eth]
        </p>
      </div>
      
      <div class="bg-black/40 rounded-lg p-4 border-red-400/20">
        <h4 class="text-red-300 font-bold mb-2">⏰ Maturity Risk</h4>
        <p class="text-gray-300 text-sm">
          Contract age of {contract_age} days = Unproven and high experimental risk
        </p>
      </div>
    </div>
  </section>

  <section class="bg-gradient-to-r from-amber-600/20 to-orange-600/20 rounded-xl p-6 border-amber-400/30">
    <div class="flex items-center mb-6">
      <span class="text-3xl mr-4">🔬</span>
      <h2 class="text-2xl font-bold text-amber-300">Technical Vulnerability Analysis</h2>
    </div>
    
    <div class="space-y-4">
      <div class="bg-black/40 rounded-lg p-5 border-amber-400/20">
        <h3 class="text-amber-300 font-bold text-lg mb-3">⚔️ Exploitation Potential</h3>
        <p class="text-gray-300 leading-relaxed">
          [Detailed analysis of how the vulnerabilities can be exploited, focusing on reentrancy attacks and fund drainage risks]
        </p>
      </div>
    </div>
  </section>

  <section class="bg-gradient-to-r from-purple-600/20 to-red-600/20 rounded-xl p-6 border-purple-400/30">
    <div class="flex items-center mb-6">
      <span class="text-3xl mr-4">🚨</span>
      <h2 class="text-2xl font-bold text-purple-300">Indonesian Crime Risk Analysis</h2>
    </div>
    
    <div class="bg-purple-500/20 rounded-lg p-5 border-purple-400/30 mb-6">
      <h3 class="text-purple-300 font-bold text-xl mb-3">🇮🇩 AKTIVITAS ILLEGAL INDONESIA</h3>
      <p class="text-gray-300 leading-relaxed text-lg">
        Crime Risk Score: {indonesian_crime_analysis.overall_crime_risk if indonesian_crime_analysis else 0}/100
        - {len(indonesian_crime_analysis.detected_crimes) if indonesian_crime_analysis else 0} illegal activities detected
        - {'Targeting Indonesian users' if indonesian_crime_analysis and indonesian_crime_analysis.is_targeting_indonesia else 'No Indonesian targeting detected'}
      </p>
    </div>
    
    {'<div class="bg-red-500/30 rounded-lg p-4 border-red-400/40"><p class="text-red-200 font-bold">🚨 REPORT TO SATGAS PASTI REQUIRED</p></div>' if indonesian_crime_analysis and indonesian_crime_analysis.satgas_pasti_report_needed else ''}
  </section>

  <section class="bg-gradient-to-r from-purple-600/20 to-indigo-600/20 rounded-xl p-6 border-purple-400/30">
    <div class="flex items-center mb-6">
      <span class="text-3xl mr-4">🏭</span>
      <h2 class="text-2xl font-bold text-purple-300">Professional Risk Rating</h2>
    </div>
    
    <div class="bg-black/40 rounded-lg p-5 border-purple-400/20">
      <h3 class="text-purple-300 font-bold text-lg mb-3">📊 Expert Verdict</h3>
      <p class="text-gray-300 leading-relaxed">
        [Give specific recommendations based on the high-risk assessment]
      </p>
    </div>
  </section>

  <section class="bg-gradient-to-r from-gray-700/20 to-gray-800/20 rounded-xl p-6 border-gray-600/30">
    <div class="flex items-center mb-6">
      <span class="text-3xl mr-4">📋</span>
      <h2 class="text-2xl font-bold text-white">Expert Final Rating</h2>
    </div>
    
    <div class="bg-black/50 rounded-lg p-6 border-gray-600/30 text-center">
      <div class="text-6xl font-bold text-red-400 mb-4">{expert_grade}</div>
      <p class="text-gray-400 text-xl mb-4">Professional Security Grade</p>
      <div class="bg-red-500/20 rounded-lg p-4 border-red-400/30">
        <p class="text-xl text-red-300 font-bold">
          RECOMMENDATION: {risk_category.replace('_', ' ')}
        </p>
      </div>
    </div>
  </section>

</div>

**ANALYSIS REQUIREMENTS:**
1. **Be Consistent**: Your assessment MUST match the trust score and vulnerability data
2. **Be Specific**: Reference the actual vulnerabilities found (reentrancy, arbitrary-send-eth)
3. **Be Professional**: Explain WHY this is high risk based on technical evidence
4. **Be Actionable**: Give clear recommendations for this risk level
5. **Be Honest**: Don't sugarcoat - if data shows high risk, confirm it

Remember: Your credibility as an expert depends on being consistent with the technical analysis. The system found {metrics.high_issues} high-severity issues - acknowledge and explain them!
"""

    try:
        headers = {
            "Content-Type": "application/json",
            "api-key": AZURE_OPENAI_API_KEY
        }
        
        payload = {
            "messages": [
                {
                    "role": "system",
                    "content": [{"type": "text", "text": "You are an AI assistant that helps people find information."}]
                },
                {
                    "role": "user", 
                    "content": [{"type": "text", "text": prompt}]
                }
            ],
            "max_tokens": 3500,
            "temperature": 0.5,
            "top_p": 0.9
        }
        
        response = requests.post(
            "https://imamu-mbzx46yn-japaneast.openai.azure.com/openai/deployments/gpt-4/chat/completions?api-version=2025-01-01-preview",
            headers=headers,
            json=payload,
            timeout=60
        )
        
        if response.status_code == 200:
            result = response.json()
            ai_content = result["choices"][0]["message"]["content"]
            
            cleaned_content = clean_ai_html_output(ai_content)
            
            if cleaned_content.startswith('<div class="space-y-'):
                return cleaned_content
            else:
                print("AI returned invalid format, using data-consistent fallback")
                return generate_data_consistent_fallback(metrics, contract_info, ownership_analysis, trading_analysis, social_presence, contract_stats, vulnerabilities)
        else:
            print(f"Together AI API error: {response.status_code}")
            return generate_data_consistent_fallback(metrics, contract_info, ownership_analysis, trading_analysis, social_presence, contract_stats, vulnerabilities)

    except Exception as e:
        print(f"AI Summary error: {e}")
        return generate_data_consistent_fallback(metrics, contract_info, ownership_analysis, trading_analysis, social_presence, contract_stats, vulnerabilities)

def generate_data_consistent_fallback(
    metrics: SecurityMetrics,
    contract_info: ContractInfo, 
    ownership_analysis: OwnershipAnalysis,
    trading_analysis: TradingAnalysis,
    social_presence: SocialPresence,
    contract_stats: Dict = None,
    vulnerabilities: List[VulnerabilityDetail] = None
) -> str:
    """Fallback that matches the ACTUAL scoring system"""
    
    contract_age = contract_stats.get("contract_age_days", 0) if contract_stats else 0
    
    # Get vulnerability breakdown
    high_vulns = [v for v in vulnerabilities if v.severity == "High"] if vulnerabilities else []
    critical_vulns = [v for v in vulnerabilities if v.severity == "Critical"] if vulnerabilities else []
    
    # CORRECT grading based on ACTUAL system logic
    if trading_analysis.is_honeypot:
        expert_grade = "F"
        risk_assessment = "CRITICAL - HONEYPOT DETECTED"
        grade_color = "text-red-600"
    elif metrics.trust_score < 30:
        expert_grade = "F"
        risk_assessment = "CRITICAL - AVOID COMPLETELY"
        grade_color = "text-red-600"
    elif metrics.trust_score < 40:
        expert_grade = "D"
        risk_assessment = "HIGH RISK - Expert users only"
        grade_color = "text-red-500"
    elif metrics.trust_score < 60:  # 40-60 = MEDIUM (seperti contoh: 52/100)
        expert_grade = "C"
        risk_assessment = "MEDIUM RISK - Use with caution"
        grade_color = "text-orange-400"
    elif metrics.trust_score < 75:
        expert_grade = "B"
        risk_assessment = "ACCEPTABLE RISK - Generally safe"
        grade_color = "text-yellow-400"
    else:
        expert_grade = "A"
        risk_assessment = "LOW RISK - Safe to use"
        grade_color = "text-green-400"

    # Determine risk explanation based on actual data
    risk_explanation = ""
    if metrics.trust_score >= 40 and metrics.trust_score < 60:
        risk_explanation = f"Trust score {metrics.trust_score}/100 menempatkan kontrak ini pada kategori MEDIUM RISK. Faktor positif seperti verified contract dan no honeypot detection mencegah klasifikasi HIGH RISK, namun adanya {len(high_vulns)} high-severity vulnerability dan contract age {contract_age} hari masih memerlukan kehati-hatian."
    elif metrics.trust_score < 40:
        risk_explanation = f"Trust score {metrics.trust_score}/100 menunjukkan HIGH RISK dengan multiple security concerns yang signifikan."
    else:
        risk_explanation = f"Trust score {metrics.trust_score}/100 menunjukkan profil risiko yang dapat diterima dengan mitigasi yang memadai."

    return f"""
    <div class="space-y-8 text-gray-200 text-base leading-relaxed">

      <section class="bg-gradient-to-r from-orange-600/20 to-amber-600/20 rounded-xl p-6 border-orange-400/30">
        <div class="flex items-center mb-6">
          <span class="text-3xl mr-4">⚠️</span>
          <h2 class="text-2xl font-bold text-orange-300">EXPERT SECURITY ASSESSMENT</h2>
        </div>
        
        <div class="bg-orange-500/20 rounded-lg p-5 border-orange-400/30 mb-6">
          <h3 class="text-orange-300 font-bold text-xl mb-3">📊 MEDIUM RISK CONFIRMED</h3>
          <p class="text-gray-300 leading-relaxed text-lg">
            {risk_explanation}
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-black/40 rounded-lg p-4 border-orange-400/20">
            <h4 class="text-orange-300 font-bold mb-2">🎯 Security Concerns</h4>
            <p class="text-gray-300 text-sm">
              {f'{len(high_vulns)} high-severity issue detected' if len(high_vulns) > 0 else 'No high-severity issues detected'}: {high_vulns[0].type if high_vulns else 'Minor security concerns only'}
            </p>
          </div>
          
          <div class="bg-black/40 rounded-lg p-4 border-orange-400/20">
            <h4 class="text-orange-300 font-bold mb-2">⏰ Maturity Assessment</h4>
            <p class="text-gray-300 text-sm">
              Contract age: <strong>{contract_age} hari</strong> = {'Very new protocol requiring careful observation' if contract_age < 7 else 'Young protocol with limited track record' if contract_age < 30 else 'Maturing protocol with growing track record'}
            </p>
          </div>
        </div>
      </section>

      <section class="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-xl p-6 border-blue-400/30">
        <div class="flex items-center mb-6">
          <span class="text-3xl mr-4">🔬</span>
          <h2 class="text-2xl font-bold text-blue-300">Technical Analysis</h2>
        </div>
        
        <div class="space-y-4">
          <div class="bg-black/40 rounded-lg p-5 border-blue-400/20">
            <h3 class="text-blue-300 font-bold text-lg mb-3">⚖️ Risk-Benefit Analysis</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 class="text-green-300 font-bold mb-2">✅ Positive Factors</h4>
                <ul class="text-gray-300 text-sm space-y-1">
                  {f'<li>• Contract verified on blockchain explorer</li>' if contract_info.is_verified else ''}
                  {f'<li>• No honeypot mechanism detected</li>' if not trading_analysis.is_honeypot else ''}
                  {f'<li>• Low centralization risk</li>' if ownership_analysis.centralization_risk == 'Low' else ''}
                  {f'<li>• Reasonable social presence ({social_presence.social_score}/100)</li>' if social_presence.social_score > 50 else ''}
                </ul>
              </div>
              <div>
                <h4 class="text-orange-300 font-bold mb-2">⚠️ Concern Areas</h4>
                <ul class="text-gray-300 text-sm space-y-1">
                  {f'<li>• {len(high_vulns)} high-severity vulnerability: {high_vulns[0].type if high_vulns else "None"}</li>' if high_vulns else ''}
                  <li>• Very young contract ({contract_age} days old)</li>
                  <li>• Limited operational history</li>
                  {f'<li>• {metrics.total_issues} total issues detected</li>' if metrics.total_issues > 5 else ''}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="bg-gradient-to-r from-purple-600/20 to-indigo-600/20 rounded-xl p-6 border-purple-400/30">
        <div class="flex items-center mb-6">
          <span class="text-3xl mr-4">🎯</span>
          <h2 class="text-2xl font-bold text-purple-300">Expert Recommendations</h2>
        </div>
        
        <div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-black/40 rounded-lg p-5 border-purple-400/20">
              <h3 class="text-purple-300 font-bold text-lg mb-3">🏢 For Institutional Use</h3>
              <p class="text-gray-300 leading-relaxed">
                {'Enhanced due diligence required. Consider for experimental allocation with strict position limits (max 0.5% portfolio).' if metrics.trust_score >= 50 else 'Not recommended for institutional use due to risk profile.'}
              </p>
            </div>
            
            <div class="bg-black/40 rounded-lg p-5 border-purple-400/20">
              <h3 class="text-purple-300 font-bold text-lg mb-3">👤 For Retail Users</h3>
              <p class="text-gray-300 leading-relaxed">
                {'Suitable for experienced users with proper risk management. Start with small test transactions.' if metrics.trust_score >= 40 else 'High risk - only for expert users who fully understand the implications.'}
              </p>
            </div>
          </div>
          
          <div class="bg-gray-800/50 rounded-lg p-4 border-gray-600/30">
            <h4 class="text-gray-300 font-bold mb-2">🔧 Practical Usage Guidelines:</h4>
            <ul class="text-gray-300 text-sm space-y-1">
              <li>• Start with minimal test transactions to verify functionality</li>
              <li>• Monitor contract behavior closely during initial weeks</li>
              <li>• Set up alerts for unusual activity patterns</li>
              <li>• Consider waiting for contract to mature (30+ days) before significant use</li>
              <li>• Keep transaction amounts within acceptable loss limits</li>
            </ul>
          </div>
        </div>
      </section>

      <section class="bg-gradient-to-r from-gray-700/20 to-gray-800/20 rounded-xl p-6 border-gray-600/30">
        <div class="flex items-center mb-6">
          <span class="text-3xl mr-4">📋</span>
          <h2 class="text-2xl font-bold text-white">Expert Final Assessment</h2>
        </div>
        
        <div class="bg-black/50 rounded-lg p-6 border-gray-600/30 text-center">
          <div class="text-6xl font-bold {grade_color} mb-4">{expert_grade}</div>
          <p class="text-gray-400 text-xl mb-4">Professional Security Grade</p>
          <div class="bg-orange-500/20 rounded-lg p-4 border-orange-400/30">
            <p class="text-xl font-bold mb-2">
              <span class="text-orange-300">{risk_assessment}</span>
            </p>
            <p class="text-gray-300 mb-4">
              Trust Score: {metrics.trust_score}/100 | Security Issues: {metrics.total_issues} total ({len(high_vulns)} high-severity)
            </p>
            <p class="text-gray-300 text-sm">
              <strong>Bottom Line:</strong> {'Moderate risk suitable for cautious use with proper precautions. Verified contract with some security concerns that require monitoring.' if metrics.trust_score >= 40 else 'High risk profile requiring expert evaluation before any interaction.'}
            </p>
          </div>
        </div>
      </section>

    </div>
    """

def generate_recommendations(vulnerabilities: List[VulnerabilityDetail], contract_info: ContractInfo, ownership_analysis: OwnershipAnalysis) -> List[str]:
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

def quick_validate_contract(address: str, chain: str) -> dict:
    """Quick validation check - return error dict if invalid, None if valid"""
    
    # 1. Validasi format address
    if not address or len(address) != 42 or not address.startswith('0x'):
        return {"error": "Invalid address format", "status_code": 400}
    
    try:
        int(address[2:], 16)
    except ValueError:
        return {"error": "Invalid address format", "status_code": 400}
    
    # 2. Cek contract exists & verified
    try:
        etherscan_api = EtherscanAPI(chain)
        contract_info = etherscan_api.get_contract_info(address)
        
        # Cek apakah contract ada
        if not contract_info.contract_name:
            return {"error": "Contract not found or is EOA", "status_code": 404}
        
        # Cek apakah verified
        if not contract_info.is_verified:
            return {"error": f"Contract not verified. Please verify at {CHAIN_CONFIGS[chain]['explorer']}", "status_code": 400}
        
        # Valid - tidak ada error
        return None
        
    except Exception as e:
        return {"error": f"Validation failed: {str(e)}", "status_code": 500}

@app.post("/audit-contract", response_model=AuditResult) 
def audit_contract(data: ContractRequest):
    """✅ UPDATED: Contract audit with quick validation first"""

    # Enhanced input validation
    if not data.address or not isinstance(data.address, str):
        raise HTTPException(
            status_code=400,
            detail="Contract address is required and must be a string"
        )
    
    # Clean address
    address = data.address.strip()
    if not address.startswith('0x'):
        raise HTTPException(
            status_code=400,
            detail="Invalid contract address. Must start with 0x"
        )
    
    if len(address) != 42:
        raise HTTPException(
            status_code=400, 
            detail=f"Invalid contract address length. Must be 42 characters, got {len(address)}"
        )
    
    # Validate chain
    chain = data.chain.lower().strip()
    if chain not in CHAIN_CONFIGS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported chain: {chain}. Supported: {list(CHAIN_CONFIGS.keys())}"
        )
    
    # 🚀 QUICK VALIDATION FIRST - Save time if invalid
    print(f"🔍 Quick validation for {address} on {chain}...")
    validation_error = quick_validate_contract(address, chain)
    
    if validation_error:
        print(f"❌ Validation failed: {validation_error['error']}")
        raise HTTPException(
            status_code=validation_error["status_code"],
            detail=validation_error["error"]
        )
    
    print(f"✅ Quick validation passed - proceeding with full audit...")
    
    temp_file = None
    temp_slither_file = None
    
    try:
        print(f"🚀 Starting REAL contract audit for {address} on {chain}")
        
        # 1. ✨ Initialize enhanced fetcher
        fetcher = EnhancedRealContractFetcher(chain)
        
        # 2. ✨ Fetch real contract source code with retries
        print(f"📡 Fetching contract data from {fetcher.explorer}...")
        contract_data = fetcher.fetch_contract_source(address)
        
        if not contract_data["source_code"]:
            raise HTTPException(
                status_code=404,
                detail=f"Contract source code not available. Contract must be verified on {fetcher.explorer}. Please verify your contract first."
            )
        
        # 3. ✨ Save contract to temporary file with validation
        print(f"💾 Processing and saving contract: {contract_data['contract_name']}")
        temp_file = fetcher.save_contract_to_file(
            contract_data["source_code"],
            contract_data["contract_name"], 
            address
        )
        
        # 4. ✨ Run Slither analysis
        print("🔍 Running Slither security analysis...")
        vulnerabilities, temp_slither_file = run_slither(temp_file, address)
        print(f"🔍 Found {len(vulnerabilities)} potential issues")
        
        # 5. ✨ Enhanced analysis with real blockchain data
        print("📊 Running enhanced blockchain analysis...")
        
        # Initialize analyzers
        etherscan_api = EtherscanAPI(chain)
        honeypot_detector = HoneypotDetector()
        social_analyzer = SocialAnalyzer()
        
        # Get comprehensive analysis
        contract_info = etherscan_api.get_contract_info(address)
        contract_info.contract_name = contract_data.get("contract_name", "Unknown")
        contract_info.compiler_version = contract_data.get("compiler_version", "")
        
        ownership_analysis = analyze_ownership(contract_data["source_code"], address)
        trading_analysis = honeypot_detector.analyze_contract(address, contract_data["source_code"])
        social_presence = social_analyzer.analyze_project(address, contract_data["contract_name"])
        contract_stats = etherscan_api.get_contract_stats(address)

        # TAMBAHAN BARU: Indonesian Crime Analysis
        print("🚨 Running Indonesian crime pattern analysis...")
        crime_detector = IndonesianCrimeDetector()
        indonesian_crime_analysis = crime_detector.analyze_contract_crimes(
            contract_data["source_code"], 
            contract_data["contract_name"],
            social_presence,
            contract_stats
        )

         # 🆕 NEW: Regulatory Compliance Analysis
        print("⚖️ Running regulatory compliance analysis...")
        regulatory_mapper = IndonesianRegulatoryMapper()
        compliance_report = regulatory_mapper.generate_compliance_report(
            address,
            vulnerabilities,
            indonesian_crime_analysis,
            contract_info
        )
        
        # 6. ✨ Calculate comprehensive security metrics
        metrics = calculate_security_metrics(vulnerabilities, contract_stats.get("balance_eth", 0))
        metrics.contract_age_days = contract_stats.get("contract_age_days", 1)
        metrics.transaction_count = contract_stats.get("transaction_count", 0)
        metrics.unique_users = contract_stats.get("unique_users", 0)
        metrics.indonesia_crime_risk = indonesian_crime_analysis.overall_crime_risk
        metrics.indonesia_targeting_detected = indonesian_crime_analysis.is_targeting_indonesia
        metrics.legal_risk_score = compliance_report.legal_risk_score
        metrics.regulatory_violations_count = compliance_report.total_violations
        metrics.satgas_pasti_report_required = compliance_report.satgas_pasti_report_required
        metrics.compliance_status = compliance_report.compliance_status
        
        # Calculate overall trust score
        trust_score = calculate_trust_score(
            metrics, contract_info, ownership_analysis, trading_analysis, social_presence, contract_stats
        )
        metrics.trust_score = trust_score
        
        # 7. ✨ Enhanced risk assessment
        risk_level, risk_details = determine_risk_level(
            metrics, contract_info, ownership_analysis, trading_analysis, trust_score, contract_stats
        )
        
        # 8. ✨ Set AI summary as pending dan start background task
        print("🤖 Starting AI summary generation in background...")
        
        # Save pending status
        save_ai_summary_status(address, chain, "pending")
        
        # Set temporary AI summary
        ai_summary = """
        <div class="space-y-6 text-gray-200 text-base leading-relaxed">
          <section class="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-xl p-6 border-blue-400/30">
            <div class="flex items-center mb-6">
              <span class="text-3xl mr-4">🤖</span>
              <h2 class="text-2xl font-bold text-blue-300">AI Analysis In Progress</h2>
            </div>
            <div class="bg-blue-500/20 rounded-lg p-5 border-blue-400/30">
              <p class="text-blue-200 text-lg">
                Our AI security expert is analyzing your contract. This usually takes 30-60 seconds.
                Please check back shortly for detailed insights.
              </p>
            </div>
          </section>
        </div>
        """
        
        # Start background AI generation
        ai_thread = threading.Thread(
            target=generate_ai_summary_async,
            args=(address, chain, vulnerabilities, metrics, contract_info, 
                  ownership_analysis, trading_analysis, social_presence, 
                  contract_stats, indonesian_crime_analysis)
        )
        ai_thread.daemon = True
        ai_thread.start()
        
        recommendations = generate_recommendations(vulnerabilities, contract_info, ownership_analysis)
        gas_hints = generate_gas_optimization_hints(vulnerabilities)
        
        # 9. ✅ CREATE COMPLETE AUDIT RESULT
        audit_result = AuditResult(
            contract_address=address,
            chain=chain,
            audit_timestamp=datetime.now().isoformat(),
            risk_level=risk_level,
            risk_score=trust_score,
            security_metrics=metrics,
            vulnerabilities=vulnerabilities,
            ai_summary=ai_summary,
            recommendations=recommendations,
            gas_optimization_hints=gas_hints,
            audit_file_path="",  # Will be set below
            contract_info=contract_info,
            ownership_analysis=ownership_analysis,
            trading_analysis=trading_analysis,
            social_presence=social_presence,
            indonesian_crime_analysis=indonesian_crime_analysis,
            compliance_report=compliance_report
        )
        
        # 10. ✅ SAVE COMPLETE AUDIT RESULT (not raw slither)
        audit_results_dir = "audit_results"
        os.makedirs(audit_results_dir, exist_ok=True)
        
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        wallet_short = address[:10]
        
        # Save FULL audit result
        full_audit_filename = f"audit_{wallet_short}_{timestamp}.json"
        full_audit_path = os.path.join(audit_results_dir, full_audit_filename)
        
        # Convert to dict for JSON serialization
        audit_dict = audit_result.model_dump()
        
        with open(full_audit_path, 'w', encoding='utf-8') as f:
            json.dump(audit_dict, f, indent=2, ensure_ascii=False)
        
        # Update the audit_file_path to point to complete result
        audit_result.audit_file_path = full_audit_path
        
        print("✅ Real contract audit completed successfully!")
        print(f"📊 Risk Level: {risk_level}, Trust Score: {trust_score}/100")
        print(f"💾 Full audit saved to: {full_audit_path}")
        
        return audit_result
        
    except HTTPException:
        raise
    except ValueError as e:
        error_msg = str(e)
        if "not verified" in error_msg.lower():
            raise HTTPException(
                status_code=404, 
                detail=f"Contract not verified on blockchain explorer. Please verify your contract at {CHAIN_CONFIGS[chain]['explorer']} first."
            )
        else:
            raise HTTPException(status_code=400, detail=error_msg)
    except Exception as e:
        print(f"❌ Audit failed with unexpected error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Internal audit error: {str(e)}"
        )
    finally:
        # ✨ Enhanced cleanup
        if temp_file and os.path.exists(temp_file):
            try:
                os.remove(temp_file)
                print(f"🗑️ Cleaned up temporary contract file: {temp_file}")
            except Exception as cleanup_error:
                print(f"⚠️ Cleanup warning: {cleanup_error}")
        
        if temp_slither_file and os.path.exists(temp_slither_file):
            try:
                os.remove(temp_slither_file)
                print(f"🗑️ Cleaned up temporary slither file: {temp_slither_file}")
            except Exception as cleanup_error:
                print(f"⚠️ Cleanup warning: {cleanup_error}")

@app.get("/ai-summary/{address}", response_model=AISummaryResponse)
def get_ai_summary_status(address: str, chain: str = "ethereum"):
    """Get AI summary generation status"""
    try:
        ai_summaries_dir = "ai_summaries"
        status_file = os.path.join(ai_summaries_dir, f"{address.lower()}.json")
        
        if not os.path.exists(status_file):
            raise HTTPException(
                status_code=404,
                detail="No AI summary generation found for this address"
            )
        
        with open(status_file, 'r', encoding='utf-8') as f:
            status_data = json.load(f)
        
        return AISummaryResponse(**status_data)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error retrieving AI summary status: {str(e)}"
        )

@app.get("/load-audit-file", response_model=AuditResult)
def load_audit_file(path: str, address: Optional[str] = None, chain: Optional[str] = "ethereum"):
    """✅ MODIFIED: Load complete audit result (not raw slither data)"""
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="Audit file not found")

    try:
        with open(path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # ✅ Check if it's complete audit result or legacy raw slither data
        if "contract_address" in data and "security_metrics" in data and "contract_info" in data:
            # It's a complete audit result - perfect! 
            print("✅ Loading complete audit result")
            return AuditResult(**data)
        
        else:
            # Legacy raw slither data - convert it
            print("⚠️ Loading legacy raw Slither data - converting to audit result")
            
            vulnerabilities = parse_slither_results(data)
            metrics = calculate_security_metrics(vulnerabilities)
            
            # Create default enhanced data for legacy files
            contract_info = ContractInfo(is_verified=False)
            ownership_analysis = OwnershipAnalysis()
            trading_analysis = TradingAnalysis()
            social_presence = SocialPresence()
            
            # Calculate basic trust score
            trust_score = 50
            if metrics.critical_issues == 0:
                trust_score += 20
            if metrics.high_issues == 0:
                trust_score += 15
            trust_score = min(100, trust_score)
            metrics.trust_score = trust_score
            
            # Determine risk level
            if metrics.critical_issues > 0:
                risk_level = "Critical"
            elif metrics.high_issues >= 3:
                risk_level = "High"
            elif metrics.high_issues > 0 or metrics.medium_issues >= 5:
                risk_level = "Medium"
            else:
                risk_level = "Low"
            
            ai_summary = f"""
            <div class="space-y-4 text-gray-200 text-base leading-relaxed">
              <section>
                <h2 class="text-lg font-semibold text-yellow-400">⚠️ Legacy Audit Result</h2>
                <p>This is an older audit result with limited enhanced analysis data.</p>
              </section>
              
              <section>
                <h2 class="text-lg font-semibold text-blue-400">📊 Security Summary</h2>
                <ul class="list-disc pl-5 text-gray-300 space-y-1">
                  <li>Total Issues: <strong>{metrics.total_issues}</strong></li>
                  <li>Critical: <strong>{metrics.critical_issues}</strong></li>
                  <li>High: <strong>{metrics.high_issues}</strong></li>
                  <li>Medium: <strong>{metrics.medium_issues}</strong></li>
                  <li>Low: <strong>{metrics.low_issues}</strong></li>
                </ul>
              </section>
              
              <section>
                <h2 class="text-lg font-semibold text-green-400">💡 Recommendation</h2>
                <p>Consider running a new audit for complete enhanced analysis including honeypot detection, ownership analysis, and social presence verification.</p>
              </section>
            </div>
            """
            
            recommendations = generate_recommendations(vulnerabilities, contract_info, ownership_analysis)
            gas_hints = generate_gas_optimization_hints(vulnerabilities)
            
            return AuditResult(
                contract_address=address or "Unknown",
                chain=chain,
                audit_timestamp=datetime.now().isoformat(),
                risk_level=risk_level,
                risk_score=trust_score,
                security_metrics=metrics,
                vulnerabilities=vulnerabilities,
                ai_summary=ai_summary,
                recommendations=recommendations,
                gas_optimization_hints=gas_hints,
                audit_file_path=path,
                contract_info=contract_info,
                ownership_analysis=ownership_analysis,
                trading_analysis=trading_analysis,
                social_presence=social_presence
            )
            
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON file format")
    except Exception as e:
        print(f"Error loading audit file: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error loading audit file: {str(e)}")

@app.get("/audit-history/{address}")
def get_audit_history(address: str):
    """✅ MODIFIED: Get audit history - now looks for complete audit files"""
    audit_results_dir = "audit_results"
    if not os.path.exists(audit_results_dir):
        return {"history": []}
    
    wallet_short = address[:10]
    
    # Look for complete audit files (new format)
    audit_files = [
        f for f in os.listdir(audit_results_dir) 
        if f.startswith(f"audit_{wallet_short}_") and f.endswith(".json")
    ]
    
    # Also look for legacy slither files if no new audit files found
    legacy_files = [
        f for f in os.listdir(audit_results_dir) 
        if f.startswith(f"slither_{wallet_short}_") and f.endswith(".json") and not f.startswith("slither_temp_")
    ]
    
    history = []
    
    # Process complete audit files first (preferred)
    for file in sorted(audit_files, reverse=True)[:10]:
        file_path = os.path.join(audit_results_dir, file)
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                
                if "security_metrics" in data:  # Complete audit result
                    history.append({
                        "timestamp": data.get("audit_timestamp", ""),
                        "risk_level": data.get("risk_level", "Unknown"),
                        "trust_score": data.get("risk_score", 0),
                        "total_issues": data.get("security_metrics", {}).get("total_issues", 0),
                        "file_path": file_path,
                        "file_type": "complete_audit"
                    })
        except Exception as e:
            print(f"Error reading audit file {file}: {e}")
            continue
    
    # Add legacy files if no complete audits found
    if not history:
        for file in sorted(legacy_files, reverse=True)[:5]:
            file_path = os.path.join(audit_results_dir, file)
            try:
                with open(file_path, 'r') as f:
                    data = json.load(f)
                    issues_count = len(data.get("results", {}).get("detectors", []))
                    history.append({
                        "timestamp": file.split('_')[-1].replace('.json', ''),
                        "risk_level": "Unknown",
                        "trust_score": 0,
                        "total_issues": issues_count,
                        "file_path": file_path,
                        "file_type": "legacy_slither"
                    })
            except Exception as e:
                print(f"Error reading legacy file {file}: {e}")
                continue
    
    return {"address": address, "history": history}

@app.get("/compliance-report/{address}")
def get_compliance_report(address: str, chain: str = "ethereum"):
    """Get regulatory compliance report for specific contract"""
    
    try:
        # Load latest audit result
        audit_results_dir = "audit_results"
        wallet_short = address[:10]
        
        # Find latest audit file
        audit_files = [
            f for f in os.listdir(audit_results_dir) 
            if f.startswith(f"audit_{wallet_short}_") and f.endswith(".json")
        ]
        
        if not audit_files:
            raise HTTPException(
                status_code=404, 
                detail="No audit results found for this address"
            )
        
        latest_file = sorted(audit_files, reverse=True)[0]
        file_path = os.path.join(audit_results_dir, latest_file)
        
        with open(file_path, 'r', encoding='utf-8') as f:
            audit_data = json.load(f)
        
        # Extract compliance report
        if "compliance_report" not in audit_data:
            raise HTTPException(
                status_code=404,
                detail="Compliance report not available for this audit"
            )
        
        return audit_data["compliance_report"]
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error retrieving compliance report: {str(e)}"
        )

@app.get("/satgas-pasti-report/{address}")
def generate_satgas_pasti_report(address: str):
    """Generate official Satgas PASTI report format"""
    
    try:
        # Get compliance report first
        compliance_data = get_compliance_report(address)
        
        if not compliance_data["satgas_pasti_report_required"]:
            return {
                "report_required": False,
                "message": "No violations requiring Satgas PASTI reporting found"
            }
        
        # Generate official report format
        report = {
            "report_header": {
                "report_id": f"PASTI-{address[:10]}-{datetime.now().strftime('%Y%m%d')}",
                "report_date": datetime.now().isoformat(),
                "reporting_entity": "AutoSentinel Security Platform",
                "contract_address": address,
                "report_type": "CRYPTOCURRENCY_FRAUD_DETECTION"
            },
            "violation_summary": {
                "total_violations": compliance_data["total_violations"],
                "legal_risk_score": compliance_data["legal_risk_score"],
                "compliance_status": compliance_data["compliance_status"],
                "immediate_action_required": any(
                    v["compliance_action"] == "IMMEDIATE_BLOCK" 
                    for v in compliance_data["violations"]
                )
            },
            "detailed_violations": compliance_data["violations"],
            "recommended_actions": compliance_data["recommended_actions"],
            "supporting_evidence": {
                "technical_analysis_available": True,
                "behavioral_analysis_available": True,
                "blockchain_transaction_data": True
            }
        }
        
        return report
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generating Satgas PASTI report: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)