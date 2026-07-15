import clsx from "clsx";

type BadgeKind = "Bestseller" | "Nouveau" | "Épicé" | "Édition limitée";

const badgeStyles: Record<BadgeKind, string> = {
  Bestseller: "bg-kala-mango text-kala-ink",
  Nouveau: "bg-kala-purple text-kala-cream",
  Épicé: "bg-kala-chili text-kala-cream",
  "Édition limitée": "bg-kala-ink text-kala-cream",
};

export function Badge({ kind }: { kind: BadgeKind }) {
  return (
    <span
      className={clsx(
        "rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide shadow-sm",
        badgeStyles[kind]
      )}
    >
      {kind}
    </span>
  );
}
