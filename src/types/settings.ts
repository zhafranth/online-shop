export type SocialPlatform =
  | "instagram"
  | "tiktok"
  | "youtube"
  | "twitter"
  | "facebook";

export interface SocialLink {
  platform: SocialPlatform;
  url: string;
}

export interface SettingsBranding {
  brandName: string;
  tagline: string;
  logoUrl: string;
  faviconUrl: string;
}

export interface SettingsContact {
  address: string;
  city: string;
  phone: string;
  whatsapp: string;
  emailCs: string;
  operationalHours: string;
}

export interface SettingsFooter {
  aboutText: string;
  newsletterHeading: string;
  copyright: string;
}

export interface SettingsSeo {
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
  siteUrl: string;
}

export type IntegrationMode = "mock" | "live";

export interface SettingsIntegrations {
  rajaOngkirKey: string;
  rajaOngkirMode: IntegrationMode;
  paymentGatewayKey: string;
  paymentGatewayMode: IntegrationMode;
}

export interface SettingsMaintenance {
  enabled: boolean;
  message: string;
  eta: string;
  allowAdmin: boolean;
}

export interface Settings {
  branding: SettingsBranding;
  contact: SettingsContact;
  social: SocialLink[];
  footer: SettingsFooter;
  seo: SettingsSeo;
  integrations: SettingsIntegrations;
  maintenance: SettingsMaintenance;
}

export type SettingsSectionKey =
  | "branding"
  | "contact"
  | "social"
  | "footer"
  | "seo"
  | "integrations"
  | "maintenance";

export const SOCIAL_PLATFORM_META: Record<
  SocialPlatform,
  { label: string; placeholder: string; abbr: string; host: string }
> = {
  instagram: {
    label: "Instagram",
    placeholder: "https://instagram.com/thickapparel",
    abbr: "IG",
    host: "instagram.com",
  },
  tiktok: {
    label: "TikTok",
    placeholder: "https://tiktok.com/@thickapparel",
    abbr: "TT",
    host: "tiktok.com",
  },
  youtube: {
    label: "YouTube",
    placeholder: "https://youtube.com/@thickapparel",
    abbr: "YT",
    host: "youtube.com",
  },
  twitter: {
    label: "Twitter / X",
    placeholder: "https://x.com/thickapparel",
    abbr: "X",
    host: "x.com",
  },
  facebook: {
    label: "Facebook",
    placeholder: "https://facebook.com/thickapparel",
    abbr: "FB",
    host: "facebook.com",
  },
};
