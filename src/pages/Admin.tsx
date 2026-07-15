import { useRef, useState } from "react";
import type { ChangeEvent, ReactNode } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  AlertTriangle,
  BarChart3,
  BookOpen,
  CheckCircle2,
  Download,
  ExternalLink,
  Eye,
  Image as ImageIcon,
  LayoutDashboard,
  LockKeyhole,
  LogOut,
  Megaphone,
  Menu,
  Package,
  Plus,
  RefreshCcw,
  Save,
  Search,
  Settings,
  ShoppingCart,
  Trash2,
  Upload,
  Video,
  X,
} from "lucide-react";
import clsx from "clsx";
import {
  getAdminSnapshot,
  useAdminStore,
} from "../store/adminStore";
import type {
  AdminSnapshot,
} from "../store/adminStore";
import type {
  BrandTheme,
  ExperienceSettings,
  OrderRecord,
  Product,
  ProductCategory,
  Promotion,
  Recipe,
} from "../types";

const FORGE_SESSION_KEY = "kalawang-forge-session";
const FORGE_PASSWORD_KEY = "kalawang-forge-password";
const DEFAULT_PASSWORD = "kalawang2026";
const inputClass =
  "w-full rounded-2xl border border-kala-ink/10 bg-white px-4 py-3 text-sm text-kala-ink outline-none transition placeholder:text-kala-ink/30 focus:border-kala-green focus:ring-4 focus:ring-kala-green/10";
const labelClass = "mb-2 block text-xs font-bold uppercase tracking-wider text-kala-ink/50";

const categoryLabels: Record<ProductCategory, string> = {
  salades: "Salades",
  sauces: "Sauces",
  boissons: "Boissons",
  douceurs: "Douceurs",
  coffrets: "Coffrets",
  recettes: "Recettes",
};

const themeLabels: Record<BrandTheme, string> = {
  lime: "Citron vert",
  mango: "Mangue",
  chili: "Piment",
  purple: "Violet",
  mint: "Menthe",
  pink: "Rose",
};

const orderStatuses: OrderRecord["status"][] = [
  "Nouvelle",
  "En préparation",
  "Expédiée",
  "Terminée",
  "Annulée",
];

function uid(prefix: string) {
  return `${prefix}-${crypto.randomUUID?.() ?? `${Date.now()}-${Math.random()}`}`;
}

function readImage(file: File, callback: (dataUrl: string) => void) {
  if (file.size > 1_800_000) {
    toast.error("Image trop lourde : utilisez un fichier de moins de 1,8 Mo.");
    return;
  }
  const reader = new FileReader();
  reader.onload = () => callback(String(reader.result));
  reader.onerror = () => toast.error("Impossible de lire cette image.");
  reader.readAsDataURL(file);
}

export function Admin() {
  const [authenticated, setAuthenticated] = useState(
    () => sessionStorage.getItem(FORGE_SESSION_KEY) === "1"
  );

  if (!authenticated) {
    return <ForgeLogin onSuccess={() => setAuthenticated(true)} />;
  }

  return <ForgeDashboard onLogout={() => {
    sessionStorage.removeItem(FORGE_SESSION_KEY);
    setAuthenticated(false);
  }} />;
}

function ForgeLogin({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const expected = localStorage.getItem(FORGE_PASSWORD_KEY) || DEFAULT_PASSWORD;
    if (password !== expected) {
      setError("Mot de passe incorrect.");
      return;
    }
    sessionStorage.setItem(FORGE_SESSION_KEY, "1");
    onSuccess();
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-kala-green px-6 py-16 text-kala-cream">
      <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-kala-lime/20 blur-2xl" />
      <div className="absolute -bottom-40 -right-24 h-[30rem] w-[30rem] rounded-full bg-kala-mango/20 blur-2xl" />
      <form onSubmit={submit} className="relative w-full max-w-md rounded-[2.5rem] border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-kala-lime text-kala-green"><LockKeyhole size={26} /></div>
        <p className="mt-8 text-xs font-black uppercase tracking-[0.3em] text-kala-lime">Kalawang Forge</p>
        <h1 className="mt-3 font-display text-4xl font-bold uppercase leading-none">Centre de contrôle</h1>
        <p className="mt-4 text-sm leading-relaxed text-kala-cream/65">Accès privé au catalogue, aux campagnes, aux commandes et aux contenus du site.</p>
        <label className="mt-8 block">
          <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-kala-cream/60">Mot de passe</span>
          <input autoFocus type="password" value={password} onChange={(event) => { setPassword(event.target.value); setError(""); }} className="w-full rounded-2xl border border-white/15 bg-kala-ink/30 px-4 py-3.5 text-white outline-none focus:border-kala-lime" placeholder="Votre accès Forge" />
        </label>
        {error && <p className="mt-3 text-sm font-semibold text-kala-pink">{error}</p>}
        <button className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-kala-lime px-5 py-3.5 font-bold text-kala-green transition hover:bg-white"><LockKeyhole size={18} /> Ouvrir Forge</button>
        <p className="mt-5 text-center text-xs text-kala-cream/40">Accès de démonstration local, sans serveur d’authentification.</p>
      </form>
    </main>
  );
}

type TabId = "overview" | "products" | "recipes" | "marketing" | "content" | "orders" | "settings";

const tabs: { id: TabId; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "overview", label: "Vue d’ensemble", icon: LayoutDashboard },
  { id: "products", label: "Produits", icon: Package },
  { id: "recipes", label: "Recettes", icon: BookOpen },
  { id: "marketing", label: "Marketing", icon: Megaphone },
  { id: "content", label: "Contenus", icon: Video },
  { id: "orders", label: "Commandes", icon: ShoppingCart },
  { id: "settings", label: "Réglages", icon: Settings },
];

