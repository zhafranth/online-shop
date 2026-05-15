export interface ProductCategory {
  id: string;
  label: string;
  slug: string;
  description?: string;
  coverImage?: string;
  enabled: boolean;
  order: number;
}
