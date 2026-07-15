import { products as sourceProducts } from "./products";
import type {
  CommerceSettings,
  ExperienceSettings,
  HeroContent,
  Promotion,
  Recipe,
  SiteSettings,
  VideoContent,
} from "../types";

export const defaultProducts = sourceProducts.map((product, index) => ({
  ...product,
  active: true,
  featured: index < 4,
  stock: 20,
}));

export const defaultHero: HeroContent = {
  eyebrow: "Épicerie créole en ligne",
  titleLine: "La douceur des îles,",
  titleHighlight: "livrée chez vous",
  tagline:
    "Kalawang, sauces, punchs et douceurs créoles faits maison, préparés en petites quantités.",
  ctaPrimaryLabel: "Découvrir la boutique",
  ctaSecondaryLabel: "Notre histoire",
};

export const defaultPromotions: Promotion[] = [
  {
    id: "promo-welcome",
    title: "Bienvenue chez Kalawang",
    description: "Profitez de 10 % sur votre première commande.",
    discountLabel: "-10 %",
    discountPercent: 10,
    code: "BIENVENUE10",
    theme: "lime",
    active: true,
  },
];

export const defaultVideo: VideoContent = {
  enabled: false,
  youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  eyebrow: "Dans les coulisses",
  title: "Découvrez comment nous préparons nos recettes",
  description:
    "Ajoutez ici une vidéo YouTube de présentation, de recette ou de campagne marketing.",
};

export const defaultRecipes: Recipe[] = [
  {
    id: "recipe-kalawang",
    title: "Le Kalawang traditionnel",
    excerpt: "La méthode complète pour réussir une mangue verte bien assaisonnée.",
    description:
      "Une fiche numérique détaillée avec les ingrédients, les quantités, les étapes et les conseils de conservation.",
    price: 3.9,
    icon: "🥭",
    active: true,
    featured: true,
    duration: "20 min",
    difficulty: "Facile",
  },
  {
    id: "recipe-sauce-chien",
    title: "Sauce chien maison",
    excerpt: "Une sauce fraîche et parfumée pour poissons, légumes et grillades.",
    description:
      "Une recette numérique claire avec les bons dosages, les variantes et les conseils pour équilibrer l'acidité.",
    price: 2.9,
    icon: "🌿",
    active: true,
    featured: false,
    duration: "15 min",
    difficulty: "Facile",
  },
];

export const defaultExperience: ExperienceSettings = {
  animationsEnabled: true,
  announcement: {
    enabled: true,
    text: "Livraison offerte dès 40 € d'achat",
    linkLabel: "Voir la boutique",
    linkHref: "#boutique",
  },
  popup: {
    enabled: false,
    title: "Une offre rien que pour vous",
    body: "Utilisez le code BIENVENUE10 pour profiter de 10 % sur votre première commande.",
    ctaLabel: "Découvrir l'offre",
    ctaHref: "#boutique",
    delaySeconds: 4,
    showOncePerSession: true,
  },
  maintenance: {
    enabled: false,
    title: "La boutique revient très vite",
    message: "Nous mettons à jour le site. Merci pour votre patience.",
  },
};

export const defaultCommerce: CommerceSettings = {
  currency: "EUR",
  shippingFee: 4.9,
  freeShippingThreshold: 40,
  salesEnabled: true,
  orderPrefix: "KLW",
};

export const defaultSiteSettings: SiteSettings = {
  brandName: "KALAWANG",
  contactEmail: "contact@kalawang.fr",
  location: "Guyane française",
  footerText:
    "La douceur des îles dans chaque bouchée. Salades de mangue, sauces, boissons et douceurs créoles faits maison, préparés en petites quantités et livrés frais.",
};