function ForgeDashboard({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<TabId>("overview");
  const [mobileOpen, setMobileOpen] = useState(false);
  const brandName = useAdminStore((state) => state.siteSettings.brandName);

  return (
    <div className="min-h-screen bg-[#f3f0e8] text-kala-ink">
      <aside className={clsx("fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-kala-ink p-5 text-kala-cream shadow-2xl transition-transform lg:translate-x-0", mobileOpen ? "translate-x-0" : "-translate-x-full")}>
        <div className="flex items-center justify-between rounded-2xl bg-white/5 p-4">
          <div><p className="text-[10px] font-black uppercase tracking-[0.25em] text-kala-lime">{brandName}</p><p className="mt-1 font-display text-2xl font-bold">FORGE</p></div>
          <button className="lg:hidden" onClick={() => setMobileOpen(false)} aria-label="Fermer"><X size={20} /></button>
        </div>
        <nav className="mt-7 flex flex-1 flex-col gap-2">
          {tabs.map((item) => {
            const Icon = item.icon;
            return <button key={item.id} onClick={() => { setTab(item.id); setMobileOpen(false); }} className={clsx("flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-bold transition", tab === item.id ? "bg-kala-lime text-kala-ink" : "text-kala-cream/65 hover:bg-white/8 hover:text-white")}><Icon size={18} /> {item.label}</button>;
          })}
        </nav>
        <div className="space-y-2 border-t border-white/10 pt-4">
          <Link to="/" target="_blank" className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-kala-cream/70 hover:bg-white/8 hover:text-white"><Eye size={18} /> Voir le site <ExternalLink size={14} className="ml-auto" /></Link>
          <button onClick={onLogout} className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-kala-cream/50 hover:bg-kala-chili/30 hover:text-white"><LogOut size={18} /> Se déconnecter</button>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-kala-ink/8 bg-[#f3f0e8]/90 px-5 py-4 backdrop-blur-xl sm:px-8">
          <div className="flex items-center gap-3">
            <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Menu"><Menu size={20} /></button>
            <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-kala-ink/35">Administration</p><h1 className="font-display text-2xl font-bold">{tabs.find((item) => item.id === tab)?.label}</h1></div>
          </div>
          <div className="hidden items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold text-kala-green shadow-sm sm:flex"><span className="h-2 w-2 rounded-full bg-kala-lime" /> Sauvegarde automatique</div>
        </header>
        <main className="p-5 sm:p-8">
          {tab === "overview" && <OverviewPanel onNavigate={setTab} />}
          {tab === "products" && <ProductsPanel />}
          {tab === "recipes" && <RecipesPanel />}
          {tab === "marketing" && <MarketingPanel />}
          {tab === "content" && <ContentPanel />}
          {tab === "orders" && <OrdersPanel />}
          {tab === "settings" && <SettingsPanel />}
        </main>
      </div>
    </div>
  );
}

function OverviewPanel({ onNavigate }: { onNavigate: (tab: TabId) => void }) {
  const products = useAdminStore((state) => state.products);
  const recipes = useAdminStore((state) => state.recipes);
  const orders = useAdminStore((state) => state.orders);
  const promotions = useAdminStore((state) => state.promotions);
  const revenue = orders.filter((order) => order.status !== "Annulée").reduce((sum, order) => sum + order.total, 0);
  const lowStock = products.filter((product) => product.active !== false && (product.stock ?? 999) <= 5);
  const activeCampaigns = promotions.filter((promotion) => promotion.active).length;

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric icon={<BarChart3 />} label="Chiffre enregistré" value={euro(revenue)} note="Commandes locales" />
        <Metric icon={<ShoppingCart />} label="Commandes" value={String(orders.length)} note={`${orders.filter((order) => order.status === "Nouvelle").length} à traiter`} />
        <Metric icon={<Package />} label="Produits actifs" value={String(products.filter((product) => product.active !== false).length)} note={`${lowStock.length} stock faible`} />
        <Metric icon={<Megaphone />} label="Campagnes actives" value={String(activeCampaigns)} note={`${recipes.filter((recipe) => recipe.active).length} recettes en vente`} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <Panel title="Centre d’action" subtitle="Les réglages importants à vérifier avant une campagne.">
          <div className="grid gap-3 sm:grid-cols-2">
            <ActionCard title="Mettre à jour un prix" description="Catalogue, promotions, stock et visuels." icon={<Package />} onClick={() => onNavigate("products")} />
            <ActionCard title="Lancer une promotion" description="Code promo, timer, popup et annonce." icon={<Megaphone />} onClick={() => onNavigate("marketing")} />
            <ActionCard title="Modifier l’accueil" description="Titres, boutons, vidéo YouTube et pied de page." icon={<Video />} onClick={() => onNavigate("content")} />
            <ActionCard title="Traiter les commandes" description="Suivi des statuts et détails clients." icon={<ShoppingCart />} onClick={() => onNavigate("orders")} />
          </div>
        </Panel>
        <Panel title="État du site" subtitle="Contrôle fonctionnel rapide.">
          <div className="space-y-3">
            <HealthRow ok={products.some((product) => product.active !== false)} label="Catalogue public" />
            <HealthRow ok={products.every((product) => product.price >= 0)} label="Prix valides" />
            <HealthRow ok={lowStock.length === 0} label={lowStock.length === 0 ? "Stocks suffisants" : `${lowStock.length} stock(s) à surveiller`} />
            <HealthRow ok={promotions.every((promo) => promo.discountPercent >= 0 && promo.discountPercent <= 100)} label="Codes promotionnels" />
          </div>
        </Panel>
      </div>

      <Panel title="Dernières commandes" subtitle="Les données apparaissent dès qu’un client valide le checkout.">
        {orders.length === 0 ? <EmptyState icon={<ShoppingCart />} title="Aucune commande enregistrée" text="Passez une commande de test sur le site pour vérifier la liaison complète." /> : <div className="divide-y divide-kala-ink/8">{orders.slice(0, 5).map((order) => <OrderLine key={order.id} order={order} />)}</div>}
      </Panel>
    </div>
  );
}

