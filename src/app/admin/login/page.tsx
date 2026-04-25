"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useAdminAuthStore } from "@/stores/admin-auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminLoginPage() {
  const router = useRouter();
  const login = useAdminAuthStore((s) => s.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    const ok = login(email, password);
    if (ok) {
      router.replace("/admin/dashboard");
    } else {
      setError("Email atau password salah");
    }
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-4 py-10">
      <Link href="/" className="font-serif text-[30px] font-bold text-navy tracking-[0.08em] mb-8 no-underline">
        VESTIRE
      </Link>

      <div className="w-full max-w-[420px] bg-site-white border border-site-border p-8">
        <h1 className="font-serif text-[26px] font-semibold text-navy text-center mb-2">Admin Portal</h1>
        <p className="text-center text-sm text-site-gray mb-6">Masuk untuk mengelola toko VESTIRE</p>

        <div className="bg-gold-pale border border-gold/40 px-4 py-3 mb-6 text-[13px] text-site-gray-dark">
          <p className="font-semibold mb-1">🔑 Demo Credentials</p>
          <p>Email: <span className="font-mono">admin@vestire.com</span></p>
          <p>Password: <span className="font-mono">admin123</span></p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <Input
            id="admin-email"
            label="Email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@vestire.com"
          />

          <div>
            <label
              htmlFor="admin-password"
              className="block text-xs font-medium tracking-[0.06em] text-site-gray uppercase mb-1.5"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="admin-password"
                type={showPw ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-11 border-[1.5px] border-site-border bg-white font-sans text-sm text-site-text outline-none transition-colors duration-200 focus:border-navy placeholder:text-site-gray-light"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-site-gray hover:text-navy"
                aria-label={showPw ? "Sembunyikan password" : "Tampilkan password"}
              >
                {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="px-3.5 py-2.5 text-[13px] bg-[#fef2f2] text-[#991b1b] border border-[#fecaca]">
              {error}
            </div>
          )}

          <Button type="submit" fullWidth>
            Masuk
          </Button>
        </form>
      </div>
    </div>
  );
}
