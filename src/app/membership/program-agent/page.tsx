"use client";

import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Toast } from "@/components/ui/toast";
import { MembershipHero } from "@/components/membership/membership-hero";
import { useMembershipStore } from "@/stores/membership-store";

export default function ProgramAgentPage() {
  const program = useMembershipStore((s) =>
    s.programs.find((p) => p.id === "program-agent"),
  );

  if (!program || program.status === "inactive") notFound();

  return (
    <div className="min-h-screen pt-[72px] animate-fade-up">
      <Navbar />
      <MembershipHero
        eyebrow={program.eyebrow}
        title={program.title}
        titleAccent={program.titleAccent}
        description={program.description}
        image={program.image}
        imageCaption={program.imageCaption}
        bannerText={program.bannerText}
      />
      <Footer />
      <Toast />
    </div>
  );
}