function ProductsPanel() {
  const products = useAdminStore((state) => state.products);
  const addProduct = useAdminStore((state) => state.addProduct);
  const updateProduct = useAdminStore((state) => state.updateProduct);
  const deleteProduct = useAdminStore((state) => state.deleteProduct);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(products[0]?.id ?? "");
  const filtered = products.filter((product) => `${product.name} ${product.category}`.toLowerCase().includes(search.toLowerCase()));
  const selected = products.find((product) => product.id === selectedId) ?? filtered[0];

  function createProduct() {
    const id = uid("product");
    addProduct({
      id,
      slug: id,
      name: "Nouveau produit",
      category: "salades",
      price: 0,
      unit: "unité",
      shortDescription: "Description courte du produit.",
      description: "Description détaillée du produit.",
      icon: "🥭",
      gradient: "from-kala-lime to-kala-mango",
      stock: 10,
      active: false,
      featured: false,
    });
    setSelectedId(id);
    toast.success("Produit créé");
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.78fr_1.22fr]">
      <Panel title="Catalogue" subtitle={`${products.length} référence(s)`} action={<button onClick={createProduct} className="admin-primary"><Plus size={16} /> Ajouter</button>}>
        <div className="relative mb-4"><Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-kala-ink/35" /><input value={search} onChange={(event) => setSearch(event.target.value)} className={`${inputClass} pl-11`} placeholder="Rechercher un produit" /></div>
        <div className="max-h-[70vh] space-y-2 overflow-y-auto pr-1">
          {filtered.map((product) => <button key={product.id} onClick={() => setSelectedId(product.id)} className={clsx("flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition", selected?.id === product.id ? "border-kala-green bg-kala-green/6" : "border-kala-ink/8 bg-white hover:border-kala-ink/20")}>
            <MiniImage image={product.imageDataUrl} icon={product.icon} />
            <span className="min-w-0 flex-1"><span className="block truncate text-sm font-bold">{product.name}</span><span className="mt-1 block text-xs text-kala-ink/45">{euro(product.price)} · stock {product.stock ?? "∞"}</span></span>
            <span className={clsx("h-2.5 w-2.5 rounded-full", product.active !== false ? "bg-kala-lime" : "bg-kala-ink/15")} />
          </button>)}
        </div>
      </Panel>

      {selected ? <Panel title="Fiche produit" subtitle="Chaque modification est immédiatement enregistrée et reflétée sur le site." action={<button onClick={() => { if (confirm(`Supprimer ${selected.name} ?`)) { deleteProduct(selected.id); setSelectedId(""); } }} className="admin-danger"><Trash2 size={16} /> Supprimer</button>}>
        <ProductEditor product={selected} onChange={(patch) => updateProduct(selected.id, patch)} />
      </Panel> : <Panel title="Fiche produit"><EmptyState icon={<Package />} title="Aucun produit" text="Ajoutez une première référence." /></Panel>}
    </div>
  );
}

function ProductEditor({ product, onChange }: { product: Product; onChange: (patch: Partial<Product>) => void }) {
  return (
    <div className="space-y-7">
      <div className="grid gap-6 md:grid-cols-[220px_1fr]">
        <ImageUploader value={product.imageDataUrl} icon={product.icon} onChange={(imageDataUrl) => onChange({ imageDataUrl })} />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Nom" value={product.name} onChange={(name) => onChange({ name })} />
          <TextField label="Slug" value={product.slug} onChange={(slug) => onChange({ slug })} />
          <SelectField label="Catégorie" value={product.category} options={Object.entries(categoryLabels).filter(([id]) => id !== "recettes")} onChange={(category) => onChange({ category: category as ProductCategory })} />
          <TextField label="Unité" value={product.unit} onChange={(unit) => onChange({ unit })} />
          <NumberField label="Prix de vente (€)" value={product.price} step="0.1" onChange={(price) => onChange({ price })} />
          <NumberField label="Ancien prix (€)" value={product.compareAtPrice ?? 0} step="0.1" onChange={(compareAtPrice) => onChange({ compareAtPrice: compareAtPrice || undefined })} />
          <NumberField label="Stock" value={product.stock ?? 0} step="1" onChange={(stock) => onChange({ stock })} />
          <SelectField label="Badge" value={product.badge ?? ""} options={[["", "Aucun"], ["Bestseller", "Bestseller"], ["Nouveau", "Nouveau"], ["Épicé", "Épicé"], ["Édition limitée", "Édition limitée"]]} onChange={(badge) => onChange({ badge: (badge || undefined) as Product["badge"] })} />
          <TextField label="Emoji de secours" value={product.icon} onChange={(icon) => onChange({ icon })} />
          <TextField label="Classes du dégradé" value={product.gradient} onChange={(gradient) => onChange({ gradient })} />
        </div>
      </div>
      <TextAreaField label="Description courte" value={product.shortDescription} onChange={(shortDescription) => onChange({ shortDescription })} />
      <TextAreaField label="Description détaillée" value={product.description} rows={5} onChange={(description) => onChange({ description })} />
      <div className="grid gap-3 sm:grid-cols-3">
        <Toggle label="Visible dans la boutique" checked={product.active !== false} onChange={(active) => onChange({ active })} />
        <Toggle label="Mis en avant" checked={product.featured === true} onChange={(featured) => onChange({ featured })} />
        <div className="rounded-2xl border border-kala-ink/8 bg-kala-cream p-4"><p className="text-xs font-bold uppercase tracking-wider text-kala-ink/45">État</p><p className="mt-2 text-sm font-bold">{(product.stock ?? 0) > 0 ? "Disponible à la vente" : "Rupture de stock"}</p></div>
      </div>
    </div>
  );
}

