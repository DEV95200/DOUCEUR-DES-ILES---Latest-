export type ProductCategory =
  | "salades"
  | "sauces"
  | "boissons"
  | "douceurs"
  | "coffrets"
  | "recettes";

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  price: number;
  compareAtPrice?: number;
  unit: string;
  shortDescription: string;
  description: string;
  icon: string;
  gradient: string;
  badge?: "Bestseller" | "Nouveau" | "Épicé" | "Édition limitée";
  spiceLevel?: 0 | 1 | 2 | 3;
  imageDataUrl?: string;
  stock?: number;
  active?: boolean;
  featured?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  quote: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export type BrandTheme = "lime" | "mango" | "chili" | "purple" | "mint" | "pink";

export interface Promotion {
  id: string;
  title: string;
  description: string;
  discountLabel: string;
  discountPercent: number;
  code?: string;
  theme: BrandTheme;
  active: boolean;
  endAt?: string;
}

export interface HeroContent {
  eyebrow: string;
  titleLine: string;
  titleHighlight: string;
  tagline: string;
  ctaPrimaryLabel: string;
  ctaSecondaryLabel: string;
}

export interface VideoContent {
  enabled: boolean;
  youtubeUrl: string;
  eyebrow: string;
  title: string;
  description: string;
}

export interface Recipe {
  id: string;
  title: string;
  excerpt: string;
  description: string;
  price: number;
  imageDataUrl?: string;
  icon: string;
  active: boolean;
  featured: boolean;
  duration: string;
  difficulty: "Facile" | "Intermédiaire" | "Avancé";
}

export interface AnnouncementSettings {
  enabled: boolean;
  text: string;
  linkLabel: string;
  linkHref: string;
}

export interface PopupSettings {
  enabled: boolean;
  title: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
  delaySeconds: number;
  showOncePerSession: boolean;
}

export interface MaintenanceSettings {
  enabled: boolean;
  title: string;
  message: string;
}

export interface ExperienceSettings {
  animationsEnabled: boolean;
  announcement: AnnouncementSettings;
  popup: PopupSettings;
  maintenance: MaintenanceSettings;
}

export interface CommerceSettings {
  currency: "EUR";
  shippingFee: number;
  freeShippingThreshold: number;
  salesEnabled: boolean;
  orderPrefix: string;
}

export interface SiteSettings {
  brandName: string;
  contactEmail: string;
  location: string;
  footerText: string;
}

export interface CustomerDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  notes?: string;
}

export interface OrderRecord {
  id: string;
  number: string;
  createdAt: string;
  status: "Nouvelle" | "En préparation" | "Expédiée" | "Terminée" | "Annulée";
  items: CartItem[];
  customer: CustomerDetails;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  promoCode?: string;
}
