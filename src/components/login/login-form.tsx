"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface LoginFormProps { onSwitchTab: () => void; }

export function LoginForm({ onSwitchTab }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = () => { setLoading(true); setTimeout(() => { setLoading(false); router.push("/"); }, 1200); };

  return (
    <div>
      <div className="font-serif text-[22px] mb-1.5">Selamat datang kembali</div>
      <div className="text-[13px] text-site-gray mb-7">Masuk ke akun VESTIRE kamu</div>
      <div className="mb-4"><Input label="Email" type="email" placeholder="nama@email.com" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
      <div className="mb-4">
        <label className="block text-xs font-medium tracking-[0.06em] text-site-gray uppercase mb-1.5">Password</label>
        <div className="relative">
          <input type={showPass ? "text" : "password"} placeholder="••••••••" value={pass} onChange={(e) => setPass(e.target.value)} className="w-full px-4 py-3 pr-11 border-[1.5px] border-site-border bg-white font-sans text-sm text-site-text outline-none focus:border-navy placeholder:text-site-gray-light" />
          <button onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-sm text-site-gray" type="button">{showPass ? "🙈" : "👁"}</button>
        </div>
      </div>
      <div className="text-right mb-5"><span className="text-xs text-gold cursor-pointer underline underline-offset-[3px]">Lupa password?</span></div>
      <Button variant="primary" fullWidth className="py-3.5 text-sm mb-4" onClick={handleLogin}>{loading ? "⏳ Memproses..." : "Masuk ke Akun"}</Button>
      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-site-border" />
        <span className="text-xs text-site-gray">atau masuk dengan</span>
        <div className="flex-1 h-px bg-site-border" />
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        <Button variant="outline" className="text-[13px]">G Google</Button>
        <Button variant="outline" className="text-[13px]">f Facebook</Button>
      </div>
      <div className="text-center mt-6 text-[13px] text-site-gray">Belum punya akun? <span className="text-navy font-semibold cursor-pointer underline underline-offset-[3px]" onClick={onSwitchTab}>Daftar sekarang</span></div>
    </div>
  );
}