function RecipesPanel() {
  const recipes = useAdminStore((state) => state.recipes);
  const addRecipe = useAdminStore((state) => state.addRecipe);
  const updateRecipe = useAdminStore((state) => state.updateRecipe);
  const deleteRecipe = useAdminStore((state) => state.deleteRecipe);
  const [selectedId, setSelectedId] = useState(recipes[0]?.id ?? "");
  const selected = recipes.find((recipe) => recipe.id === selectedId) ?? recipes[0];

  function createRecipe() {
    const id = uid("recipe");
    addRecipe({ id, title: "Nouvelle recette", excerpt: "Résumé de la recette.", description: "Contenu et promesse de la fiche numérique.", price: 0, icon: "📖", active: false, featured: false, duration: "20 min", difficulty: "Facile" });
    setSelectedId(id);
  }

  return <div className="grid gap-6 xl:grid-cols-[0.75fr_1.25fr]">
    <Panel title="Bibliothèque" subtitle={`${recipes.length} recette(s)`} action={<button onClick={createRecipe} className="admin-primary"><Plus size={16} /> Ajouter</button>}>
      <div className="space-y-2">{recipes.map((recipe) => <button key={recipe.id} onClick={() => setSelectedId(recipe.id)} className={clsx("flex w-full items-center gap-3 rounded-2xl border p-3 text-left", selected?.id === recipe.id ? "border-kala-purple bg-kala-purple/5" : "border-kala-ink/8 bg-white")}><MiniImage image={recipe.imageDataUrl} icon={recipe.icon} /><span className="flex-1"><span className="block font-bold">{recipe.title}</span><span className="text-xs text-kala-ink/45">{euro(recipe.price)} · {recipe.duration}</span></span><span className={clsx("h-2.5 w-2.5 rounded-full", recipe.active ? "bg-kala-lime" : "bg-kala-ink/15")} /></button>)}</div>
    </Panel>
    {selected ? <Panel title="Fiche recette" subtitle="Les recettes actives apparaissent sur le site et peuvent être ajoutées au panier." action={<button onClick={() => { if (confirm(`Supprimer ${selected.title} ?`)) deleteRecipe(selected.id); }} className="admin-danger"><Trash2 size={16} /> Supprimer</button>}>
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-[220px_1fr]">
          <ImageUploader value={selected.imageDataUrl} icon={selected.icon} onChange={(imageDataUrl) => updateRecipe(selected.id, { imageDataUrl })} />
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="Titre" value={selected.title} onChange={(title) => updateRecipe(selected.id, { title })} />
            <NumberField label="Prix (€)" value={selected.price} step="0.1" onChange={(price) => updateRecipe(selected.id, { price })} />
            <TextField label="Durée" value={selected.duration} onChange={(duration) => updateRecipe(selected.id, { duration })} />
            <SelectField label="Difficulté" value={selected.difficulty} options={[["Facile", "Facile"], ["Intermédiaire", "Intermédiaire"], ["Avancé", "Avancé"]]} onChange={(difficulty) => updateRecipe(selected.id, { difficulty: difficulty as Recipe["difficulty"] })} />
            <TextField label="Emoji de secours" value={selected.icon} onChange={(icon) => updateRecipe(selected.id, { icon })} />
          </div>
        </div>
        <TextAreaField label="Résumé commercial" value={selected.excerpt} onChange={(excerpt) => updateRecipe(selected.id, { excerpt })} />
        <TextAreaField label="Description détaillée" value={selected.description} rows={5} onChange={(description) => updateRecipe(selected.id, { description })} />
        <div className="grid gap-3 sm:grid-cols-2"><Toggle label="En vente sur le site" checked={selected.active} onChange={(active) => updateRecipe(selected.id, { active })} /><Toggle label="Recette mise en avant" checked={selected.featured} onChange={(featured) => updateRecipe(selected.id, { featured })} /></div>
      </div>
    </Panel> : null}
  </div>;
}

