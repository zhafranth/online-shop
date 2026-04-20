"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface RegisterFormProps { onSwitchTab: () => void; onSuccess: () => void; }

export function RegisterForm({ onSwitchTab, onSuccess }: RegisterFormProps) {
  const [form, setForm] = useState({ nama: "", namaAkhir: "", email: "", telp: "", pass: "", confirm: "" });
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const upd = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleRegister = () => {
    if (!agree) { setMsg("Harap setujui syarat & ketentuan"); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); onSuccess(); }, 1200);
  };

  return (
    <div>
      <div className="font-serif text-[22px] mb-1.5">Buat akun baru</div>
      <div className="text-[13px] text-site-gray mb-6">Bergabunglah dengan komunitas VESTIRE</div>
      {msg && <div className={`px-3.5 py-2.5 text-[13px] mb-4 border ${msg.includes("berhasil") ? "bg-[#f0fdf4] text-[#166534] border-[#bbf7d0]" : "bg-[#fef2f2] text-[#991b1b] border-[#fecaca]"}`}>{msg}</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input label="Nama Depan" placeholder="Ahmad" value={form.nama} onChange={(e) => upd("nama", e.target.value)} />
        <Input label="Nama Belakang" placeholder="Fauzi" value={form.namaAkhir} onChange={(e) => upd("namaAkhir", e.target.value)} />
      </div>
      <div className="mt-3"><Input label="Email" type="email" placeholder="nama@email.com" value={form.email} onChange={(e) => upd("email", e.target.value)} /></div>
      <div className="mt-4"><Input label="No. HP (opsional)" type="tel" placeholder="08xx-xxxx-xxxx" value={form.telp} onChange={(e) => upd("telp", e.target.value)} /></div>
      <div className="mt-4"><Input label="Password" type="password" placeholder="Min. 8 karakter" value={form.pass} onChange={(e) => upd("pass", e.target.value)} /></div>
      <div className="mt-4"><Input label="Konfirmasi Password" type="password" placeholder="Ulangi password" value={form.confirm} onChange={(e) => upd("confirm", e.target.value)} /></div>
      <label className="flex gap-2.5 items-start my-5 cursor-pointer text-[13px] text-site-gray-dark">
        <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-0.5 accent-[#1a2744]" />
        <span>Saya menyetujui <span className="text-navy underline cursor-pointer underline-offset-[3px]">Syarat & Ketentuan</span> dan <span className="text-navy underline cursor-pointer underline-offset-[3px]">Kebijakan Privasi</span></span>
      </label>
      <Button variant="gold" fullWidth className="py-3.5 text-sm" onClick={handleRegister}>{loading ? "⏳ Membuat akun..." : "Buat Akun Gratis →"}</Button>
      <div className="text-center mt-5 text-[13px] text-site-gray">Sudah punya akun? <span className="text-navy font-semibold cursor-pointer underline underline-offset-[3px]" onClick={onSwitchTab}>Masuk</span></div>
    </div>
  );
}
