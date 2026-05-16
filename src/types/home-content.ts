export interface HeroSlide {
  id: string;
  src: string;
  alt: string;
  order: number;
}

export interface UspItem {
  id: string;
  icon: string;
  title: string;
  sub: string;
  order: number;
}

export interface HomeVisibility {
  showHero: boolean;
  showTicker: boolean;
  showUsp: boolean;
  showBestSeller: boolean;
  showLatestMagazine: boolean;
  showNewArrivals: boolean;
  showGenderBanner: boolean;
}

export interface BestSellerConfig {
  productIds: [number | null, number | null, number | null, number | null];
}

export interface HomeContent {
  heroSlides: HeroSlide[];
  tickerText: string;
  uspItems: UspItem[];
  bestSeller: BestSellerConfig;
  visibility: HomeVisibility;
}

export type HomeSectionKey =
  | "hero"
  | "ticker"
  | "usp"
  | "bestSeller"
  | "visibility";