function MarketingPanel() {
  const promotions = useAdminStore((state) => state.promotions);
  const updatePromotion = useAdminStore((state) => state.updatePromotion);
  const addPromotion = useAdminStore((state) => state.addPromotion);
  const deletePromotion = useAdminStore((state) => state.deletePromotion);
  const experience = useAdminStore((state) => state.experience);
  const setExperience = useAdminStore((state) => state.setExperience);

  function patchExperience(patch: Partial<ExperienceSettings>) {
    setExperience({ ...experience, ...patch });
  }

  function newPromotion() {
    addPromotion({ id: uid("promo"), title: "Nouvelle campagne", description: "Description de l’offre", discountLabel: "-10 %", discountPercent: 10, code: "NOUVEAU10", theme: "lime", active: false });
  }

  return <div className="space-y-6">
    <Panel title="Barre d’annonce" subtitle="Message permanent affiché sous la navigation.">
      <div className="grid gap-4 md:grid-cols-2"><Toggle label="Afficher l’annonce" checked={experience.announcement.enabled} onChange={(enabled) => patchExperience({ announcement: { ...experience.announcement, enabled } })} /><TextField label="Message" value={experience.announcement.text} onChange={(text) => patchExperience({ announcement: { ...experience.announcement, text } })} /><TextField label="Libellé du lien" value={experience.announcement.linkLabel} onChange={(linkLabel) => patchExperience({ announcement: { ...experience.announcement, linkLabel } })} /><TextField label="Cible du lien" value={experience.announcement.linkHref} onChange={(linkHref) => patchExperience({ announcement: { ...experience.announcement, linkHref } })} /></div>
    </Panel>

    <Panel title="Campagnes promotionnelles" subtitle="La première campagne active et non expirée est affichée en haut du site." action={<button onClick={newPromotion} className="admin-primary"><Plus size={16} /> Campagne</button>}>
      <div className="space-y-5">{promotions.map((promotion) => <PromotionEditor key={promotion.id} promotion={promotion} onChange={(patch) => updatePromotion(promotion.id, patch)} onDelete={() => deletePromotion(promotion.id)} />)}</div>
    </Panel>

    <Panel title="Popup marketing" subtitle="Fenêtre commerciale déclenchée après un délai configurable.">
      <div className="grid gap-4 md:grid-cols-2"><Toggle label="Activer la popup" checked={experience.popup.enabled} onChange={(enabled) => patchExperience({ popup: { ...experience.popup, enabled } })} /><Toggle label="Une fois par session" checked={experience.popup.showOncePerSession} onChange={(showOncePerSession) => patchExperience({ popup: { ...experience.popup, showOncePerSession } })} /><TextField label="Titre" value={experience.popup.title} onChange={(title) => patchExperience({ popup: { ...experience.popup, title } })} /><NumberField label="Délai (secondes)" value={experience.popup.delaySeconds} step="1" onChange={(delaySeconds) => patchExperience({ popup: { ...experience.popup, delaySeconds } })} /><TextAreaField label="Message" value={experience.popup.body} onChange={(body) => patchExperience({ popup: { ...experience.popup, body } })} /><div className="grid gap-4"><TextField label="Texte du bouton" value={experience.popup.ctaLabel} onChange={(ctaLabel) => patchExperience({ popup: { ...experience.popup, ctaLabel } })} /><TextField label="Lien du bouton" value={experience.popup.ctaHref} onChange={(ctaHref) => patchExperience({ popup: { ...experience.popup, ctaHref } })} /></div></div>
      <button onClick={() => { sessionStorage.removeItem("kalawang-popup-seen"); toast.success("La popup pourra de nouveau apparaître au prochain chargement."); }} className="admin-secondary mt-5"><RefreshCcw size={16} /> Réinitialiser le test popup</button>
    </Panel>
  </div>;
}

function PromotionEditor({ promotion, onChange, onDelete }: { promotion: Promotion; onChange: (patch: Partial<Promotion>) => void; onDelete: () => void }) {
  return <div className="rounded-[1.75rem] border border-kala-ink/8 bg-kala-cream/60 p-5">
    <div className="flex items-center justify-between gap-4"><div><p className="font-display text-xl font-bold">{promotion.title}</p><p className="text-xs text-kala-ink/45">Code : {promotion.code || "aucun"}</p></div><div className="flex items-center gap-2"><Toggle compact label="Active" checked={promotion.active} onChange={(active) => onChange({ active })} /><button onClick={() => { if (confirm("Supprimer cette campagne ?")) onDelete(); }} className="admin-icon-danger"><Trash2 size={16} /></button></div></div>
    <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4"><TextField label="Titre" value={promotion.title} onChange={(title) => onChange({ title })} /><TextField label="Description" value={promotion.description} onChange={(description) => onChange({ description })} /><TextField label="Code promo" value={promotion.code ?? ""} onChange={(code) => onChange({ code: code.toUpperCase() })} /><TextField label="Badge affiché" value={promotion.discountLabel} onChange={(discountLabel) => onChange({ discountLabel })} /><NumberField label="Réduction (%)" value={promotion.discountPercent} step="1" onChange={(discountPercent) => onChange({ discountPercent: Math.min(100, discountPercent) })} /><SelectField label="Thème" value={promotion.theme} options={Object.entries(themeLabels)} onChange={(theme) => onChange({ theme: theme as BrandTheme })} /><label><span className={labelClass}>Fin de campagne</span><input type="datetime-local" value={promotion.endAt ? promotion.endAt.slice(0, 16) : ""} onChange={(event) => onChange({ endAt: event.target.value ? new Date(event.target.value).toISOString() : undefined })} className={inputClass} /></label></div>
  </div>;
}

