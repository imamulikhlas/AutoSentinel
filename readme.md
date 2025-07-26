# Auto-Sentinel 🛡️

**AI-Powered Smart Contract Security Audit Platform with Indonesian Crime Pattern Detection**

Auto-Sentinel adalah platform audit keamanan smart contract berbasis AI yang dirancang khusus untuk mendeteksi pola kejahatan yang menargetkan Indonesia. Platform ini menggunakan teknologi AI canggih untuk menganalisis smart contract dan mendeteksi berbagai jenis ancaman keamanan serta pola kejahatan finansial.

## 🌟 Fitur Utama

### 🔍 **Analisis Keamanan Komprehensif**
- **AI-Based Vulnerability Detection**: Deteksi otomatis kerentanan menggunakan AI
- **Multi-Chain Support**: Mendukung Ethereum, Polygon, BSC, Arbitrum, Optimism, dan Base
- **Real-time Risk Scoring**: Penilaian risiko real-time dengan skor 0-100
- **Slither Integration**: Analisis statis menggunakan Slither analyzer

### 🇮🇩 **Indonesian Crime Pattern Analysis** (Fitur Unggulan)
- **Deteksi Pola Kejahatan**: Identifikasi judi online, skema Ponzi/MLM, money laundering
- **Analisis Perilaku Indonesia**: Skor perilaku khusus untuk target Indonesia
- **Timezone Analysis**: Analisis pola waktu transaksi
- **Structuring Detection**: Deteksi pola structuring untuk menghindari deteksi
- **Regulatory Compliance**: Penilaian kepatuhan terhadap regulasi Indonesia

### 📊 **Dashboard & Monitoring**
- **Interactive Dashboard**: Dashboard interaktif dengan animasi smooth
- **Real-time Metrics**: Metrik keamanan dan risiko real-time
- **Analysis History**: Riwayat analisis kontrak
- **Progress Tracking**: Tracking progress analisis dengan loading states

### 🤖 **AI-Powered Features**
- **AI Summary Generation**: Ringkasan AI untuk hasil audit
- **LLM Integration**: Integrasi dengan Azure OpenAI
- **Intelligent Risk Assessment**: Penilaian risiko cerdas berbasis AI

### 📋 **Compliance & Reporting**
- **Compliance Reports**: Laporan kepatuhan regulasi Indonesia
- **Satgas PASTI Integration**: Integrasi dengan sistem pelaporan Satgas PASTI
- **Legal Risk Assessment**: Penilaian risiko hukum
- **Regulatory Violation Detection**: Deteksi pelanggaran regulasi

### 🔐 **API Management**
- **RESTful API**: API lengkap untuk integrasi
- **API Key Management**: Manajemen API key dengan regenerasi
- **Rate Limiting**: Pembatasan rate untuk keamanan

## 🏗️ Arsitektur Teknologi

### **Frontend (Next.js 14)**
- **Framework**: Next.js 14 dengan TypeScript
- **UI Library**: Radix UI + Tailwind CSS + ShadCN UI
- **Animations**: Framer Motion dengan smooth transitions
- **State Management**: React Hooks dengan custom hooks
- **Charts**: Recharts untuk visualisasi data
- **Smooth Scrolling**: Lenis untuk pengalaman scrolling yang halus

### **Backend (Python FastAPI)**
- **Framework**: FastAPI 2.0.0
- **AI Integration**: Azure OpenAI API
- **Security Analysis**: Slither static analyzer
- **Multi-chain Support**: Web3 integration untuk berbagai blockchain
- **Database**: File-based storage dengan JSON
- **CORS**: Configured untuk cross-origin requests


## 🚀 Cara Menjalankan Aplikasi

### **Prerequisites**
- Node.js 18+ dan npm/pnpm
- Python 3.8+
- Slither analyzer
- Azure OpenAI API key

### **Backend Setup**

1. **Install Dependencies**
```bash
cd BE
pip install fastapi uvicorn python-dotenv requests slither-analyzer
```

2. **Environment Configuration**
Buat file `.env` di folder `BE/`:
```env
AZURE_OPENAI_API_KEY=your_azure_openai_api_key
```

3. **Run Backend Server**
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### **Frontend Setup**

1. **Install Dependencies**
```bash
cd FE
npm install
# atau
pnpm install
```

2. **Environment Configuration**
Buat file `.env.local` di folder `FE/`:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

3. **Run Frontend**
```bash
npm run dev
# atau
pnpm dev
```

4. **Access Application**
Buka browser dan akses: `http://localhost:3000`

## 🔌 API Endpoints

### **Core Endpoints**
- `POST /audit-contract` - Audit smart contract
- `GET /ai-summary/{address}` - Get AI summary
- `GET /audit-history/{address}` - Get audit history
- `GET /compliance-report/{address}` - Get compliance report
- `GET /satgas-pasti-report/{address}` - Get Satgas PASTI report
- `GET /load-audit-file` - Load existing audit file

### **Example Request**
```json
{
  "address": "0x1234567890123456789012345678901234567890",
  "chain": "ethereum"
}
```

### **Example Response**
```json
{
  "contract_address": "0x1234567890123456789012345678901234567890",
  "chain": "ethereum",
  "risk_level": "HIGH",
  "risk_score": 85,
  "security_metrics": {
    "total_issues": 15,
    "critical_issues": 3,
    "security_score": 45,
    "indonesia_crime_risk": 78
  },
  "indonesian_crime_analysis": {
    "overall_crime_risk": 78,
    "is_targeting_indonesia": true,
    "detected_crimes": [...],
    "regulatory_violations": [...]
  }
}
```

## 🌐 Supported Blockchains

- **Ethereum Mainnet** (Chain ID: 1)
- **Polygon** (Chain ID: 137)
- **Binance Smart Chain** (Chain ID: 56)
- **Arbitrum** (Chain ID: 42161)
- **Optimism** (Chain ID: 10)
- **Base** (Chain ID: 8453)

## 🧪 Quick Testing

### **Test dengan Sample Contract**
```bash
curl -X POST "http://localhost:8000/audit-contract" \
  -H "Content-Type: application/json" \
  -d '{
    "address": "0xA0b86a33E6441e8e421c7c7c4b8b8b8b8b8b8b8b",
    "chain": "ethereum"
  }'
```

### **Test AI Summary**
```bash
curl "http://localhost:8000/ai-summary/0xA0b86a33E6441e8e421c7c7c4b8b8b8b8b8b8b8b"
```

## 🏆 Hackathon Features

Auto-Sentinel dikembangkan untuk **Hackathon BI OJK** dengan fokus pada:

- **Financial Crime Detection**: Deteksi kejahatan finansial yang menargetkan Indonesia
- **Regulatory Compliance**: Kepatuhan terhadap regulasi Indonesia (UU ITE, UU TPPU)
- **Satgas PASTI Integration**: Integrasi dengan sistem pelaporan Satgas PASTI
- **Indonesian Behavioral Analysis**: Analisis perilaku khusus untuk konteks Indonesia

## 👥 Tim Pengembang

**Team Auto-Sentinel**
- M IMAMUL IKHLAS - Team Leader (Fullstack Developer & Blockchain Researcher)
- SELA AMELIA (UI/UX Designer)
- FAREL IMAM MAULANA (Researcher)

## 📄 Lisensi

MIT License - Lihat file LICENSE untuk detail lengkap.

## 🤝 Kontribusi

Kami menyambut kontribusi dari komunitas! Silakan buat issue atau pull request untuk perbaikan dan fitur baru.

---

**Auto-Sentinel** - Melindungi ekosistem blockchain Indonesia dengan teknologi AI terdepan 🇮🇩