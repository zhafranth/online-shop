import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Toast } from "@/components/ui/toast";
import { MembershipHero } from "@/components/membership/membership-hero";

export default function ResellerOnlinePage() {
  return (
    <div className="min-h-screen pt-[72px] animate-fade-up">
      <Navbar />
      <MembershipHero
        eyebrow="Membership"
        title="Reseller"
        titleAccent="Online"
        description="Jual koleksi kami dari mana saja. Kami menyiapkan inventaris, materi pemasaran, dan dukungan pengiriman — Anda fokus pada audiens dan cerita."
        image="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1400&q=80"
        imageCaption="Studio packaging · 2026"
        bannerText="Reseller Online · Pendaftaran Dibuka Akhir 2026"
      />
      <Footer />
      <Toast />
    </div>
  );
}