function ContentPanel() {
  const hero = useAdminStore((state) => state.hero);
  const setHero = useAdminStore((state) => state.setHero);
  const video = useAdminStore((state) => state.video);
  const setVideo = useAdminStore((state) => state.setVideo);
  const site = useAdminStore((state) => state.siteSettings);
  const setSite = useAdminStore((state) => state.setSiteSettings);
  const experience = useAdminStore((state) => state.experience);
  const setExperience = useAdminStore((state) => state.setExperience);

  return <div className="space-y-6">
    <Panel title="Hero de la page d’accueil" subtitle="Titre principal, accroche et boutons.">
      <div className="grid gap-4 md:grid-cols-2"><TextField label="Sur-titre" value={hero.eyebrow} onChange={(eyebrow) => setHero({ eyebrow })} /><TextField label="Première ligne" value={hero.titleLine} onChange={(titleLine) => setHero({ titleLine })} /><TextField label="Texte surligné" value={hero.titleHighlight} onChange={(titleHighlight) => setHero({ titleHighlight })} /><TextAreaField label="Accroche" value={hero.tagline} onChange={(tagline) => setHero({ tagline })} /><TextField label="Bouton principal" value={hero.ctaPrimaryLabel} onChange={(ctaPrimaryLabel) => setHero({ ctaPrimaryLabel })} /><TextField label="Bouton secondaire" value={hero.ctaSecondaryLabel} onChange={(ctaSecondaryLabel) => setHero({ ctaSecondaryLabel })} /></div>
    </Panel>
    <Panel title="Bloc vidéo YouTube" subtitle="L’URL est automatiquement convertie en lecteur intégré respectueux de la confidentialité.">
      <div className="grid gap-4 md:grid-cols-2"><Toggle label="Afficher la vidéo" checked={video.enabled} onChange={(enabled) => setVideo({ enabled })} /><TextField label="URL YouTube" value={video.youtubeUrl} onChange={(youtubeUrl) => setVideo({ youtubeUrl })} /><TextField label="Sur-titre" value={video.eyebrow} onChange={(eyebrow) => setVideo({ eyebrow })} /><TextField label="Titre" value={video.title} onChange={(title) => setVideo({ title })} /><TextAreaField label="Description" value={video.description} onChange={(description) => setVideo({ description })} /></div>
    </Panel>
    <Panel title="Identité et pied de page" subtitle="Informations globales utilisées sur plusieurs pages.">
      <div className="grid gap-4 md:grid-cols-2"><TextField label="Nom de la marque" value={site.brandName} onChange={(brandName) => setSite({ brandName })} /><TextField label="E-mail" value={site.contactEmail} onChange={(contactEmail) => setSite({ contactEmail })} /><TextField label="Localisation" value={site.location} onChange={(location) => setSite({ location })} /><TextAreaField label="Texte du pied de page" value={site.footerText} onChange={(footerText) => setSite({ footerText })} /></div>
    </Panel>
    <Panel title="Animations" subtitle="Désactivez les mouvements principaux sans casser la mise en page."><Toggle label="Animations de l’interface" checked={experience.animationsEnabled} onChange={(animationsEnabled) => setExperience({ ...experience, animationsEnabled })} /></Panel>
  </div>;
}

function OrdersPanel() {
  const orders = useAdminStore((state) => state.orders);
  const updateStatus = useAdminStore((state) => state.updateOrderStatus);
  const [selectedId, setSelectedId] = useState(orders[0]?.id ?? "");
  const selected = orders.find((order) => order.id === selectedId) ?? orders[0];
  return <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
    <Panel title="Commandes" subtitle={`${orders.length} commande(s) enregistrée(s)`}>{orders.length === 0 ? <EmptyState icon={<ShoppingCart />} title="Aucune commande" text="Le checkout créera automatiquement une fiche ici." /> : <div className="space-y-2">{orders.map((order) => <button key={order.id} onClick={() => setSelectedId(order.id)} className={clsx("w-full rounded-2xl border p-4 text-left", selected?.id === order.id ? "border-kala-green bg-kala-green/5" : "border-kala-ink/8 bg-white")}><div className="flex items-center justify-between"><span className="font-display text-lg font-bold">{order.number}</span><span className="font-bold">{euro(order.total)}</span></div><div className="mt-2 flex items-center justify-between text-xs text-kala-ink/45"><span>{order.customer.firstName} {order.customer.lastName}</span><span>{new Date(order.createdAt).toLocaleDateString("fr-FR")}</span></div></button>)}</div>}</Panel>
    {selected ? <Panel title={`Commande ${selected.number}`} subtitle={new Date(selected.createdAt).toLocaleString("fr-FR")}>
      <div className="grid gap-5 md:grid-cols-2"><div><span className={labelClass}>Statut</span><select value={selected.status} onChange={(event) => updateStatus(selected.id, event.target.value as OrderRecord["status"])} className={inputClass}>{orderStatuses.map((status) => <option key={status}>{status}</option>)}</select></div><div className="rounded-2xl bg-kala-green p-5 text-kala-cream"><p className="text-xs font-bold uppercase tracking-wider text-kala-cream/60">Total</p><p className="mt-1 font-display text-3xl font-bold">{euro(selected.total)}</p></div></div>
      <div className="mt-6 grid gap-6 md:grid-cols-2"><div><h3 className="font-display text-lg font-bold">Client</h3><div className="mt-3 space-y-1 text-sm text-kala-ink/60"><p>{selected.customer.firstName} {selected.customer.lastName}</p><p>{selected.customer.email}</p><p>{selected.customer.phone}</p><p>{selected.customer.address}</p><p>{selected.customer.postalCode} {selected.customer.city}</p></div></div><div><h3 className="font-display text-lg font-bold">Articles</h3><div className="mt-3 space-y-2">{selected.items.map((item) => <div key={item.product.id} className="flex justify-between rounded-xl bg-kala-cream p-3 text-sm"><span>{item.quantity} × {item.product.name}</span><b>{euro(item.product.price * item.quantity)}</b></div>)}</div></div></div>
      <div className="mt-6 border-t border-kala-ink/8 pt-4 text-sm"><SummaryLine label="Sous-total" value={euro(selected.subtotal)} /><SummaryLine label="Réduction" value={`-${euro(selected.discount)}`} /><SummaryLine label="Livraison" value={euro(selected.shipping)} /><SummaryLine label="Total" value={euro(selected.total)} bold /></div>
    </Panel> : null}
  </div>;
}

