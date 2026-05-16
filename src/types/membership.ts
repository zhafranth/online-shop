export type MembershipProgramId =
  | "program-agent"
  | "reseller-online"
  | "titip-jual";

export type MembershipStatus = "active" | "coming-soon" | "inactive";

export interface MembershipProgram {
  id: MembershipProgramId;
  eyebrow: string;
  title: string;
  titleAccent: string;
  description: string;
  image: string;
  imageCaption?: string;
  bannerText: string;
  status: MembershipStatus;
}

export const MEMBERSHIP_PROGRAM_IDS: MembershipProgramId[] = [
  "program-agent",
  "reseller-online",
  "titip-jual",
];

export const MEMBERSHIP_STATUS_LABEL: Record<MembershipStatus, string> = {
  active: "Aktif",
  "coming-soon": "Coming Soon",
  inactive: "Nonaktif",
};
