import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  defaultCommerce,
  defaultExperience,
  defaultHero,
  defaultProducts,
  defaultPromotions,
  defaultRecipes,
  defaultSiteSettings,
  defaultVideo,
} from "../data/adminDefaults";
import type {
  CommerceSettings,
  ExperienceSettings,
  HeroContent,
  OrderRecord,
  Product,
  Promotion,
  Recipe,
  SiteSettings,
  VideoContent,
} from "../types";

export interface AdminSnapshot {
  products: Product[];
  promotions: Promotion[];
  recipes: Recipe[];
  hero: HeroContent;
  video: VideoContent;
  experience: ExperienceSettings;
  commerce: CommerceSettings;
  siteSettings: SiteSettings;
  orders: OrderRecord[];
}

interface AdminState extends AdminSnapshot {
  updateProduct: (id: string, patch: Partial<Product>) => void;
  addProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  updatePromotion: (id: string, patch: Partial<Promotion>) => void;
  addPromotion: (promotion: Promotion) => void;
  deletePromotion: (id: string) => void;
  updateRecipe: (id: string, patch: Partial<Recipe>) => void;
  addRecipe: (recipe: Recipe) => void;
  deleteRecipe: (id: string) => void;
  setHero: (patch: Partial<HeroContent>) => void;
  setVideo: (patch: Partial<VideoContent>) => void;
  setExperience: (settings: ExperienceSettings) => void;
  setCommerce: (patch: Partial<CommerceSettings>) => void;
  setSiteSettings: (patch: Partial<SiteSettings>) => void;
  addOrder: (order: OrderRecord) => void;
  updateOrderStatus: (id: string, status: OrderRecord["status"]) => void;
  importSnapshot: (snapshot: Partial<AdminSnapshot>) => void;
  resetAll: () => void;
}

function cloneDefaults(): AdminSnapshot {
  return {
    products: structuredClone(defaultProducts),
    promotions: structuredClone(defaultPromotions),
    recipes: structuredClone(defaultRecipes),
    hero: structuredClone(defaultHero),
    video: structuredClone(defaultVideo),
    experience: structuredClone(defaultExperience),
    commerce: structuredClone(defaultCommerce),
    siteSettings: structuredClone(defaultSiteSettings),
    orders: [],
  };
}

const initial = cloneDefaults();

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      ...initial,
      updateProduct: (id, patch) =>
        set((state) => ({
          products: state.products.map((product) =>
            product.id === id ? { ...product, ...patch } : product
          ),
        })),
      addProduct: (product) =>
        set((state) => ({ products: [product, ...state.products] })),
      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter((product) => product.id !== id),
        })),
      updatePromotion: (id, patch) =>
        set((state) => ({
          promotions: state.promotions.map((promotion) =>
            promotion.id === id ? { ...promotion, ...patch } : promotion
          ),
        })),
      addPromotion: (promotion) =>
        set((state) => ({ promotions: [promotion, ...state.promotions] })),
      deletePromotion: (id) =>
        set((state) => ({
          promotions: state.promotions.filter((promotion) => promotion.id !== id),
        })),
      updateRecipe: (id, patch) =>
        set((state) => ({
          recipes: state.recipes.map((recipe) =>
            recipe.id === id ? { ...recipe, ...patch } : recipe
          ),
        })),
      addRecipe: (recipe) =>
        set((state) => ({ recipes: [recipe, ...state.recipes] })),
      deleteRecipe: (id) =>
        set((state) => ({
          recipes: state.recipes.filter((recipe) => recipe.id !== id),
        })),
      setHero: (patch) => set((state) => ({ hero: { ...state.hero, ...patch } })),
      setVideo: (patch) =>
        set((state) => ({ video: { ...state.video, ...patch } })),
      setExperience: (experience) => set({ experience }),
      setCommerce: (patch) =>
        set((state) => ({ commerce: { ...state.commerce, ...patch } })),
      setSiteSettings: (patch) =>
        set((state) => ({
          siteSettings: { ...state.siteSettings, ...patch },
        })),
      addOrder: (order) =>
        set((state) => ({
          orders: [order, ...state.orders],
          products: state.products.map((product) => {
            const ordered = order.items.find((item) => item.product.id === product.id);
            if (!ordered || product.stock === undefined) return product;
            return { ...product, stock: Math.max(0, product.stock - ordered.quantity) };
          }),
        })),
      updateOrderStatus: (id, status) =>
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === id ? { ...order, status } : order
          ),
        })),
      importSnapshot: (snapshot) =>
        set((state) => ({
          products: snapshot.products ?? state.products,
          promotions: snapshot.promotions ?? state.promotions,
          recipes: snapshot.recipes ?? state.recipes,
          hero: { ...state.hero, ...(snapshot.hero ?? {}) },
          video: { ...state.video, ...(snapshot.video ?? {}) },
          experience: snapshot.experience ?? state.experience,
          commerce: { ...state.commerce, ...(snapshot.commerce ?? {}) },
          siteSettings: { ...state.siteSettings, ...(snapshot.siteSettings ?? {}) },
          orders: snapshot.orders ?? state.orders,
        })),
      resetAll: () => set(cloneDefaults()),
    }),
    {
      name: "kalawang-forge-v1",
      version: 1,
      merge: (persisted, current) => {
        const data = persisted as Partial<AdminState>;
        return {
          ...current,
          ...data,
          hero: { ...current.hero, ...(data.hero ?? {}) },
          video: { ...current.video, ...(data.video ?? {}) },
          commerce: { ...current.commerce, ...(data.commerce ?? {}) },
          siteSettings: { ...current.siteSettings, ...(data.siteSettings ?? {}) },
          experience: data.experience ?? current.experience,
        };
      },
    }
  )
);

export function getAdminSnapshot(): AdminSnapshot {
  const state = useAdminStore.getState();
  return {
    products: state.products,
    promotions: state.promotions,
    recipes: state.recipes,
    hero: state.hero,
    video: state.video,
    experience: state.experience,
    commerce: state.commerce,
    siteSettings: state.siteSettings,
    orders: state.orders,
  };
}
