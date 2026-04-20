"use client";
import { useState } from "react";
import Link from "next/link";
import { BrandPanel } from "@/components/login/brand-panel";
import { LoginForm } from "@/components/login/login-form";
import { RegisterForm } from "@/components/login/register-form";

export default function LoginPage() {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [msg, setMsg] = useState("");

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      <div className="hidden md:block">
        <BrandPanel />
      </div>
      <div className="bg-site-white flex flex-col justify-center px-5 py-10 sm:p-12 md:p-[clamp(40px,6vw,80px)] min-h-screen">
        <div className="md:hidden mb-8 text-center">
          <Link href="/" className="font-serif text-[26px] font-bold text-navy tracking-[0.06em] no-underline">VESTIRE</Link>
        </div>
        <div className="max-w-[400px] w-full mx-auto md:mx-0">
          <div className="flex border-[1.5px] border-site-border mb-8">
            {[["login", "Masuk"], ["register", "Daftar"]].map(([id, label]) => (
              <div key={id} onClick={() => { setTab(id as "login" | "register"); setMsg(""); }} className={`flex-1 text-center py-3 text-[13px] font-semibold tracking-[0.08em] uppercase cursor-pointer transition-all ${tab === id ? "bg-navy text-white" : "bg-white text-site-gray"}`}>{label}</div>
            ))}
          </div>
          {msg && <div className="px-3.5 py-2.5 text-[13px] mb-4 bg-[#f0fdf4] text-[#166534] border border-[#bbf7d0]">{msg}</div>}
          {tab === "login" ? (
            <LoginForm onSwitchTab={() => setTab("register")} />
          ) : (
            <RegisterForm onSwitchTab={() => setTab("login")} onSuccess={() => { setTab("login"); setMsg("Akun berhasil dibuat! Silakan masuk."); }} />
          )}
        </div>
      </div>
    </div>
  );
}
