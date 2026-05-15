import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Toast } from "@/components/ui/toast";
import { MembershipHero } from "@/components/membership/membership-hero";

export default function ProgramAgentPage() {
  return (
    <div className="min-h-screen pt-[72px] animate-fade-up">
      <Navbar />
      <MembershipHero
        eyebrow="Membership"
        title="Program"
        titleAccent="Agent"
        description="Untuk individu yang ingin membangun bisnis bersama ThickApparel. Kami menyiapkan jalur kemitraan eksklusif, pelatihan, dan dukungan operasional penuh."
        image="https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=1400&q=80"
        imageCaption="Atelier ThickApparel · Jakarta Selatan"
        bannerText="Program Agent · Segera Hadir · 2026"
      />
      <Footer />
      <Toast />
    </div>
  );
}
