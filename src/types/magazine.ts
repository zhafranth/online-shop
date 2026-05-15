export type MagazineCategory = "Tips Mix & Match" | "Fashion News" | "Education";

export type MagazineCategorySlug = "tips-mix-match" | "fashion-news" | "education";

export interface MagazineBlock {
  type: "paragraph" | "heading" | "image" | "quote";
  text?: string;
  src?: string;
  caption?: string;
  attribution?: string;
}

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: MagazineCategory;
  categorySlug: MagazineCategorySlug;
  cover: string;
  coverCaption?: string;
  author: string;
  authorBio: string;
  date: string;
  readTime: number;
  featured?: boolean;
  body: MagazineBlock[];
}

export const CATEGORY_TO_SLUG: Record<MagazineCategory, MagazineCategorySlug> = {
  "Tips Mix & Match": "tips-mix-match",
  "Fashion News": "fashion-news",
  Education: "education",
};

export const SLUG_TO_CATEGORY: Record<MagazineCategorySlug, MagazineCategory> = {
  "tips-mix-match": "Tips Mix & Match",
  "fashion-news": "Fashion News",
  education: "Education",
};
