import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Toast } from "@/components/ui/toast";
import { MembershipHero } from "@/components/membership/membership-hero";

export default function TitipJualPage() {
  return (
    <div className="min-h-screen pt-[72px] animate-fade-up">
      <Navbar />
      <MembershipHero
        eyebrow="Membership"
        title="Titip"
        titleAccent="Jual"
        description="Titipkan pakaian Anda dan biarkan koleksi pribadi menemukan pemilik baru. Kami mengurus kurasi, foto, hingga penjualan akhir — Anda menerima hasilnya."
        image="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1400&q=80"
        imageCaption="Consignment rack · ThickApparel"
        bannerText="Titip Jual · Coming Soon · Stay Tuned"
      />
      <Footer />
      <Toast />
    </div>
  );
}
