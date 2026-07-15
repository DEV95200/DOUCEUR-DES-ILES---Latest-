import { useMemo, useState } from "react";
import { useAdminStore } from "../../store/adminStore";
import { SectionHeading } from "../ui/SectionHeading";
import { WaveDivider } from "../ui/WaveDivider";
import { CategoryFilter } from "../shop/CategoryFilter";
import { ProductCard } from "../shop/ProductCard";
import { ProductModal } from "../shop/ProductModal";
import type { Product, ProductCategory } from "../../types";

export function Shop() {
  const products = useAdminStore((state) => state.products);
  const salesEnabled = useAdminStore((state) => state.commerce.salesEnabled);
  const [activeCategory, setActiveCategory] = useState<ProductCategory | "tous">("tous");
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const filteredProducts = useMemo(() => {
    const visible = products.filter((product) => product.active !== false);
    if (activeCategory === "tous") return visible;
    return visible.filter((product) => product.category === activeCategory);
  }, [activeCategory, products]);

  return (
    <section id="boutique" className="relative overflow-hidden px-6 py-28 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="La boutique"
          title="Choisissez vos saveurs"
          tagline="Des salades de mangue aux coffrets cadeaux, tout ce qu'il faut pour recevoir un peu des îles chez vous."
        />

        {!salesEnabled && (
          <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-kala-chili/20 bg-kala-chili/10 p-4 text-center text-sm font-semibold text-kala-chili">
            Les commandes sont temporairement suspendues. Le catalogue reste consultable.
          </div>
        )}

        <div className="mb-12 mt-10">
          <CategoryFilter active={activeCategory} onChange={setActiveCategory} />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} onQuickView={setQuickViewProduct} />
          ))}
        </div>
      </div>

      <ProductModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      <WaveDivider color="#ffffff" />
    </section>
  );
}