function SettingsPanel() {
  const commerce = useAdminStore((state) => state.commerce);
  const setCommerce = useAdminStore((state) => state.setCommerce);
  const experience = useAdminStore((state) => state.experience);
  const setExperience = useAdminStore((state) => state.setExperience);
  const importSnapshot = useAdminStore((state) => state.importSnapshot);
  const resetAll = useAdminStore((state) => state.resetAll);
  const fileRef = useRef<HTMLInputElement>(null);
  const [newPassword, setNewPassword] = useState("");

  function exportData() {
    const blob = new Blob([JSON.stringify(getAdminSnapshot(), null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `kalawang-forge-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function importData(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result)) as Partial<AdminSnapshot>;
        importSnapshot(data);
        toast.success("Configuration importée");
      } catch {
        toast.error("Fichier de configuration invalide");
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  }

  return <div className="space-y-6">
    <Panel title="Commerce et livraison" subtitle="Paramètres utilisés dans le panier et la validation de commande.">
      <div className="grid gap-4 md:grid-cols-2"><Toggle label="Autoriser les commandes" checked={commerce.salesEnabled} onChange={(salesEnabled) => setCommerce({ salesEnabled })} /><TextField label="Préfixe des commandes" value={commerce.orderPrefix} onChange={(orderPrefix) => setCommerce({ orderPrefix: orderPrefix.toUpperCase() })} /><NumberField label="Frais de livraison (€)" value={commerce.shippingFee} step="0.1" onChange={(shippingFee) => setCommerce({ shippingFee })} /><NumberField label="Livraison offerte à partir de (€)" value={commerce.freeShippingThreshold} step="1" onChange={(freeShippingThreshold) => setCommerce({ freeShippingThreshold })} /></div>
    </Panel>
    <Panel title="Mode maintenance" subtitle="Bloque le site public, sans bloquer l’URL /forge.">
      <div className="grid gap-4 md:grid-cols-2"><Toggle label="Activer la maintenance" checked={experience.maintenance.enabled} onChange={(enabled) => setExperience({ ...experience, maintenance: { ...experience.maintenance, enabled } })} /><TextField label="Titre" value={experience.maintenance.title} onChange={(title) => setExperience({ ...experience, maintenance: { ...experience.maintenance, title } })} /><TextAreaField label="Message" value={experience.maintenance.message} onChange={(message) => setExperience({ ...experience, maintenance: { ...experience.maintenance, message } })} /></div>
    </Panel>
    <Panel title="Accès Forge" subtitle="Le mot de passe reste enregistré dans ce navigateur pour cette version sans backend.">
      <div className="flex max-w-xl gap-3"><input type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} className={inputClass} placeholder="Nouveau mot de passe" /><button onClick={() => { if (newPassword.length < 8) { toast.error("Utilisez au moins 8 caractères."); return; } localStorage.setItem(FORGE_PASSWORD_KEY, newPassword); setNewPassword(""); toast.success("Mot de passe local modifié"); }} className="admin-primary shrink-0"><Save size={16} /> Enregistrer</button></div>
    </Panel>
    <Panel title="Sauvegarde et transfert" subtitle="Exportez tout le contenu pour le restaurer ou le transférer vers un autre navigateur.">
      <div className="flex flex-wrap gap-3"><button onClick={exportData} className="admin-primary"><Download size={16} /> Exporter JSON</button><button onClick={() => fileRef.current?.click()} className="admin-secondary"><Upload size={16} /> Importer JSON</button><input ref={fileRef} type="file" accept="application/json" hidden onChange={importData} /><button onClick={() => { if (confirm("Réinitialiser tous les produits, contenus, campagnes et commandes ?")) { resetAll(); toast.success("Forge réinitialisé"); } }} className="admin-danger"><RefreshCcw size={16} /> Tout réinitialiser</button></div>
    </Panel>
    <Panel title="Limite technique actuelle" subtitle="Cette version est entièrement fonctionnelle dans un navigateur, mais n’est pas encore un backend partagé.">
      <div className="rounded-2xl border border-kala-mango/30 bg-kala-mango/10 p-5 text-sm leading-relaxed text-kala-ink/70"><p className="font-bold text-kala-ink">À connecter avant une mise en production commerciale :</p><p className="mt-2">authentification serveur, base de données partagée, stockage d’images, paiement réel, e-mails transactionnels et contrôle des permissions. Le dashboard actuel permet déjà de valider toute la logique et toutes les liaisons visuelles.</p></div>
    </Panel>
  </div>;
}

function Panel({ title, subtitle, action, children }: { title: string; subtitle?: string; action?: ReactNode; children: ReactNode }) {
  return <section className="rounded-[2rem] border border-kala-ink/8 bg-white p-5 shadow-sm sm:p-6"><div className="mb-6 flex flex-wrap items-start justify-between gap-4"><div><h2 className="font-display text-2xl font-bold">{title}</h2>{subtitle && <p className="mt-1 text-sm text-kala-ink/45">{subtitle}</p>}</div>{action}</div>{children}</section>;
}

function Metric({ icon, label, value, note }: { icon: ReactNode; label: string; value: string; note: string }) {
  return <div className="rounded-[1.75rem] border border-kala-ink/8 bg-white p-5 shadow-sm"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-kala-green text-kala-lime">{icon}</div><p className="mt-5 text-xs font-bold uppercase tracking-wider text-kala-ink/40">{label}</p><p className="mt-1 font-display text-3xl font-bold">{value}</p><p className="mt-1 text-xs text-kala-ink/40">{note}</p></div>;
}

function ActionCard({ title, description, icon, onClick }: { title: string; description: string; icon: ReactNode; onClick: () => void }) {
  return <button onClick={onClick} className="group flex items-start gap-4 rounded-2xl border border-kala-ink/8 bg-kala-cream/50 p-4 text-left transition hover:-translate-y-0.5 hover:border-kala-green"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-kala-green shadow-sm">{icon}</span><span><span className="block font-bold">{title}</span><span className="mt-1 block text-xs leading-relaxed text-kala-ink/45">{description}</span></span></button>;
}

function HealthRow({ ok, label }: { ok: boolean; label: string }) {
  return <div className="flex items-center gap-3 rounded-2xl bg-kala-cream/60 p-3.5">{ok ? <CheckCircle2 size={19} className="text-kala-green" /> : <AlertTriangle size={19} className="text-kala-mango-dark" />}<span className="text-sm font-semibold">{label}</span></div>;
}

function EmptyState({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-kala-ink/15 px-6 py-12 text-center"><div className="text-kala-ink/25">{icon}</div><h3 className="mt-4 font-display text-xl font-bold">{title}</h3><p className="mt-1 max-w-sm text-sm text-kala-ink/45">{text}</p></div>;
}

function OrderLine({ order }: { order: OrderRecord }) {
  return <div className="flex flex-wrap items-center justify-between gap-3 py-4"><div><p className="font-bold">{order.number}</p><p className="text-xs text-kala-ink/40">{order.customer.firstName} {order.customer.lastName} · {new Date(order.createdAt).toLocaleString("fr-FR")}</p></div><div className="text-right"><p className="font-bold">{euro(order.total)}</p><p className="text-xs text-kala-ink/40">{order.status}</p></div></div>;
}

function MiniImage({ image, icon }: { image?: string; icon: string }) {
  return <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-kala-cream text-2xl">{image ? <img src={image} alt="" className="h-full w-full object-cover" /> : icon}</div>;
}

function ImageUploader({ value, icon, onChange }: { value?: string; icon: string; onChange: (value?: string) => void }) {
  return <div><span className={labelClass}>Image</span><div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-[1.75rem] border border-dashed border-kala-ink/20 bg-kala-cream text-6xl">{value ? <img src={value} alt="Aperçu" className="h-full w-full object-cover" /> : icon}<label className="absolute inset-x-3 bottom-3 flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-kala-ink/85 px-3 py-2 text-xs font-bold text-white backdrop-blur"><ImageIcon size={15} /> Charger<input type="file" accept="image/*" hidden onChange={(event) => { const file = event.target.files?.[0]; if (file) readImage(file, (data) => onChange(data)); event.target.value = ""; }} /></label></div>{value && <button onClick={() => onChange(undefined)} className="mt-2 w-full text-center text-xs font-bold text-kala-chili">Supprimer l’image</button>}</div>;
}

function TextField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label><span className={labelClass}>{label}</span><input value={value} onChange={(event) => onChange(event.target.value)} className={inputClass} /></label>;
}

function NumberField({ label, value, onChange, step = "1" }: { label: string; value: number; onChange: (value: number) => void; step?: string }) {
  return <label><span className={labelClass}>{label}</span><input type="number" min="0" step={step} value={Number.isFinite(value) ? value : 0} onChange={(event) => onChange(Number(event.target.value))} className={inputClass} /></label>;
}

function TextAreaField({ label, value, onChange, rows = 3 }: { label: string; value: string; onChange: (value: string) => void; rows?: number }) {
  return <label className="block"><span className={labelClass}>{label}</span><textarea value={value} rows={rows} onChange={(event) => onChange(event.target.value)} className={inputClass} /></label>;
}

function SelectField({ label, value, options, onChange }: { label: string; value: string; options: [string, string][]; onChange: (value: string) => void }) {
  return <label><span className={labelClass}>{label}</span><select value={value} onChange={(event) => onChange(event.target.value)} className={inputClass}>{options.map(([id, text]) => <option key={id} value={id}>{text}</option>)}</select></label>;
}

function Toggle({ label, checked, onChange, compact = false }: { label: string; checked: boolean; onChange: (checked: boolean) => void; compact?: boolean }) {
  return <label className={clsx("flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-kala-ink/8 bg-kala-cream/60", compact ? "px-3 py-2" : "p-4")}><span className={clsx("font-bold", compact ? "text-xs" : "text-sm")}>{label}</span><input type="checkbox" className="peer sr-only" checked={checked} onChange={(event) => onChange(event.target.checked)} /><span className="relative h-6 w-11 rounded-full bg-kala-ink/15 transition peer-checked:bg-kala-green after:absolute after:left-1 after:top-1 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition peer-checked:after:translate-x-5" /></label>;
}

function SummaryLine({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return <div className={clsx("flex justify-between py-1", bold && "mt-2 border-t border-kala-ink/8 pt-3 font-display text-lg font-bold")}><span>{label}</span><span>{value}</span></div>;
}

function euro(value: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(value || 0);
}
