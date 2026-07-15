import { motion } from "framer-motion";
import { BookOpen, Clock3, Plus } from "lucide-react";
import toast from "react-hot-toast";
import { useAdminStore } from "../../store/adminStore";
import { useCartStore } from "../../store/cartStore";
import type { Product, Recipe } from "../../types";
import { SectionHeading } from "../ui/SectionHeading";
import { WaveDivider } from "../ui/WaveDivider";

const euro = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });

function recipeToProduct(recipe: Recipe): Product {
  return {
    id: `recipe-${recipe.id}`,
    slug: recipe.id,
    name: recipe.title,
    category: "recettes",
    price: recipe.price,
    unit: "fiche numérique",
    shortDescription: recipe.excerpt,
    description: recipe.description,
    icon: recipe.icon || "📖",
    gradient: "from-kala-purple to-kala-pink",
    imageDataUrl: recipe.imageDataUrl,
    active: recipe.active,
    stock: 9999,
  };
}

export function Recipes() {
  const recipes = useAdminStore((state) => state.recipes).filter((recipe) => recipe.active);
  const addItem = useCartStore((state) => state.addItem);
  if (recipes.length === 0) return null;

  function addRecipe(recipe: Recipe) {
    addItem(recipeToProduct(recipe));
    toast.success(`${recipe.title} ajoutée au panier`, { icon: "📖" });
  }

  return (
    <section id="recettes" className="relative overflow-hidden bg-white px-6 py-28 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Recettes numériques"
          title="Apprenez les gestes de la maison"
          tagline="Des fiches détaillées à acheter et à recevoir après votre commande. Les prix et contenus se pilotent depuis Forge."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe, index) => (
            <motion.article
              key={recipe.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06 }}
              className="overflow-hidden rounded-[2rem] border border-kala-ink/10 bg-kala-cream shadow-sm"
            >
              <div className="relative flex h-52 items-center justify-center overflow-hidden bg-gradient-to-br from-kala-purple to-kala-pink">
                {recipe.imageDataUrl ? (
                  <img src={recipe.imageDataUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-7xl">{recipe.icon || "📖"}</span>
                )}
                <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-kala-ink">
                  {recipe.difficulty}
                </span>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4 text-xs font-semibold text-kala-ink/50">
                  <span className="inline-flex items-center gap-1"><Clock3 size={14} /> {recipe.duration}</span>
                  <span className="inline-flex items-center gap-1"><BookOpen size={14} /> PDF numérique</span>
                </div>
                <h3 className="mt-4 font-display text-2xl font-bold leading-tight text-kala-ink">
                  {recipe.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-kala-ink/60">{recipe.excerpt}</p>
                <div className="mt-6 flex items-center justify-between">
                  <span className="font-display text-2xl font-bold text-kala-ink">{euro.format(recipe.price)}</span>
                  <button
                    onClick={() => addRecipe(recipe)}
                    className="inline-flex items-center gap-2 rounded-full bg-kala-green px-4 py-2.5 text-sm font-bold text-kala-cream transition hover:bg-kala-green-light"
                  >
                    <Plus size={16} /> Ajouter
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
      <WaveDivider color="#e8cb13" />
    </section>
  );
}
