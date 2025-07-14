import os
import subprocess
import json
import shutil
import platform
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_methods=["*"],
    allow_headers=["*"],
)

class ContractRequest(BaseModel):
    address: str
    chain: str

class AuditResult(BaseModel):
    risk_level: str
    risk_score: int
    vulnerabilities: List[str]
    ai_summary: str

# Fungsi audit pakai Slither CLI
def run_slither(source_path: str) -> List[str]:
    slither_exe = shutil.which("slither") or shutil.which("slither.cmd")
    if not slither_exe:
        raise RuntimeError("❌ Slither tidak ditemukan di PATH.")

    result = subprocess.run(
        [slither_exe, source_path, "--json", "slither.json"],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )

    if not os.path.exists("slither.json"):
        raise RuntimeError(f"Gagal menjalankan Slither. Exit code: {result.returncode}")

    with open("slither.json") as f:
        data = json.load(f)

    return [d["check"] for d in data.get("results", {}).get("detectors", [])]

# Ringkasan dari Gemini (opsional)
def explain_with_gemini(vulns: List[str]) -> str:
    prompt = (
        "Tulis ringkasan singkat dan padat untuk pengguna awam tentang mengapa celah berikut ini berbahaya "
        "dalam smart contract. Gunakan bullet point pendek, hindari istilah teknis:\n- "
        + "\n- ".join(vulns)
    )
    try:
        model = genai.GenerativeModel("gemini-2.0-flash")
        rsp = model.generate_content(prompt)
        return rsp.text.strip()
    except Exception as e:
        return "Gagal mengambil penjelasan dari Gemini: " + str(e)

@app.post("/audit-contract", response_model=AuditResult)
def audit_contract(data: ContractRequest):
    file: str 
    if data.address == "0xef9f4c0c3403d269c867c908e7f66748cc17f28a" :
        file = f"low-risk" 
    if data.address == "0xbbe4301e96961e3f0cb0d75eb1a1dbf982e8e59d" :
        file = f"medium-risk" 
    if data.address == "0x0482a1e0d4e4f2628d27ec60112bd86b773de80a" :
        file = f"high-risk" 
    
    
    solidity_file = f"contracts/{file}.sol" # kontrak dummy lokal
    try:
        vulns = run_slither(solidity_file)
    except Exception as e:
        return AuditResult(
            risk_level="Unknown",
            risk_score=0,
            vulnerabilities=["Gagal memproses kontrak"],
            ai_summary=str(e),
        )
    # Skor & level
    score = 90 if len(vulns) >= 5 else 60 if len(vulns) >= 2 else 20
    level = "High" if score >= 80 else "Medium" if score >= 40 else "Low"
    summary = explain_with_gemini(vulns) if vulns else "Tidak ditemukan kerentanan serius."
    return AuditResult(
        risk_level=level,
        risk_score=score,
        vulnerabilities=vulns,
        ai_summary=summary,
    )
