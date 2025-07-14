# 🔍 Auto-Sentinel – Smart Contract Audit AI

**Auto-Sentinel** adalah platform audit otomatis berbasis AI yang dirancang untuk mendeteksi risiko, kerentanan, dan potensi penipuan dalam smart contract berbasis Ethereum. Solusi ini membantu melindungi pengguna dari bahaya finansial di dunia Web3.

---

## 🎯 Info Proyek

- **Subtema Hackathon:** Smart Contract Audit
- **Hackathon:** BI-OJK Hackathon 2025
- **Tim:** Anjay Mabar
- **Tech Stack:**
  - **Frontend**: Next.js + Tailwind CSS + ShadCN UI
  - **Backend AI**: Python FastAPI + LLM (AI Audit Engine)

---

## 🟌️ Demo & Link

| Komponen       | URL                                                                          |
| -------------- | ---------------------------------------------------------------------------- |
| 🌐 Frontend    | [http://localhost:3000](http://localhost:3000)                               |
| ⚙️ Backend API | [http://localhost:8000/audit-contract](http://localhost:8000/audit-contract) |
| 📊 Pitch Deck  | *(Tambahkan link pitch deck jika tersedia)*                                  |

---

## 📦 Fitur Utama

- ✅ Audit smart contract otomatis (berbasis AI)
- 🔍 Deteksi kerentanan kontrak seperti `withdrawAll`, `transferOwnership`, dll
- 📊 Skor risiko otomatis (Low / Medium / High)
- 🧠 Ringkasan audit berbasis LLM
- 🖼️ UI modern dan responsif (ShadCN + Tailwind)
- 📄 Fitur ekspor hasil audit & share
- 🌐 Dukungan multi-chain (Ethereum, BSC, Arbitrum)

---

## 📂 Struktur Proyek

```
auto-sentinel/
├── backend/           # FastAPI server
│   ├── main.py        # Endpoint API utama
│   └── audit/         # Modul AI & analisis kontrak
├── frontend/          # Next.js + Tailwind UI
│   ├── components/    # Reusable UI: AuditResultCard, dll
│   └── app/           # Routing & integrasi audit
├── README.md
```

---

## 🧑‍💻 Cara Menjalankan Proyek

### 1. Clone Repository

```bash
git clone https://github.com/anjaymabar/auto-sentinel.git
cd auto-sentinel
```

### 2. Jalankan Backend (FastAPI)

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

🔗 Endpoint Aktif: `POST /audit-contract`\
Contoh Payload:

```json
{
  "address": "0x00000000219ab540356cBB839Cbe05303d7705Fa",
  "chain": "ethereum"
}
```

### 3. Jalankan Frontend (Next.js)

```bash
cd ../frontend
npm install
npm run dev
```

Akses di browser: [http://localhost:3000](http://localhost:3000)

---

## 🧠 Contoh Respons dari Backend (Mock API)

```json
{
  "risk_level": "Medium",
  "risk_score": 65,
  "ai_summary": "Kontrak ini memungkinkan pemilik melakukan 'rug pull' tanpa batasan.",
  "vulnerabilities": [
    "Fungsi `withdrawAll()` tidak dibatasi oleh akses owner.",
    "Kurangnya validasi pada `transferOwnership()`."
  ]
}
```

---

## 🧪 Pengujian Cepat

- Gunakan alamat kontrak dummy:
  - `0x00000000219ab540356cBB839Cbe05303d7705Fa`
- Ganti parameter `chain` untuk menguji jaringan selain Ethereum (misal: `bsc`, `arbitrum`)

---

## 👥 Kontributor

- **Imam Ganteng** – Frontend & Integrasi AI
- *(Tambahkan anggota tim lainnya di sini)*

---

## 📄 Lisensi

MIT License – Silakan digunakan dan dikembangkan lebih lanjut untuk mendukung ekosistem Web3 yang aman dan terpercaya.

